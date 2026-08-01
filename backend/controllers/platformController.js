import pool from "../config/database.js";

// =========================
// Save Platform Usernames
// =========================

export const connectPlatforms = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      github,
      leetcode,
      codeforces,
      codechef,
      gfg,
    } = req.body;

    const existing = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [userId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `
        UPDATE platform_connections
        SET
          github_username=$1,
          leetcode_username=$2,
          codeforces_username=$3,
          codechef_username=$4,
          geeksforgeeks_username=$5,
          github_connected=true,
          leetcode_connected=true,
          codeforces_connected=true,
          codechef_connected=true,
          gfg_connected=true,
          updated_at=NOW()
        WHERE user_id=$6
        `,
        [
          github,
          leetcode,
          codeforces,
          codechef,
          gfg,
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
        ($1,$2,$3,$4,$5,$6,true,true,true,true,true)
        `,
        [
          userId,
          github,
          leetcode,
          codeforces,
          codechef,
          gfg,
        ]
      );
    }

    res.json({
      success: true,
      message: "Platforms Saved Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// Get Platform Usernames
// =========================

export const getPlatforms = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM platform_connections WHERE user_id=$1",
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0] || {},
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};