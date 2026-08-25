const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // Registro de usuario
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
      }

      // Verificar si el correo ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      // Generar Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_WORD || 'UVAQ4EVER',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
  },

  // Sign-in usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Proporcione correo y contraseña.' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      // Validar contraseña
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
      }

      // Generar Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_WORD || 'UVAQ4EVER',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
  },

  // Obtener perfil actual
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
      });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener perfil.' });
    }
  },
};

module.exports = authController;