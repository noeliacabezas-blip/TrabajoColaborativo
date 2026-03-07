const express = require('express');
const ruta_usuario = express.Router();
const controlador_usuario = require('../controladores/usuario_controlador');

ruta_usuario.post('/registro', controlador_usuario.registrar);
ruta_usuario.post('/login', controlador_usuario.login);
ruta_usuario.get('/logout', controlador_usuario.logout);
ruta_usuario.get('/estado', (req, res) => {
    if (req.session.usuarioId) {
        res.json({ logueado: true, nombre: req.session.nombre, rol: req.session.rol });
    } else {
        res.json({ logueado: false });
    }
});

module.exports = ruta_usuario;