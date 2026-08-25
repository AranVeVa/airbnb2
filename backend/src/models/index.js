const sequelize = require('../config/database');
const User = require('./user.model');
const Property = require('./property.model');
const Reservation = require('./reservation.model');

// usuario tiene muchas propiedades
User.hasMany(Property, { foreignKey: 'hostId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

// usuario tiene muchas Reservas
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// una propiedad tiene muchas Reservas
Property.hasMany(Reservation, { foreignKey: 'propertyId', as: 'reservations' });
Reservation.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

module.exports = {
  sequelize,
  User,
  Property,
  Reservation,
};