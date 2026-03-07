exports.esAdmin = (req, res, next) => {
    // Si hay sesión y el rol es admin, adelante
    if (req.session && req.session.rol === 'admin') {
        return next();
    }
    // Si no, fuera
    res.status(403).json({ mensaje: "Acceso denegado: Se requieren permisos de Admin" });
};

exports.estaLogueado = (req, res, next) => {
    if (req.session && req.session.usuarioId) {
        return next();
    }
    res.status(401).json({ mensaje: "Debes iniciar sesión" });
};