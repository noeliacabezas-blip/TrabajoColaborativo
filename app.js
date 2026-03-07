require('dotenv').config(); // Carga las variables del archivo .env
require('./modelos/profesor_esquema'); 
const express = require('express');
const mongoose = require('mongoose');

//Importar rutas:
const ruta_usuario = require('./rutas/usuario_rutas');
const ruta_curso = require('./rutas/curso_rutas');

const app = express();

// Para que funcione la conexión a MongoDB Atlas:
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first'); // Opcional: Prioriza IPv4
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

// Middleware para entender JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado con éxito a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión:', err));

// Para las sesiones de usuario:
const sesion = require('express-session');
app.use(sesion({
	secret: process.env.CLAVE,
	resave: false,	//evita que guarde la sesión si no ha habido cambios
	saveUninitialized: false,	//no crea la cookie hasta que se guarde algo en ella, por ejemplo, al hacer login
	cookie: {
		secure: false,	//permite que la sesión funcione con HTTP, para que acepte solo HTTPS ponerla a true
		maxAge: Number(process.env.TIMEOUT_SESION)  //en ms 
	}
}));

app.use(express.static('public')); // Sirve el HTML, CSS y JS de la UD4
//app.use('/api/auth', require('./rutas/usuario_rutas'));
app.use('/api/usuario', ruta_usuario);
app.use('/api/cursos', ruta_curso);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando y conectado a la base de datos');
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});