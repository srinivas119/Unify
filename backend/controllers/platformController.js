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
 * Fetch data from Python service & atomic UPSERT into `coding_profiles`
 */
const syncPlatformData = async (userId, platform, username) => {
  if (!username) return { success: false, error: "INVALID_USERNAME" };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/fetch/${encodeURIComponent(platform)}/${encodeURIComponent(username)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.status === 404) {
       return { success: false, error: "INVALID_USERNAME" };
    }
    if (response.status === 429) {
       return { success: false, error: "RATE_LIMIT" };
    }
    if (!response.ok) {
      console.error(`❌ Python service returned HTTP ${response.status} for ${platform}`);
      return { success: false, error: "SERVER_ERROR" };
    }

    const result = await response.json();
    if (!result || !result.data) {
      console.warn(`⚠️ No payload returned for platform: ${platform}`);
      return { success: false, error: "SERVER_ERROR" };
    }

    const data = result.data;

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
            JSON.stringify(data.languages || {}),
          ]
        );
        break;
      }

      case "leetcode": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);
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
        let easy = safeInt(data.easy || data.easy_solved);
        let medium = safeInt(data.medium || data.medium_solved);
        let hard = safeInt(data.hard || data.hard_solved);
        
        let totalCodechefSolved = safeInt(data.total || data.solved || data.total_solved) || (easy + medium + hard);

        // If explicit easy/medium/hard counts aren't passed, fall back to the percentage pool calculation
        if (easy === 0 && medium === 0 && hard === 0 && totalCodechefSolved > 0) {
          const poolEasy = 115;
          const poolMedium = 156;
          const poolHard = 194;
          const poolTotal = poolEasy + poolMedium + poolHard;

          easy = Math.round(totalCodechefSolved * (poolEasy / poolTotal));
          medium = Math.round(totalCodechefSolved * (poolMedium / poolTotal));
          hard = Math.max(0, totalCodechefSolved - (easy + medium));
        }

        await pool.query(
          `
          INSERT INTO coding_profiles (
            user_id, codechef_total, codechef_easy, codechef_medium, codechef_hard,
            codechef_rating, codechef_highest_rating, codechef_stars, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            codechef_total = EXCLUDED.codechef_total,
            codechef_easy = EXCLUDED.codechef_easy,
            codechef_medium = EXCLUDED.codechef_medium,
            codechef_hard = EXCLUDED.codechef_hard,
            codechef_rating = EXCLUDED.codechef_rating,
            codechef_highest_rating = EXCLUDED.codechef_highest_rating,
            codechef_stars = EXCLUDED.codechef_stars,
            updated_at = NOW();
          `,
          [
            userId,
            totalCodechefSolved,
            easy,
            medium,
            hard,
            safeInt(data.rating),
            safeInt(data.highest_rating || data.highestRating),
            data.stars || null,
          ]
        );
        break;
      }

      case "gfg": {
        const easy = safeInt(data.easy || data.easy_solved);
        const medium = safeInt(data.medium || data.medium_solved);
        const hard = safeInt(data.hard || data.hard_solved);
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

    // Recalculate total_solved summary column across all platforms
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

    return { success: true, data: result.data };
  } catch (error) {
    if (error.name === 'AbortError') {
       return { success: false, error: "TIMEOUT" };
    }
    console.error(`❌ Detailed error syncing ${platform} for user ${userId}:`, error);
    return { success: false, error: "SERVER_ERROR" };
  }
};

// =========================
// Connect Platforms & Auto-Fetch Stats
// =========================
// =========================
// Connect Platforms & Auto-Fetch Stats
// =========================
export const connectPlatforms = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // Helper to convert empty strings, whitespace, or missing fields into actual NULLs
    const cleanVal = (val) => {
      if (!val || typeof val !== "string") return null;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    };

    // Normalize input fields across various naming conventions
    const github = cleanVal(req.body.github || req.body.githubUsername || req.body.github_username);
    const leetcode = cleanVal(req.body.leetcode || req.body.leetcodeUsername || req.body.leetcode_username);
    const codeforces = cleanVal(req.body.codeforces || req.body.codeforcesUsername || req.body.codeforces_username);
    const codechef = cleanVal(req.body.codechef || req.body.codechefUsername || req.body.codechef_username);
    const gfg = cleanVal(req.body.gfg || req.body.geeksforgeeks || req.body.gfgUsername || req.body.geeksforgeeks_username);

    // COALESCE preserves previously saved usernames if a blank/null value is sent in subsequent requests
await pool.query(
  `
  INSERT INTO platform_connections (
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
    gfg_connected,
    updated_at
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
  ON CONFLICT (user_id) DO UPDATE SET

    github_username = COALESCE(EXCLUDED.github_username, platform_connections.github_username),
    leetcode_username = COALESCE(EXCLUDED.leetcode_username, platform_connections.leetcode_username),
    codeforces_username = COALESCE(EXCLUDED.codeforces_username, platform_connections.codeforces_username),
    codechef_username = COALESCE(EXCLUDED.codechef_username, platform_connections.codechef_username),
    geeksforgeeks_username = COALESCE(EXCLUDED.geeksforgeeks_username, platform_connections.geeksforgeeks_username),

    github_connected = CASE
      WHEN EXCLUDED.github_username IS NOT NULL THEN TRUE
      ELSE platform_connections.github_connected
    END,

    leetcode_connected = CASE
      WHEN EXCLUDED.leetcode_username IS NOT NULL THEN TRUE
      ELSE platform_connections.leetcode_connected
    END,

    codeforces_connected = CASE
      WHEN EXCLUDED.codeforces_username IS NOT NULL THEN TRUE
      ELSE platform_connections.codeforces_connected
    END,

    codechef_connected = CASE
      WHEN EXCLUDED.codechef_username IS NOT NULL THEN TRUE
      ELSE platform_connections.codechef_connected
    END,

    gfg_connected = CASE
      WHEN EXCLUDED.geeksforgeeks_username IS NOT NULL THEN TRUE
      ELSE platform_connections.gfg_connected
    END,

    updated_at = NOW();
  `,
  [
    userId,
    github,
    leetcode,
    codeforces,
    codechef,
    gfg,
    Boolean(github),
    Boolean(leetcode),
    Boolean(codeforces),
    Boolean(codechef),
    Boolean(gfg),
  ]
);

    // Fetch metric updates concurrently for each configured platform username
  // Read the latest usernames after saving them
const { rows } = await pool.query(
  `
  SELECT
    github_username,
    leetcode_username,
    codeforces_username,
    codechef_username,
    geeksforgeeks_username
  FROM platform_connections
  WHERE user_id = $1
  `,
  [userId]
);

const saved = rows[0];

const platformsToFetch = [
  { name: "github", username: saved.github_username },
  { name: "leetcode", username: saved.leetcode_username },
  { name: "codeforces", username: saved.codeforces_username },
  { name: "codechef", username: saved.codechef_username },
  { name: "gfg", username: saved.geeksforgeeks_username },
];

for (const platform of platformsToFetch) {
  if (platform.username) {
    console.log(`Refreshing ${platform.name}: ${platform.username}`);
    await syncPlatformData(userId, platform.name, platform.username);
  }
}

    return res.status(200).json({
      success: true,
      message: "Platforms connected and coding profiles updated!",
    });
  } catch (err) {
    console.error("❌ Platform Connection Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server internal error while connecting platforms.",
      error: err.message,
    });
  }
};



// =========================
// Single Platform Update / Edit
// =========================
export const updatePlatformUsername = async (req, res) => {
  const { platform, username } = req.body;
  const userId = req.user?.id;

  if (!platform || !username) {
    return res.status(400).json({ success: false, error: "INVALID_USERNAME", message: "Platform and username are required." });
  }

  // Define valid platforms and their corresponding DB columns
  const platformColumns = {
    github: { user: 'github_username', connected: 'github_connected' },
    leetcode: { user: 'leetcode_username', connected: 'leetcode_connected' },
    codeforces: { user: 'codeforces_username', connected: 'codeforces_connected' },
    codechef: { user: 'codechef_username', connected: 'codechef_connected' },
    geeksforgeeks: { user: 'geeksforgeeks_username', connected: 'gfg_connected' },
    gfg: { user: 'geeksforgeeks_username', connected: 'gfg_connected' }, // alias
  };

  const dbPlat = platformColumns[platform.toLowerCase()];
  if (!dbPlat) {
    return res.status(400).json({ success: false, error: "SERVER_ERROR", message: "Invalid platform specified." });
  }

  try {
    // 1. Validate against the python service FIRST
    const syncResult = await syncPlatformData(userId, platform, username);

    if (!syncResult.success) {
      return res.status(400).json({ 
          success: false, 
          error: syncResult.error,
          message: syncResult.error === "INVALID_USERNAME" ? "The username doesn't exist on this platform." : "Unable to fetch data."
      });
    }

    // 2. Only if valid, upsert into platform_connections
    await pool.query(`
        INSERT INTO platform_connections (
          user_id, ${dbPlat.user}, ${dbPlat.connected}, updated_at
        ) VALUES ($1, $2, TRUE, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          ${dbPlat.user} = EXCLUDED.${dbPlat.user},
          ${dbPlat.connected} = TRUE,
          updated_at = NOW();
      `, [userId, username]);

    return res.status(200).json({ 
        success: true, 
        message: "Platform updated successfully.",
        data: syncResult.data 
    });

  } catch (error) {
    console.error("❌ Edit platform execution error:", error);
    return res.status(500).json({ success: false, error: "SERVER_ERROR" });
  }
};

// =========================
// Get Platform Connections & Profile Stats
// =========================
export const getPlatforms = async (req, res) => {
  try {
    const connections = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [req.user.id]
    );

    const stats = await pool.query(
      "SELECT * FROM coding_profiles WHERE user_id=$1",
      [req.user.id]
    );

    return res.json({
      success: true,
      data: connections.rows[0] || {}, 
      stats: stats.rows[0] || {}, 
    });
  } catch (err) {
    console.error("Get Platforms Error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
