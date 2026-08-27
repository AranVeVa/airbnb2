const { Property, User } = require('../models');
const { Op } = require('sequelize');

const propertyController = {
    // Obtener todas las propiedades con filtros opcionales
    async getProperties(req, res) {
        try {
            const { category, location, minPrice, maxPrice, guests } = req.query;
            const whereClause = {};

            // Filtro por categoría
            if (category && category !== 'Todos') {
                whereClause.category = { [Op.iLike]: category };
            }

            // Buscador por Destino / Ubicación
            if (location) {
                whereClause.location = { [Op.iLike]: `%${location}%` };
            }

            // Filtro por capacidad de huéspedes
            if (guests) {
                whereClause.maxGuests = { [Op.gte]: parseInt(guests) };
            }

            // Filtro por rango de precios
            if (minPrice || maxPrice) {
                whereClause.pricePerNight = {};
                if (minPrice) whereClause.pricePerNight[Op.gte] = parseFloat(minPrice);
                if (maxPrice) whereClause.pricePerNight[Op.lte] = parseFloat(maxPrice);
            }

            const properties = await Property.findAll({
                where: whereClause,
                include: [{ model: User, as: 'host', attributes: ['id', 'name', 'email'] }],
                order: [['createdAt', 'DESC']],
            });

            return res.json(properties);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las propiedades.' });
        }
    },

    // un solo alojamiento por id 
    async getPropertyById(req, res) {
        try {
            const { id } = req.params;
            const property = await Property.findByPk(id, {
                include: [{ model: User, as: 'host', attributes: ['id', 'name', 'email'] }],
            });

            if (!property) {
                return res.status(404).json({ error: 'Propiedad no encontrada.' });
            }

            return res.json(property);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener detalle de la propiedad.' });
        }
    },

    // crear propiedad
    async createProperty(req, res) {
        try {
            const { title, category, location, description, pricePerNight, maxGuests, images } = req.body;

            if (!title || !category || !location || !pricePerNight || !maxGuests) {
                return res.status(400).json({ error: 'Faltan campos obligatorios para registrar la propiedad.' });
            }

            const newProperty = await Property.create({
                title,
                category,
                location,
                description,
                pricePerNight,
                maxGuests,
                images: images || [],
                hostId: req.user.id, // id del usuario autenticado
            });

            return res.status(201).json(newProperty);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear la propiedad.' });
        }
    },

    // Editar propiedad
    async updateProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await Property.findByPk(id);

            if (!property) {
                return res.status(404).json({ error: 'Propiedad no encontrada.' });
            }

            // Verificar que el usuario sea el dueño o admin
            if (property.hostId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permiso para editar esta propiedad.' });
            }

            await property.update(req.body);
            return res.json({ message: 'Propiedad actualizada correctamente.', property });
        } catch (error) {
            return res.status(500).json({ error: 'Error al actualizar la propiedad.' });
        }
    },

    // Eliminar propiedad
    async deleteProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await Property.findByPk(id);

            if (!property) {
                return res.status(404).json({ error: 'Propiedad no encontrada.' });
            }

            // Verificar pertenencia o admin
            if (property.hostId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'No tienes permiso para eliminar esta propiedad.' });
            }

            await property.destroy();
            return res.json({ message: 'Propiedad eliminada con éxito.' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar la propiedad.' });
        }
    },
    async updateRating(req, res) {
        try {
            const { rating } = req.body;
            const property = await Property.findByPk(req.params.id);
            if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });

            // Promediar o reemplazar (simple):
            await property.update({ rating });
            res.json({ message: 'Calificación actualizada', property });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar calificación' });
        }
    }
};

module.exports = propertyController;