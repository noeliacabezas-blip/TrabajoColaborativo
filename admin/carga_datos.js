require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const profesores = require('../modelos/profesor_esquema');
const cursos = require('../modelos/curso_esquema');


async function cargaDatos() {
	try{
		// Para que funcione la conexión a MongoDB Atlas:
		const dns = require('node:dns');
		dns.setDefaultResultOrder('ipv4first'); // Opcional: Prioriza IPv4
		require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
		// conecta con la base de datos
		await mongoose.connect(process.env.MONGO_URI);
		
		// Borrar todo:
		await profesores.deleteMany({}); 	// borra todo de la colección de profesores
		await cursos.deleteMany({}); 	// borra todo de la colección de cursos
		
		//Carga profesores:
		// Leer el archivo JSON
		const datos_profesores = JSON.parse(fs.readFileSync('./lista_profesores.json', 'utf-8'));
		const profesores_added = await profesores.insertMany(datos_profesores);
		console.log(`Se han cargado datos de ${datos_profesores.length} profesores`);
		
		//Carga cursos:
		const datos_cursos = JSON.parse(fs.readFileSync('./lista_cursos.json', 'utf-8'));
		const datos_cursos_id = datos_cursos.map(curso => {
			// Buscamos al profesor en el array de profesores recién creados por su email
			const profesorEncontrado = profesores_added.find(p => p.email === curso.emailProfesor);
			return{
				...curso,
				profesorId: profesorEncontrado ? profesorEncontrado._id : null
			};
		});
		await cursos.insertMany(datos_cursos_id);
		console.log(`Se han cargado datos de ${datos_cursos_id.length} cursos`);
		
		mongoose.connection.close();
	}catch (err){
		console.error("Error:", err);
	}
}

cargaDatos();
