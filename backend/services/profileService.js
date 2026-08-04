import pool from "../config/database.js";

// Ensure profiles table exists & has all required columns
const ensureProfilesTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id SERIAL PRIMARY KEY,
                user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                full_name VARCHAR(255),
                phone VARCHAR(50),
                college VARCHAR(255),
                branch VARCHAR(255),
                year_of_study VARCHAR(50),
                bio TEXT,
                location VARCHAR(255),
                github_url VARCHAR(255),
                linkedin_url VARCHAR(255),
                website_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_study VARCHAR(50);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
        `);
    } catch (err) {
        console.error("Error creating/updating profiles table:", err);
    }
};

// Run check on service initialization
ensureProfilesTable();

export const getProfileByUserId = async (userId) => {
    await ensureProfilesTable();
    const result = await pool.query(
        `
        SELECT 
            u.id, 
            u.username, 
            u.email,
            p.full_name,
            p.phone,
            p.college,
            p.branch,
            p.year_of_study,
            p.bio,
            p.location,
            p.github_url,
            p.linkedin_url,
            p.website_url
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.id = $1
        `,
        [userId]
    );

    return result.rows[0];
};

export const upsertProfile = async (userId, profileData) => {
    await ensureProfilesTable();
    const {
        full_name,
        phone,
        college,
        branch,
        year_of_study,
        bio,
        location,
        github_url,
        linkedin_url,
        website_url
    } = profileData;

    const result = await pool.query(
        `
        INSERT INTO profiles (
            user_id,
            full_name,
            phone,
            college,
            branch,
            year_of_study,
            bio,
            location,
            github_url,
            linkedin_url,
            website_url,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            college = EXCLUDED.college,
            branch = EXCLUDED.branch,
            year_of_study = EXCLUDED.year_of_study,
            bio = EXCLUDED.bio,
            location = EXCLUDED.location,
            github_url = EXCLUDED.github_url,
            linkedin_url = EXCLUDED.linkedin_url,
            website_url = EXCLUDED.website_url,
            updated_at = NOW()
        RETURNING *
        `,
        [
            userId,
            full_name || null,
            phone || null,
            college || null,
            branch || null,
            year_of_study || null,
            bio || null,
            location || null,
            github_url || null,
            linkedin_url || null,
            website_url || null
        ]
    );

    return result.rows[0];
};
