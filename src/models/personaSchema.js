const mongoose = require("mongoose");

const personaSchema = mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
  },
  fotoCarnet: {
    type: String, 
    required: true,
  },
  fotoSelfie: {
    type: String, 
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    
    type: Number,
    required: true,
  },
  idNotificacionPush: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Persona', personaSchema);
