exports.esAdmin = (req, res, next) => {
    // Si hay sesión y el rol es admin, adelante
    if (req.session && req.session.rol === 'admin') {
        return next();
    }
    // Si no, fuera
    //res.status(404).json({ mensaje: "Acceso denegado: Se requieren permisos de Admin" });
    res.status(404).render('404',{
        mensaje: "Acceso denegado: Se requieren permisos de Admin"
    });
};

exports.estaLogueado = (req, res, next) => {
    if (req.session && req.session.usuarioId) {
        return next();
    }
    res.status(400).json({ mensaje: "Debes iniciar sesión" });
};