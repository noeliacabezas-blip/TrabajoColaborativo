const mongoose = require('mongoose');

const esquema_comentario = new mongoose.Schema({
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuarios', // Relación con la colección de usuarios        
    },
    cursoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'cursos', // Relación con la colección de cursos       
    },
    comentario: String,         
    puntuacion: { 
        type: Number, 
        min: 1, 
        max: 5,         
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('comentarios', esquema_comentario);