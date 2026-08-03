import { getDashboardData } from "../services/dashboardService.js";

export const dashboard = async (req, res) => {
    try {
        const data = await getDashboardData(req.user.id);

        if (!data) {
            return res.status(200).json({ success: true, data: {} });
        }

        // Map snake_case database fields to camelCase aliases if your frontend UI expects them
        const formattedData = {
            ...data,
            codechefEasy: data.codechef_easy,
            codechefMedium: data.codechef_medium,
            codechefHard: data.codechef_hard,
            leetcodeEasy: data.leetcode_easy,
            leetcodeMedium: data.leetcode_medium,
            leetcodeHard: data.leetcode_hard,
            gfgEasy: data.gfg_easy,
            gfgMedium: data.gfg_medium,
            gfgHard: data.gfg_hard,
        };

        return res.json({
            success: true,
            data: formattedData
        });
    }
    catch(err){
        console.error("Dashboard Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
