// certification model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Certification = sequelize.define("Certification", {
  name: DataTypes.STRING,
  provider: DataTypes.STRING,
  year: DataTypes.STRING,
  description: DataTypes.TEXT,
  tools: DataTypes.TEXT, // comma-separated
  credential_url: DataTypes.TEXT,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Certification;
