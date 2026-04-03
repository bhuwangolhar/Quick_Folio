//project model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Project = sequelize.define("Project", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  techStack: DataTypes.STRING,
  github: DataTypes.STRING,
  live: DataTypes.STRING,
});

module.exports = Project;