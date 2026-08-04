import { useEffect, useState } from "react";
import api from "../services/api";

const useDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {

                const response = await api.get("/dashboard");

                const data = response.data.data;

                setDashboard({

                    greeting: "Welcome Back 👋",

                    name: data.username,

                    email: data.email,

                    score: {

                        value: data.total_solved || 0,

                        status: "Active",

                        rank: "Beginner"

                    },

                   codingScore: {

    total:
        (data.leetcode_solved || 0) +
        (data.github_repositories || 0) +
        (data.codechef_total || 0) +
        (data.codeforces_total || 0) +
        (data.gfg_total || 0),

    platforms: [

        {
            name: "GitHub",
            solved: data.github_repositories || 0
        },

        {
            name: "LeetCode",
            solved: data.leetcode_solved || 0
        },

        {
            name: "CodeChef",
            solved: data.codechef_total || 0
        },

        {
            name: "Codeforces",
            solved: data.codeforces_total || 0
        },

        {
            name: "GeeksforGeeks",
            solved: data.gfg_total || 0
        }

    ]

},

                    github: {

                        repositories: data.github_repositories || 0,

                        followers: data.github_followers || 0,

                        following: data.github_following || 0,

                        contributions: data.github_contributions || 0,

                        commits: data.github_commits || 0,

                        languages: data.github_languages || {}

                    },

                    leetcode: {

                        total: data.leetcode_solved || 0,

                        easy: data.leetcode_easy || 0,

                        medium: data.leetcode_medium || 0,

                        hard: data.leetcode_hard || 0,

                        rating: data.leetcode_rating || 0,

                        acceptance: data.leetcode_acceptance || 0,

                        ranking: data.leetcode_ranking || 0,

                        contests: data.leetcode_contests || 0,

                        streak: data.leetcode_streak || 0

                    },

                    codeforces: {

                        total: data.codeforces_total || 0,

                        rating: data.codeforces_rating || 0,

                        maxRating: data.codeforces_max_rating || 0,

                        rank: data.codeforces_rank || "Unrated",

                        contests: data.codeforces_contests || 0

                    },

                 codechef: {
    total: data.codechef_total || 0,

    easy: data.codechef_easy || 0,
    medium: data.codechef_medium || 0,
    hard: data.codechef_hard || 0,

    rating: data.codechef_rating || 0,
    highestRating: data.codechef_highest_rating || 0,
    stars: data.codechef_stars || "N/A"
},
                    geeksforgeeks: {

                        total: data.gfg_total || 0,

                        easy: data.gfg_easy || 0,

                        medium: data.gfg_medium || 0,

                        hard: data.gfg_hard || 0,

                        score: data.gfg_score || 0,

                        instituteRank: data.gfg_institute_rank || 0

                    },

                 platforms: {
    github: {
        connected: data.github_connected,
        username: data.github_username,
    },

    leetcode: {
        connected: data.leetcode_connected,
        username: data.leetcode_username,
    },

    codeforces: {
        connected: data.codeforces_connected,
        username: data.codeforces_username,
    },

    codechef: {
        connected: data.codechef_connected,
        username: data.codechef_username,
    },

    gfg: {
        connected: data.gfg_connected,
        username: data.geeksforgeeks_username,
    }
}

                });

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return {
        dashboard,
        loading,
        error,
        refetch: fetchDashboard
    };

};

export default useDashboard;
