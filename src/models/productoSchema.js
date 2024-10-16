const mongoose = require("mongoose");

const Persona = require("./personaSchema"); 

const productoSchema = mongoose.Schema({
  nombreProducto: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "aprobado"],
    default: "pendiente", 
    required: true,
  },
  idPersona: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persona",
    required: true,
  },
});


module.exports = mongoose.model("Producto", productoSchema);
