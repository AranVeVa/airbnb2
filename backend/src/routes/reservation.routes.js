const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
//requiere login 
router.post('/', verifyToken, reservationController.createReservation);
router.get('/my-reservations', verifyToken, reservationController.getUserReservations);
router.put('/:id/cancel', verifyToken, reservationController.cancelReservation);
router.put('/:id', verifyToken, reservationController.updateReservation);

module.exports = router;