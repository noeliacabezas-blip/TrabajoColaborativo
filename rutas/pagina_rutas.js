const express = require('express');
const ruta_paginas = express.Router();
const Curso = require('../modelos/curso_esquema');

ruta_paginas.get('/', (req, res) => {
	res.render('index', { title: 'Formación Global Online | Portada' });
});

ruta_paginas.get('/listado_cursos', (req, res) => {
	res.render('listado_cursos', { title: 'Formación Global Online | Listado de cursos' });
});

ruta_paginas.get('/profesores', (req, res) => {
	res.render('profesores', { title: 'Formación Global Online | Profesores' });
});

ruta_paginas.get('/contacto', (req, res) => {
	res.render('contacto', { title: 'Formación Global Online | Contacto' });
});

ruta_paginas.get('/curso_detalle', async (req, res) => {
	try {
		const idCurso = req.query.id;
		const cursoEncontrado = await Curso.findById(idCurso).populate('profesorId');
		if (!cursoEncontrado) {
            return res.status(404).send("Curso no encontrado");
        }
		const titulo =  'Formación Global Online | ' + cursoEncontrado.titulo;
		 res.render('curso_detalle', { 
            title: titulo, 
            curso: cursoEncontrado 
        });
    } catch (error) {
        res.status(500).send("Error al cargar el curso");
    }
});

module.exports = ruta_paginas;

