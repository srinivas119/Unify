import pool from "../config/database.js";

export const getDashboardData = async (userId) => {

    const result = await pool.query(
        `
        SELECT

            u.id,
            u.username,
            u.email,
            u.profile_image,

            p.full_name,
            p.college,
            p.branch,
            p.year_of_study,
            p.bio,
            p.location,
            p.github_url,
            p.linkedin_url,
            p.website_url,

            cp.total_solved,

            cp.github_repositories,
            cp.github_followers,
            cp.github_following,
            cp.github_languages,
            cp.github_commits,
            cp.github_contributions,
            cp.github_streak,

            cp.leetcode_solved,
            cp.leetcode_easy,
            cp.leetcode_medium,
            cp.leetcode_hard,
            cp.leetcode_rating,
            cp.leetcode_acceptance,
            cp.leetcode_ranking,
            cp.leetcode_contests,
            cp.leetcode_streak,

            cp.codeforces_rating,
            cp.codeforces_max_rating,
            cp.codeforces_rank,
            cp.codeforces_total,
            cp.codeforces_contests,

            cp.codechef_rating,
            cp.codechef_highest_rating,
            cp.codechef_stars,
            cp.codechef_total,
            cp.codechef_easy,      
            cp.codechef_medium,    
            cp.codechef_hard,      

            cp.gfg_total,
            cp.gfg_easy,
            cp.gfg_medium,
            cp.gfg_hard,
            cp.gfg_score,
            cp.gfg_institute_rank,

           pc.github_connected,
pc.leetcode_connected,
pc.codeforces_connected,
pc.codechef_connected,
pc.gfg_connected,

pc.github_username,
pc.leetcode_username,
pc.codeforces_username,
pc.codechef_username,
pc.geeksforgeeks_username

        FROM users u

        LEFT JOIN profiles p
        ON u.id = p.user_id

        LEFT JOIN coding_profiles cp
        ON u.id = cp.user_id

        LEFT JOIN platform_connections pc
        ON u.id = pc.user_id

        WHERE u.id=$1
        `,
        [userId]
    );

    return result.rows[0];
};
