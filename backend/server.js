import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import platformRoutes from "./routes/platformRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
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