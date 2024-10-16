const { Router } = require('express');
const router = Router();
const personaController= require('../controllers/personaController')
const productoController = require('../controllers/productoController');

// Rutas pública
router.get('/test', (req, res) => {
    const data = {
        "id": "1",
        "name": "Funciona correctamente"
    };
    res.json(data);
});

// Rutas para personas
router.post('/crearPersona', personaController.crearPersona); 
router.get('/personas', personaController.listarPersonas); 
router.get('/listarpersonaid/:id', personaController.listarPersonaPorId); 
router.put('/editarpersona/:id', personaController.actualizarPersona); 
router.delete('/eliminarpersona/:id', personaController.eliminarPersona); 
// Rutas para productos
router.post('/crearProducto', productoController.crearProducto);
router.get('/productos', productoController.listarProductos);
router.get('/listarproducto/:id', productoController.listarProductoPorId);
router.put('/editarproducto/:id', productoController.actualizarProducto);
router.delete('/eliminarproducto/:id', productoController.eliminarProducto);


module.exports = router;
