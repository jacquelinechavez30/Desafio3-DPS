const Producto = require('../models/productoSchema');
const Persona = require('../models/personaSchema');

// Crear un nuevo producto
    const crearProducto = async (req, res) => {
        const { nombreProducto, nombrePersona } = req.body; 

    try {
        // Buscar la persona por nombre
        const personaExistente = await Persona.findOne({ nombreCompleto: nombrePersona });
        if (!personaExistente) {
            return res.status(404).json({ message: 'Persona no registrada, intenta registrarte primero' });
        }

        // Si la persona existe, crear el producto asociado
        const nuevoProducto = new Producto({
            nombreProducto,
            idPersona: personaExistente._id
        });

        await nuevoProducto.save();

        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};

      

// Listar todos los productos por persona
const listarProductos = async (req, res) => {
  const { nombrePersona } = req.query;; 
  try {
    // Buscar la persona por nombre
    const personaExistente = await Persona.findOne({ nombreCompleto: nombrePersona });
    if (!personaExistente) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    
 // Buscar productos usando el ID de la persona
 const productos = await Producto.find({ idPersona: personaExistente._id }); 
    res.status(200).json(productos);
  
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los productos', error });
  }
};

// Listar un producto por ID
const listarProductoPorId = async (req, res) => {
  const { id } = req.params; 

  try {
    const producto = await Producto.findById(id).populate('idPersona'); 
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Actualizar un producto por ID
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; 
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { estado: estado }, 
      { new: true } 
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto por ID
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto eliminado exitosamente',
      producto: productoEliminado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

module.exports = {
  listarProductos,
  listarProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
