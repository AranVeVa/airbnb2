const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // 'Cabañas', 'Casas', 'Departamentos', 'Lofts'
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Arreglo de URLs
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Property;