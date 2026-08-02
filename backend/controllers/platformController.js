import pool from "../config/database.js";

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "https://python-service-k16u.onrender.com";

/**
 * Safe conversion helpers to prevent NaN/null issues in PostgreSQL
 */
const safeInt = (val) => {
  if (val === null || val === undefined) return 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
};

const safeFloat = (val) => {
  if (val === null || val === undefined) return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Helper to fetch data from Python service and atomic UPSERT into `coding_profiles`
 */
const syncPlatformData = async (userId, platform, username) => {
  if (!username) return null;

  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/fetch/${encodeURIComponent(platform)}/${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      console.error(`❌ Python service returned HTTP ${response.status} for ${platform}`);
      return null;
    }

    const result = await response.json();
    if (!result || !result.data) {
      console.warn(`⚠️ No data payload returned for platform: ${platform}`);
      return null;
    }

    const data = result.data;

    // Atomic UPSERT based on platform
    switch (platform.toLowerCase()) {
      case "github": {
        const repositories = safeInt(data.repositories || data.repos || data.public_repos);
        const followers = safeInt(data.followers);
        const following = safeInt(data.following);
        const contributions = safeInt(data.contributions || data.total_contributions);
        const commits = safeInt(data.commits || data.total_commits);
        const streak = safeInt(data.streak || data.current_streak);

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, github_repositories, github_followers, github_following,
            github_contributions, github_commits, github_streak, github_languages, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            github_repositories = EXCLUDED.github_repositories,
            github_followers = EXCLUDED.github_followers,
            github_following = EXCLUDED.github_following,
            github_contributions = EXCLUDED.github_contributions,
            github_commits = EXCLUDED.github_commits,
            github_streak = EXCLUDED.github_streak,
            github_languages = EXCLUDED.github_languages,
            updated_at = NOW();
          `,
          [
            userId,
            repositories,
            followers,
            following,
            contributions,
            commits,
            streak,
            data.languages || {}, // Raw object for JSONB
          ]
        );
        break;
      }

      case "leetcode": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);

        // Fallback: Calculate total solved if payload returns 0 or missing key
        const totalLeetCodeSolved =
          safeInt(data.solved || data.total_solved || data.solved_count) || (easy + medium + hard);

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, leetcode_solved, leetcode_easy, leetcode_medium, leetcode_hard,
            leetcode_rating, leetcode_acceptance, leetcode_ranking, leetcode_contests, leetcode_streak, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            leetcode_solved = EXCLUDED.leetcode_solved,
            leetcode_easy = EXCLUDED.leetcode_easy,
            leetcode_medium = EXCLUDED.leetcode_medium,
            leetcode_hard = EXCLUDED.leetcode_hard,
            leetcode_rating = EXCLUDED.leetcode_rating,
            leetcode_acceptance = EXCLUDED.leetcode_acceptance,
            leetcode_ranking = EXCLUDED.leetcode_ranking,
            leetcode_contests = EXCLUDED.leetcode_contests,
            leetcode_streak = EXCLUDED.leetcode_streak,
            updated_at = NOW();
          `,
          [
            userId,
            totalLeetCodeSolved,
            easy,
            medium,
            hard,
            safeInt(data.rating),
            safeFloat(data.acceptance || data.acceptance_rate),
            safeInt(data.ranking || data.global_ranking),
            safeInt(data.contests || data.attended_contests),
            safeInt(data.streak),
          ]
        );
        break;
      }

      case "codeforces": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);

        // Fallback: If 'total' or 'solved' isn't explicitly provided, fallback to sum or 0
        const totalCodeforcesSolved =
          safeInt(data.total || data.solved || data.total_solved) || (easy + medium + hard);

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, codeforces_rating, codeforces_max_rating, codeforces_rank,
            codeforces_contests, codeforces_total, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            codeforces_rating = EXCLUDED.codeforces_rating,
            codeforces_max_rating = EXCLUDED.codeforces_max_rating,
            codeforces_rank = EXCLUDED.codeforces_rank,
            codeforces_contests = EXCLUDED.codeforces_contests,
            codeforces_total = EXCLUDED.codeforces_total,
            updated_at = NOW();
          `,
          [
            userId,
            safeInt(data.rating),
            safeInt(data.max_rating || data.maxRating),
            data.rank || null,
            safeInt(data.contests),
            totalCodeforcesSolved,
          ]
        );
        break;
      }

      case "codechef": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);

        // Fallback: Calculate total solved if payload omits 'total'
        const totalCodechefSolved =
          safeInt(data.total || data.solved || data.total_solved) || (easy + medium + hard);

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, codechef_rating, codechef_highest_rating, codechef_stars,
            codechef_total, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            codechef_rating = EXCLUDED.codechef_rating,
            codechef_highest_rating = EXCLUDED.codechef_highest_rating,
            codechef_stars = EXCLUDED.codechef_stars,
            codechef_total = EXCLUDED.codechef_total,
            updated_at = NOW();
          `,
          [
            userId,
            safeInt(data.rating),
            safeInt(data.highest_rating || data.highestRating),
            data.stars || null,
            totalCodechefSolved,
          ]
        );
        break;
      }

      case "gfg": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);

        // Fallback: Calculate total solved if payload omits 'total'
        const totalGfgSolved =
          safeInt(data.total || data.solved || data.total_solved) || (easy + medium + hard);

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, gfg_score, gfg_total, gfg_easy, gfg_medium,
            gfg_hard, gfg_institute_rank, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            gfg_score = EXCLUDED.gfg_score,
            gfg_total = EXCLUDED.gfg_total,
            gfg_easy = EXCLUDED.gfg_easy,
            gfg_medium = EXCLUDED.gfg_medium,
            gfg_hard = EXCLUDED.gfg_hard,
            gfg_institute_rank = EXCLUDED.gfg_institute_rank,
            updated_at = NOW();
          `,
          [
            userId,
            safeInt(data.score || data.overall_score),
            totalGfgSolved,
            easy,
            medium,
            hard,
            safeInt(data.institute_rank || data.rank || data.college_rank),
          ]
        );
        break;
      }
    }

    // Recalculate total_solved summary column across ALL platforms
    await pool.query(
      `
      UPDATE coding_profiles
      SET total_solved = (
        COALESCE(leetcode_solved, 0) + 
        COALESCE(codeforces_total, 0) + 
        COALESCE(codechef_total, 0) + 
        COALESCE(gfg_total, 0)
      )
      WHERE user_id = $1;
      `,
      [userId]
    );

    return result.data;
  } catch (error) {
    console.error(`❌ Failed to sync ${platform} for user ${userId}:`, error.message);
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

    // 1. Save or update platform connections
    await pool.query(
      `
      INSERT INTO platform_connections (
        user_id, github_username, leetcode_username, codeforces_username,
        codechef_username, geeksforgeeks_username, github_connected,
        leetcode_connected, codeforces_connected, codechef_connected, gfg_connected, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        github_username = EXCLUDED.github_username,
        leetcode_username = EXCLUDED.leetcode_username,
        codeforces_username = EXCLUDED.codeforces_username,
        codechef_username = EXCLUDED.codechef_username,
        geeksforgeeks_username = EXCLUDED.geeksforgeeks_username,
        github_connected = EXCLUDED.github_connected,
        leetcode_connected = EXCLUDED.leetcode_connected,
        codeforces_connected = EXCLUDED.codeforces_connected,
        codechef_connected = EXCLUDED.codechef_connected,
        gfg_connected = EXCLUDED.gfg_connected,
        updated_at = NOW();
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

    // 2. Fetch platform metrics concurrently
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
