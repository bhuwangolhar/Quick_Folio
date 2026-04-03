// skill model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Skill = sequelize.define("Skill", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  icon: DataTypes.TEXT, // URL to icon/logo image
  tools: DataTypes.TEXT, // comma-separated tools/stack
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Skill;