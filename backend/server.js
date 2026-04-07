const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");

// 🔥 Import ALL models (important for Sequelize sync)
require("./src/models");

// 🔥 Import routes
const profileRoutes = require("./src/routes/profile.routes");
const projectRoutes = require("./src/routes/project.routes");
const skillRoutes = require("./src/routes/skill.routes");
const socialRoutes = require("./src/routes/social.routes");
const aboutRoutes = require("./src/routes/about.routes");
const experienceRoutes = require("./src/routes/experience.routes");
const certificationRoutes = require("./src/routes/certification.routes");
const educationRoutes = require("./src/routes/education.routes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// 🔹 Middlewares
// Configure CORS for production - allow specific origins
const corsOptions = {
  origin: isProduction
    ? process.env.FRONTEND_URL || true // Set FRONTEND_URL in production
    : true, // Allow all origins in development
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// 🔹 API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/education", educationRoutes);

// 🔹 Health check route (important for production)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Portfolio API running",
    status: "OK",
  });
});

// 🔹 Start server function
const startServer = async () => {
  try {
    // DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Schema managed by migrations - no auto-sync to preserve data integrity
    console.log("🔒 Schema managed by Sequelize migrations");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup error:", error.message);
    process.exit(1);
  }
};

// 🔥 Initialize server
startServer();