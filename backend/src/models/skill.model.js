// skill model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Skill = sequelize.define("Skill", {
  name: DataTypes.STRING,
  level: DataTypes.STRING,
});

module.exports = Skill;