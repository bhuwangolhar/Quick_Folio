const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const About = sequelize.define("About", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  section: { type: DataTypes.STRING(100), defaultValue: "01 - ABOUT" },
  heading: { type: DataTypes.TEXT, allowNull: false },
  subtitle: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  code_filename: { type: DataTypes.STRING(100), defaultValue: "config.json" },
  code_content: { type: DataTypes.TEXT },
  stat1_value: { type: DataTypes.STRING(50) },
  stat1_label: { type: DataTypes.STRING(100) },
  stat2_value: { type: DataTypes.STRING(50) },
  stat2_label: { type: DataTypes.STRING(100) },
  stat3_value: { type: DataTypes.STRING(50) },
  stat3_label: { type: DataTypes.STRING(100) },
  stat4_value: { type: DataTypes.STRING(50) },
  stat4_label: { type: DataTypes.STRING(100) },
});

module.exports = About;
