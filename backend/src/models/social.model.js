// social model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Social = sequelize.define("Social", {
  platform: DataTypes.STRING,
  url: DataTypes.TEXT,
});

module.exports = Social;