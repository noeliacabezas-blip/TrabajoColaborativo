const express = require('express');
const ruta_curso = express.Router();
const controlador_curso = require('../controladores/curso_controlador');

ruta_curso.get('/', controlador_curso.obtenerCursos);

module.exports = ruta_curso;