const Usuario = require('../modelos/usuario_esquema');
const encriptador = require('bcryptjs');

// REGISTRO:
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contrasenna, rol } = req.body; // Mirar el código que lo envía
        
        // 1. Encriptar la contraseña:
        const sal = await encriptador.genSalt(10);
        const passwordHash = await encriptador.hash(contrasenna, sal);

        // 2. Guardar en la DB
        const nuevoUsuario = new Usuario({ 
            nombre, 
            email, 
            passwordHash, 
            rol: rol || 'alumno' 
        });
        await nuevoUsuario.save();      

       
        res.status(201).json({ mensaje: "Usuario creado con éxito."});
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar", error: error.message });
    }
};

// LOGIN:
exports.login = async (req, res) => {
    try {
        const { email, contrasenna } = req.body; // Mirar el código que lo envía

        // 1. Buscar si el usuario existe
        const usuario = await Usuario.findOne({ email }); //usuario o contraseña ¿?
        if (!usuario) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

        // 2. Comparar contraseñas
        const esValida = await encriptador.compare(contrasenna, usuario.passwordHash);
        if (!esValida) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

        // 3. Crear la sesión (Guardamos datos del usuario en la cookie)
        req.session.usuarioId = usuario._id;
        req.session.rol = usuario.rol;
        req.session.nombre = usuario.nombre;

        res.json({ 
            logueado: true,
            nombre: usuario.nombre,
            rol: usuario.rol,
            mensaje: "Bienvenido " + usuario.nombre
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy((err) => {
		if (err) return res.status(500).json({mensaje: "Error al cerrar sesión"});
		res.clearCookie('connect.sid'); //Limpia la cookie del navegador
		res.json({ mensaje: "Sesión cerrada" });
	});	
};