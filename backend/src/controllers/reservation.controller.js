const { Reservation, Property, User } = require('../models');

const reservationController = {
    async createReservation(req, res) {
        try {
            const { propertyId, startDate, endDate, totalPrice } = req.body;

            if (!propertyId || !startDate || !endDate || !totalPrice) {
                return res.status(400).json({ error: 'Faltan datos para realizar la reserva.' });
            }

            const property = await Property.findByPk(propertyId);
            if (!property) {
                return res.status(404).json({ error: 'La propiedad a reservar no existe.' });
            }

            const reservation = await Reservation.create({
                propertyId,
                userId: req.user.id, 
                startDate,
                endDate,
                totalPrice,
                status: 'confirmed',
            });

            return res.status(201).json({
                message: '¡Reserva realizada con éxito!',
                reservation,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al procesar la reserva.' });
        }
    },

    async getUserReservations(req, res) {
        try {
            const reservations = await Reservation.findAll({
                where: { userId: req.user.id },
                include: [{ model: Property, as: 'property' }],
                order: [['createdAt', 'DESC']],
            });

            return res.json(reservations);
        } catch (error) {
            return res.status(500).json({ error: 'Error al consultar tus reservas.' });
        }
    },

    async cancelReservation(req, res) {
        try {
            const { id } = req.params;
            const reservation = await Reservation.findByPk(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reserva no encontrada.' });
            }

            if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes autorización para cancelar esta reserva.' });
            }

            await reservation.update({ status: 'cancelled' });
            return res.json({ message: 'Reserva cancelada correctamente.', reservation });
        } catch (error) {
            return res.status(500).json({ error: 'Error al cancelar la reserva.' });
        }
    },

    async updateReservation(req, res) {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.body;

            const reservation = await Reservation.findByPk(id);
            if (!reservation) {
                return res.status(404).json({ error: 'Reserva no encontrada.' });
            }

            if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes autorización para modificar esta reserva.' });
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) {
                return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la entrada.' });
            }

            const property = await Property.findByPk(reservation.propertyId);
            const totalPrice = property.pricePerNight * diffDays;

            await reservation.update({ startDate, endDate, totalPrice });

            return res.json({ message: 'Reserva actualizada correctamente.', reservation });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al actualizar la reserva.' });
        }
    }
};

module.exports = reservationController;