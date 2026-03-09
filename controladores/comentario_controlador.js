const Comentario = require("../modelos/comentario_esquema");

// Sanitización mínima: evita HTML directo
function sanitizarTexto(texto) {
    return texto
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();
}

exports.obtenerComentariosPorCurso = async (req, res) => {
    try {
        const comentarios = await Comentario.find({ cursoId: req.params.cursoId })
            .populate("usuarioId", "nombre email")
            .sort({ fecha: -1 });

        res.status(200).json(comentarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener comentarios" });
    }
};

exports.crearComentario = async (req, res) => {
    try {
        const { cursoId, comentario, puntuacion } = req.body;

        if (!cursoId || !comentario || !puntuacion) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        const puntuacionNumero = Number(puntuacion);

        if (puntuacionNumero < 1 || puntuacionNumero > 5) {
            return res.status(400).json({ mensaje: "La puntuación debe estar entre 1 y 5" });
        }

        const textoLimpio = sanitizarTexto(comentario);

        if (textoLimpio.length < 5) {
            return res.status(400).json({ mensaje: "El comentario es demasiado corto" });
        }

        const nuevoComentario = new Comentario({
            usuarioId: req.session.usuario.id,
            cursoId,
            comentario: textoLimpio,
            puntuacion: puntuacionNumero,
            fecha: new Date()
        });

        await nuevoComentario.save();

        const comentarioGuardado = await Comentario.findById(nuevoComentario._id)
            .populate("usuarioId", "nombre email");

        res.status(201).json(comentarioGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear comentario" });
    }
};