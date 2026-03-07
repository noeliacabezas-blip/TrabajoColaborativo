require('dotenv').config();
const mongoose = require('mongoose');
const profesores = require('../modelos/profesor_esquema');

async function cargaProfesores() {
	try{
		await mongoose.connect(process.env.MONGO_URI);
  
		// Leer el archivo JSON
		const datos_profesores = JSON.parse(fs.readFileSync('./lista_profesores.json', 'utf-8'));
	
		//await profesores.deleteMany({}); 	// borra todo de la colección
	
		await profesores.insertMany(datos_profesores);
		
		console.log('Se han cargado datos de ${datos_profesores.length} profesores');
	
		mongoose.connection.close();
	}cath (err){
		console.error("Error:", err);
	}
}

cargarProfesores();
