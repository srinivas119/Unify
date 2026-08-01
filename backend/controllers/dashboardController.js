import { getDashboardData } from "../services/dashboardService.js";

export const dashboard = async (req, res) => {

    try {

        const data = await getDashboardData(req.user.id);

        return res.json({

            success: true,

            data

        });

    }

    catch(err){

        console.log(err);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};