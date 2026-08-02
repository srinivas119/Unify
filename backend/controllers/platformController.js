import pool from "../config/database.js";

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "https://python-service-k16u.onrender.com";

/**
 * Helper to fetch data from Python service and update individual columns in `coding_profiles`
 */
const syncPlatformData = async (userId, platform, username) => {
  if (!username) return;

  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/fetch/${encodeURIComponent(platform)}/${encodeURIComponent(username)}`
    );

    const result = await response.json();

    if (response.ok && result.data) {
      const data = result.data;

      // 1. Ensure a profile row exists for this user_id
      await pool.query(
        `
        INSERT INTO coding_profiles (user_id, updated_at)
        VALUES ($1, NOW())
        ON CONFLICT (user_id) DO NOTHING
        `,
        [userId]
      );

      // 2. Map fetched Python fields to exact PostgreSQL table columns based on platform
      switch (platform.toLowerCase()) {
        case "github":
          await pool.query(
            `
            UPDATE coding_profiles
            SET
              github_repositories = COALESCE($1, github_repositories),
              github_followers = COALESCE($2, github_followers),
              github_following = COALESCE($3, github_following),
              github_contributions = COALESCE($4, github_contributions),
              github_commits = COALESCE($5, github_commits),
              github_streak = COALESCE($6, github_streak),
              github_languages = COALESCE($7, github_languages),
              updated_at = NOW()
            WHERE user_id = $8
            `,
            [
              data.repositories || data.repos || 0,
              data.followers || 0,
              data.following || 0,
              data.contributions || 0,
              data.commits || 0,
              data.streak || 0,
              JSON.stringify(data.languages || {}),
              userId,
            ]
          );
          break;

        case "leetcode":
          await pool.query(
            `
            UPDATE coding_profiles
            SET
              leetcode_solved = COALESCE($1, leetcode_solved),
              leetcode_easy = COALESCE($2, leetcode_easy),
              leetcode_medium = COALESCE($3, leetcode_medium),
              leetcode_hard = COALESCE($4, leetcode_hard),
              leetcode_rating = COALESCE($5, leetcode_rating),
              leetcode_acceptance = COALESCE($6, leetcode_acceptance),
              leetcode_ranking = COALESCE($7, leetcode_ranking),
              leetcode_contests = COALESCE($8, leetcode_contests),
              leetcode_streak = COALESCE($9, leetcode_streak),
              updated_at = NOW()
            WHERE user_id = $10
            `,
            [
              data.solved || data.total_solved || 0,
              data.easy || 0,
              data.medium || 0,
              data.hard || 0,
              data.rating || 0,
              data.acceptance || 0,
              data.ranking || 0,
              data.contests || 0,
              data.streak || 0,
              userId,
            ]
          );
          break;

        case "codeforces":
          await pool.query(
            `
            UPDATE coding_profiles
            SET
              codeforces_rating = COALESCE($1, codeforces_rating),
              codeforces_max_rating = COALESCE($2, codeforces_max_rating),
              codeforces_rank = COALESCE($3, codeforces_rank),
              codeforces_contests = COALESCE($4, codeforces_contests),
              codeforces_total = COALESCE($5, codeforces_total),
              updated_at = NOW()
            WHERE user_id = $6
            `,
            [
              data.rating || 0,
              data.max_rating || data.maxRating || 0,
              data.rank || null,
              data.contests || 0,
              data.total || data.solved || 0,
              userId,
            ]
          );
          break;

        case "codechef":
          await pool.query(
            `
            UPDATE coding_profiles
            SET
              codechef_rating = COALESCE($1, codechef_rating),
              codechef_highest_rating = COALESCE($2, codechef_highest_rating),
              codechef_stars = COALESCE($3, codechef_stars),
              codechef_total = COALESCE($4, codechef_total),
              updated_at = NOW()
            WHERE user_id = $5
            `,
            [
              data.rating || 0,
              data.highest_rating || data.highestRating || 0,
              data.stars || null,
              data.total || data.solved || 0,
              userId,
            ]
          );
          break;

        case "gfg":
          await pool.query(
            `
            UPDATE coding_profiles
            SET
              gfg_score = COALESCE($1, gfg_score),
              gfg_total = COALESCE($2, gfg_total),
              gfg_easy = COALESCE($3, gfg_easy),
              gfg_medium = COALESCE($4, gfg_medium),
              gfg_hard = COALESCE($5, gfg_hard),
              gfg_institute_rank = COALESCE($6, gfg_institute_rank),
              updated_at = NOW()
            WHERE user_id = $7
            `,
            [
              data.score || 0,
              data.total || data.solved || 0,
              data.easy || 0,
              data.medium || 0,
              data.hard || 0,
              data.institute_rank || data.rank || 0,
              userId,
            ]
          );
          break;
      }

      // 3. Recalculate total_solved across all platforms
      await pool.query(
        `
        UPDATE coding_profiles
        SET total_solved = (
          COALESCE(leetcode_solved, 0) + 
          COALESCE(codeforces_total, 0) + 
          COALESCE(codechef_total, 0) + 
          COALESCE(gfg_total, 0)
        )
        WHERE user_id = $1
        `,
        [userId]
      );

      return result.data;
    }
  } catch (error) {
    console.error(`❌ Failed to sync ${platform} for user ${userId}:`, error);
  }
  return null;
};

// =========================
// Save Connections & Auto-Fetch Profile Data
// =========================
export const connectPlatforms = async (req, res) => {
  try {
    const userId = req.user.id;
    const { github, leetcode, codeforces, codechef, gfg } = req.body;

    // 1. Save connections
    const existing = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [userId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `
        UPDATE platform_connections
        SET
          github_username = $1,
          leetcode_username = $2,
          codeforces_username = $3,
          codechef_username = $4,
          geeksforgeeks_username = $5,
          github_connected = $6,
          leetcode_connected = $7,
          codeforces_connected = $8,
          codechef_connected = $9,
          gfg_connected = $10,
          updated_at = NOW()
        WHERE user_id = $11
        `,
        [
          github || null,
          leetcode || null,
          codeforces || null,
          codechef || null,
          gfg || null,
          Boolean(github),
          Boolean(leetcode),
          Boolean(codeforces),
          Boolean(codechef),
          Boolean(gfg),
          userId,
        ]
      );
    } else {
      await pool.query(
        `
        INSERT INTO platform_connections
        (
          user_id,
          github_username,
          leetcode_username,
          codeforces_username,
          codechef_username,
          geeksforgeeks_username,
          github_connected,
          leetcode_connected,
          codeforces_connected,
          codechef_connected,
          gfg_connected
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          userId,
          github || null,
          leetcode || null,
          codeforces || null,
          codechef || null,
          gfg || null,
          Boolean(github),
          Boolean(leetcode),
          Boolean(codeforces),
          Boolean(codechef),
          Boolean(gfg),
        ]
      );
    }

    // 2. Concurrently fetch and populate coding_profiles table columns
    const platformsToFetch = [
      { name: "github", username: github },
      { name: "leetcode", username: leetcode },
      { name: "codeforces", username: codeforces },
      { name: "codechef", username: codechef },
      { name: "gfg", username: gfg },
    ];

    const syncPromises = platformsToFetch
      .filter((p) => Boolean(p.username))
      .map((p) => syncPlatformData(userId, p.name, p.username));

    await Promise.all(syncPromises);

    res.json({
      success: true,
      message: "Platforms connected and coding profiles updated!",
    });
  } catch (err) {
    console.error("Platform Connection Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// =========================
// Manual Refresh for Single Platform
// =========================
export const runPlatformScript = async (req, res) => {
  const { platform, username } = req.body;
  const userId = req.user?.id;

  if (!platform || !username) {
    return res.status(400).json({ error: "Platform and username are required." });
  }

  try {
    const fetchedData = await syncPlatformData(userId, platform, username);

    if (!fetchedData) {
      return res.status(500).json({ error: "Failed to fetch platform data." });
    }

    return res.status(200).json({ success: true, data: fetchedData });
  } catch (error) {
    console.error("❌ Python Service Error:", error);
    return res.status(500).json({ error: "Failed to connect to Python backend." });
  }
};

// =========================
// Get Platform Connections & Coding Profile Stats
// =========================
export const getPlatforms = async (req, res) => {
  try {
    const connections = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [req.user.id]
    );

    const profile = await pool.query(
      "SELECT * FROM coding_profiles WHERE user_id=$1",
      [req.user.id]
    );

    res.json({
      success: true,
      connections: connections.rows[0] || {},
      profile: profile.rows[0] || {},
    });
  } catch (err) {
    console.error("Get Platforms Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
