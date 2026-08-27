const { Sequelize } = require('sequelize');
require('dotenv').config();

// Si la URL contiene neon.tech, aplicamos SSL (producción), si no, no
const isProduction = process.env.DATABASE_URL?.includes('neon.tech');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: isProduction ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
  logging: false
});

module.exports = sequelize;