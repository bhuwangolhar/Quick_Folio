// profile model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Profile = sequelize.define("Profile", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contact_bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resume: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Profile;