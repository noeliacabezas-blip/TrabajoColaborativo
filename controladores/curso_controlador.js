const Curso = require('../modelos/curso_esquema');

exports.obtenerCursos = async (req, res) => {
    try {
        const { categoria, titulo } = req.query; // Filtros opcionales
        let filtro = {};
        if (categoria){
			filtro.categoria = categoria;
		}
        if (titulo) {
			filtro.titulo = {$regex: titulo, $options: 'i'}; // 'i' -> para que la búsqueda sea case-insensitive
		}

        const cursos = await Curso.find(filtro).populate('profesorId');
        res.status(200).json(cursos);
    } catch (error) {
		console.error("DETALLE DEL ERROR:", error); // <-- ESTO ES CLAVE
        res.status(500).json({ mensaje: "Error al obtener cursos" });
    }
};