import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import platformRoutes from "./routes/platformRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, localhost, or any vercel.app preview domain
      if (!origin || origin.includes("localhost") || origin.endsWith(".vercel.app") || origin === "https://unify-pink.vercel.app") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.get("/", (req, res) => {

    res.send("🚀 Welcome To UnifyCode Backend");

});

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/platforms", platformRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server Running On http://localhost:${PORT}`
    );

});
