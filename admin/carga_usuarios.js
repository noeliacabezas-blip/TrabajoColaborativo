require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../modelos/usuario_esquema');
const fs = require('fs');
const encriptador = require('bcryptjs');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

async function cargaUsuarios() {
	try{
		await mongoose.connect(process.env.MONGO_URI);
  
		// Leer el archivo JSON
		const datos_usuarios = JSON.parse(fs.readFileSync('./lista_usuarios.json', 'utf-8'));
		
		// await Usuario.deleteMany ({});	// borraría todos los datos de usuarios

		for (let user of datos_usuarios){
			// 1. Encripta la contraseña
			const sal = await encriptador.genSalt(10);
			const hashFinal = await encriptador.hash(user.passwordHash, sal);
			// 2. Guardar en la DB
			const nuevoUsuario = new Usuario({ 
				nombre: user.nombre, 
				email: user.email, 
				passwordHash: hashFinal, 
				rol: user.rol || 'alumno' 
			});
			await nuevoUsuario.save();      
		}
				
		console.log(`Se han cargado datos de ${datos_usuarios.length} usuarios`);
	
		mongoose.connection.close();
	} catch (err){
		console.error("Error:", err);
	}
}

cargaUsuarios();
