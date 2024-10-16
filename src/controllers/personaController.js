const Persona = require('../models/personaSchema');

// Crear una nueva persona
const crearPersona = async (req, res) => {
    const { nombreCompleto, fotoCarnet, fotoSelfie, direccion, telefono, idNotificacionPush } = req.body;
    console.log(req.body);
    try {

      //nombre unico 
      const personaUnica = await Persona.findOne({ nombreCompleto });
      if (personaUnica) {
        return res.status(400).json({ message: 'Ya estas registrado con ese nombre' });
      }
      else{
      const nuevaPersona = new Persona({
        nombreCompleto,
        fotoCarnet, 
        fotoSelfie, 
        direccion,
        telefono,
        idNotificacionPush
      });
  
      
      await nuevaPersona.save();
  
      res.status(201).json({
        message: 'Persona creada exitosamente',
        persona: nuevaPersona
      
      });
    }
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la persona', error });
    }
  };
  
// Listar todas las personas
const listarPersonas = async (req, res) => {
  try {
    const personas = await Persona.find(); 
    res.status(200).json(personas);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar las personas', error });
  }
};

// Listar una persona por ID
const listarPersonaPorId = async (req, res) => {
  const { id } = req.params; 

  try {
    const persona = await Persona.findById(id); 
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json(persona);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la persona', error });
  }
};

// Actualizar una persona por ID
const actualizarPersona = async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, fotoCarnet, fotoSelfie, direccion, telefono, idNotificacionPush } = req.body;

  try {
    const personaActualizada = await Persona.findByIdAndUpdate(
      id,
      {
        nombreCompleto,
        fotoCarnet, 
        fotoSelfie, 
        direccion,
        telefono,
        idNotificacionPush
      },
      { new: true } 
    );

    if (!personaActualizada) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({
      message: 'Persona actualizada exitosamente',
      persona: personaActualizada
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la persona', error });
  }
};

// Eliminar una persona por ID
const eliminarPersona = async (req, res) => {
  const { id } = req.params;

  try {
    const personaEliminada = await Persona.findByIdAndDelete(id);
    if (!personaEliminada) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json({
      message: 'Persona eliminada exitosamente',
      persona: personaEliminada
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la persona', error });
  }
};

module.exports = {
  listarPersonas,
  listarPersonaPorId,
  crearPersona,
  actualizarPersona,
  eliminarPersona
};
