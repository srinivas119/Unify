import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  connectPlatforms,
  getPlatforms,
  updatePlatformUsername
} from "../controllers/platformController.js";

const router = express.Router();

// Save platform usernames
router.post("/connect", protect, connectPlatforms);

// Update single platform username
router.post("/update", protect, updatePlatformUsername);

// Get saved platform usernames
router.get("/", protect, getPlatforms);

export default router;