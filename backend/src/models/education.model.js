// education model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Education = sequelize.define("Education", {
  degree: DataTypes.STRING,
  institution: DataTypes.STRING,
  location: DataTypes.STRING,
  duration: DataTypes.STRING, // e.g., "2018 - 2022"
  description: DataTypes.TEXT,
  skills: DataTypes.TEXT, // comma-separated
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Education;
