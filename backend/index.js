const app = require('./src/app');
const { sequelize, Property } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function main() {
    try {
        // crea o actualiza las tablas sin borrar los datos existentes
        await sequelize.sync({ alter: true });
        console.log('Base de datos conectada y tablas sincronizadas');

        app.listen(PORT, () => {
            console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error de conexión con la base de datos:', error);
    }
}



main();