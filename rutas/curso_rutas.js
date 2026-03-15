const express = require('express');
const ruta_curso = express.Router();
const controlador_curso = require('../controladores/curso_controlador');
const { esAdmin } = require('../middleware/usuarios_middelware');

ruta_curso.get('/home/resumen', controlador_curso.obtenerResumenHome);
ruta_curso.get('/admin/opciones', esAdmin, controlador_curso.obtenerOpcionesAdmin);
ruta_curso.get('/', controlador_curso.obtenerCursos);
ruta_curso.get('/:id', controlador_curso.obtenerCursoPorId);
ruta_curso.post('/', esAdmin, controlador_curso.crearCurso);
ruta_curso.put('/:id', esAdmin, controlador_curso.actualizarCurso);
ruta_curso.delete('/:id', esAdmin, controlador_curso.eliminarCurso);

module.exports = ruta_curso;
