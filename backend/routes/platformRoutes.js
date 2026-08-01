import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  connectPlatforms,
  getPlatforms,
} from "../controllers/platformController.js";

const router = express.Router();

// Save platform usernames
router.post("/connect", protect, connectPlatforms);

// Get saved platform usernames
router.get("/", protect, getPlatforms);

export default router;