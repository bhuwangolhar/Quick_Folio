const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const { requireAdminKey } = require("./src/middleware/adminAuth");

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

// 🔹 Middlewares
// Configure CORS - explicit origin whitelist
app.use(cors({
  origin: [
    "https://www.bhuvangolhar.space",
    "https://bhuvangolhar.space",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// 🔹 Admin validation endpoint (returns true/false without exposing key)
app.post("/api/admin/validate", requireAdminKey, (req, res) => {
  res.status(200).json({ valid: true, message: "Admin access granted" });
});

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup error:", error.message);
    process.exit(1);
  }
};

// 🔥 Initialize server
startServer();