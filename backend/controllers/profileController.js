import { getProfileByUserId, upsertProfile } from "../services/profileService.js";

// ========================================
// GET USER PROFILE
// ========================================
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const profile = await getProfileByUserId(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile
        });
    } catch (err) {
        console.error("Get Profile Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: err.message
        });
    }
};

// ========================================
// UPDATE / SAVE USER PROFILE
// ========================================
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updatedProfile = await upsertProfile(userId, req.body);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to save profile data",
            error: err.message
        });
    }
};
