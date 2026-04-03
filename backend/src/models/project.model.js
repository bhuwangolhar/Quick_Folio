//project model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Project = sequelize.define("Project", {
  year: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  techStack: DataTypes.TEXT, // comma-separated
  media_type: DataTypes.STRING, // "image" or "video"
  media_url: DataTypes.TEXT,
  github: DataTypes.TEXT,
  live: DataTypes.TEXT,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Project;