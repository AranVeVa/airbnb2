const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const reservationRoutes = require('./routes/reservation.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reservations', reservationRoutes);

module.exports = app;