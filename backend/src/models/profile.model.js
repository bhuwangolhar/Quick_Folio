// profile model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Profile = sequelize.define("Profile", {
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  bio: DataTypes.TEXT,
  avatar: DataTypes.STRING,
  resume: DataTypes.STRING,
});

module.exports = Profile;