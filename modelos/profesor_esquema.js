const mongoose = require('mongoose');

const esquema_profesor = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { 
        type: String, 
        validate: {	//https://codemia.io/knowledge-hub/path/mongoose_-_validate_email_syntax
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    especialidad: { type: String, required: true },
    foto: { type: String, required: true },
    experiencia: { type: Number, default: 5 },
    requisitosAdicionales: { type: String, default: "Sin requisitos" }});

// El nombre 'profesores' es el que usaremos en las relaciones (ref)
module.exports = mongoose.model('profesores', esquema_profesor);