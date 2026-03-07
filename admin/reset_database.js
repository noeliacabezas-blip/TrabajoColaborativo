require('dotenv').config();
const mongoose = require('mongoose');

async function clearDatabase() {	
	// Para que funcione la conexión a MongoDB Atlas:
	const dns = require('node:dns');
	dns.setDefaultResultOrder('ipv4first'); // Opcional: Prioriza IPv4
	require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
	await mongoose.connect(process.env.MONGO_URI);
  
  
	// Borra la base de datos a la que estás conectado actualmente
	await mongoose.connection.db.dropDatabase();
  
	console.log("Base de datos eliminada correctamente");
	mongoose.connection.close();
}

clearDatabase();