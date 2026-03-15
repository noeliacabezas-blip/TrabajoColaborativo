const Curso = require('../modelos/curso_esquema');
const Profesor = require('../modelos/profesor_esquema');

function construirFiltro(query = {}) {
    const { categoria, titulo, nivel } = query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (titulo) filtro.titulo = { $regex: titulo, $options: 'i' };
    if (nivel) filtro.nivel = nivel;

    return filtro;
}

function normalizarTemario(temario) {
    if (Array.isArray(temario)) {
        return temario.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof temario === 'string') {
        return temario
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function validarPayloadCurso(payload = {}) {
    const errores = [];

    if (!payload.titulo || !payload.titulo.trim()) errores.push('El título es obligatorio.');
    if (!payload.categoria || !payload.categoria.trim()) errores.push('La categoría es obligatoria.');
    if (!payload.nivel || !payload.nivel.trim()) errores.push('El nivel es obligatorio.');
    if (!payload.duracion || !payload.duracion.trim()) errores.push('La duración es obligatoria.');
    if (!payload.descripcion || !payload.descripcion.trim()) errores.push('La descripción es obligatoria.');
    if (!payload.imagen || !payload.imagen.trim()) errores.push('La imagen es obligatoria.');
    if (!payload.profesorId || !payload.profesorId.trim()) errores.push('El profesor es obligatorio.');

    return errores;
}

exports.obtenerCursos = async (req, res, next) => {
    try {
        const filtro = construirFiltro(req.query);
        const cursos = await Curso.find(filtro)
            .populate('profesorId')
            .sort({ createdAt: -1, titulo: 1 });

        res.status(200).json(cursos);
    } catch (error) {
        next(error);
    }
};

exports.obtenerCursoPorId = async (req, res, next) => {
    try {
        const curso = await Curso.findById(req.params.id).populate('profesorId');

        if (!curso) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        res.status(200).json(curso);
    } catch (error) {
        next(error);
    }
};

exports.obtenerResumenHome = async (req, res, next) => {
    try {
        const [cursosNuevos, categoriasDestacadas] = await Promise.all([
            Curso.find({})
                .sort({ createdAt: -1 })
                .limit(3)
                .populate('profesorId', 'nombre'),
            Curso.aggregate([
                {
                    $group: {
                        _id: '$categoria',
                        total: { $sum: 1 }
                    }
                },
                { $sort: { total: -1, _id: 1 } },
                { $limit: 4 }
            ])
        ]);

        res.status(200).json({ cursosNuevos, categoriasDestacadas });
    } catch (error) {
        next(error);
    }
};

exports.obtenerOpcionesAdmin = async (req, res, next) => {
    try {
        const profesores = await Profesor.find({}).sort({ nombre: 1 }).lean();
        res.status(200).json({ profesores });
    } catch (error) {
        next(error);
    }
};

exports.crearCurso = async (req, res, next) => {
    try {
        const errores = validarPayloadCurso(req.body);
        if (errores.length) {
            return res.status(400).json({ mensaje: 'Datos inválidos', errores });
        }

        const profesor = await Profesor.findById(req.body.profesorId);
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        const curso = await Curso.create({
            titulo: req.body.titulo.trim(),
            categoria: req.body.categoria.trim(),
            nivel: req.body.nivel.trim(),
            duracion: req.body.duracion.trim(),
            descripcion: req.body.descripcion.trim(),
            imagen: req.body.imagen.trim(),
            profesorId: req.body.profesorId,
            temario: normalizarTemario(req.body.temario)
        });

        const cursoCreado = await Curso.findById(curso._id).populate('profesorId');
        res.status(201).json(cursoCreado);
    } catch (error) {
        next(error);
    }
};

exports.actualizarCurso = async (req, res, next) => {
    try {
        const errores = validarPayloadCurso(req.body);
        if (errores.length) {
            return res.status(400).json({ mensaje: 'Datos inválidos', errores });
        }

        const profesor = await Profesor.findById(req.body.profesorId);
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        const curso = await Curso.findByIdAndUpdate(
            req.params.id,
            {
                titulo: req.body.titulo.trim(),
                categoria: req.body.categoria.trim(),
                nivel: req.body.nivel.trim(),
                duracion: req.body.duracion.trim(),
                descripcion: req.body.descripcion.trim(),
                imagen: req.body.imagen.trim(),
                profesorId: req.body.profesorId,
                temario: normalizarTemario(req.body.temario)
            },
            { new: true, runValidators: true }
        ).populate('profesorId');

        if (!curso) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        res.status(200).json(curso);
    } catch (error) {
        next(error);
    }
};

exports.eliminarCurso = async (req, res, next) => {
    try {
        const curso = await Curso.findByIdAndDelete(req.params.id);

        if (!curso) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        res.status(200).json({ mensaje: 'Curso eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};
