const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use DATABASE_URL for Neon (production) or fallback to individual env vars (development)
const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    protocol: "postgres",
    logging: false, // Set to true for SQL query logs
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
