require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Profesor = require('../modelos/profesor_esquema');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

async function cargaProfesores() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const datos_profesores = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'lista_profesores.json'), 'utf-8')
        );

        await Profesor.insertMany(datos_profesores);

        console.log(`Se han cargado datos de ${datos_profesores.length} profesores`);
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        mongoose.connection.close();
    }
}

cargaProfesores();
