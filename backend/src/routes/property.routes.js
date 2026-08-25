const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// visualizador para todos
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// rutas protegidas
router.post('/', verifyToken, propertyController.createProperty);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);

module.exports = router;