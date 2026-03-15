require('dotenv').config();
require('./modelos/profesor_esquema');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sesion = require('express-session');

const ruta_usuario = require('./rutas/usuario_rutas');
const ruta_curso = require('./rutas/curso_rutas');
const ruta_comentario = require('./rutas/comentario_rutas');
const profesorRutas = require('./rutas/profesor_rutas');
const ruta_pagina = require('./rutas/pagina_rutas');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));
app.use(express.static(path.join(__dirname, 'public')));

const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado con éxito a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión:', err));

app.use(sesion({
    secret: process.env.CLAVE || 'clave_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: Number(process.env.TIMEOUT_SESION || 3600000)
    }
}));

app.use((req, res, next) => {
    res.locals.usuario = req.session?.usuarioId
        ? {
            id: req.session.usuarioId,
            nombre: req.session.nombre,
            rol: req.session.rol
        }
        : null;
    next();
});

app.use('/', ruta_pagina);
app.use('/api/usuario', ruta_usuario);
app.use('/api/cursos', ruta_curso);
app.use('/api/comentarios', ruta_comentario);
app.use('/api/profesores', profesorRutas);

app.use((req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ mensaje: 'Endpoint no encontrado' });
    }

    res.status(404).render('404', { title: 'Página no encontrada' });
});

app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);

    if (req.originalUrl.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            mensaje: err.message || 'Error interno del servidor'
        });
    }

    res.status(err.status || 500).render('500', {
        title: 'Error interno',
        mensaje: err.message || 'Se ha producido un error inesperado.'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
