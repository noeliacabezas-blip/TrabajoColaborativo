const mongoose = require('mongoose');

const esquema_curso = new mongoose.Schema({
    titulo: String,
    categoria: String,
    nivel: { 
		type: String, 
		enum: ['Básico', 'Medio', 'Avanzado'] 
	},
    duracion: String,
    descripcion: String,
    imagen: String,    
    profesorId: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'profesores' 
	},
	temario: [String],	
}, { timestamps: true });

module.exports = mongoose.model('cursos', esquema_curso);
