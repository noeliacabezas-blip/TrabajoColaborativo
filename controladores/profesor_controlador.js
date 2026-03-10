const Profesor = require("../modelos/profesor_esquema");
const Curso = require("../modelos/curso_esquema");

exports.obtenerProfesores = async (req, res) => {
    try {
        const profesores = await Profesor.find({}).lean();

        const profesoresConDatos = await Promise.all(
            profesores.map(async (profesor) => {
                const numeroCursos = await Curso.countDocuments({ profesorId: profesor._id });

                return {
                    ...profesor,
                    nCursos: numeroCursos
                };
            })
        );

        res.status(200).json(profesoresConDatos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener profesores" });
    }
};