const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Experience = sequelize.define("Experience", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date_range: { type: DataTypes.STRING(100) },
  role: { type: DataTypes.STRING(200), allowNull: false },
  company: { type: DataTypes.STRING(200) },
  location: { type: DataTypes.STRING(100) },
  tech_stack: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Experience;
