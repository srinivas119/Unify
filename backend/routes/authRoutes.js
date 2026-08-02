import express from "express";

import {
    signup,
    login,
    verifyEmail,
    getCurrentUser,
    logout
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Email Verification (Supports query params & dynamic URL segments)
// Handles both /verify?token=XYZ and /verify/XYZ
router.get("/verify/:token", verifyEmail);
router.get("/verify", verifyEmail);

// Logged In User
router.get("/me", protect, getCurrentUser);

export default router;