import express from "express";

import {
    signup,
    login,
    verifyEmail,
    getCurrentUser,
    logout,
    forgotPassword,
    resetPassword,
    resendVerification
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification);

// Email Verification (Supports query params & dynamic URL segments)
// Handles both /verify?token=XYZ and /verify/XYZ
router.get("/verify/:token", verifyEmail);
router.get("/verify", verifyEmail);

// Logged In User
router.get("/me", protect, getCurrentUser);

export default router;