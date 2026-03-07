const mongoose = require('mongoose');

const esquema_usuario = new mongoose.Schema({
    nombre: String, 
    email: { 
        type: String, 
        validate: {	//https://codemia.io/knowledge-hub/path/mongoose_-_validate_email_syntax
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    passwordHash: String, 
    rol: { 
        type: String, 
        enum: ['admin', 'alumno'], 
        default: 'alumno' 
    }
});

module.exports = mongoose.model('usuarios', esquema_usuario);