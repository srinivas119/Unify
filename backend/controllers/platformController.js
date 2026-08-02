import pool from "../config/database.js";

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "https://python-service-k16u.onrender.com";

/**
 * Helper to fetch data from Python service and update `coding_profiles` table
 */
const syncPlatformData = async (userId, platform, username) => {
  if (!username) return null;

  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/fetch/${encodeURIComponent(platform)}/${encodeURIComponent(username)}`
    );

    const result = await response.json();

    if (response.ok && result.data) {
      // Upsert stats into your existing coding_profiles table
      await pool.query(
        `
        INSERT INTO coding_profiles (user_id, platform, profile_data, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, platform) 
        DO UPDATE SET profile_data = $3, updated_at = NOW()
        `,
        [userId, platform.toLowerCase(), JSON.stringify(result.data)]
      );

      return result.data;
    }
  } catch (error) {
    console.error(`❌ Failed to sync ${platform} for ${username}:`, error);
  }
  return null;
};

// =========================
// Save Connections & Auto-Fetch Stats
// =========================
export const connectPlatforms = async (req, res) => {
  try {
    const userId = req.user.id;
    const { github, leetcode, codeforces, codechef, gfg } = req.body;

    // 1. Save/Update platform usernames in platform_connections
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

    // 2. Concurrently fetch fresh platform stats from Python
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
      message: "Platforms saved and profile stats updated successfully!",
    });
  } catch (err) {
    console.error("Platform Connection Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// =========================
// Single Platform Manual Refresh
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
// Get Platform Usernames & Coding Profiles
// =========================
export const getPlatforms = async (req, res) => {
  try {
    const connections = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [req.user.id]
    );

    const profiles = await pool.query(
      "SELECT platform, profile_data, updated_at FROM coding_profiles WHERE user_id=$1",
      [req.user.id]
    );

    res.json({
      success: true,
      connections: connections.rows[0] || {},
      profiles: profiles.rows || [],
    });
  } catch (err) {
    console.error("Get Platforms Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
