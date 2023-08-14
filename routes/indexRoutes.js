const express = require('express');
const {renderProducts,nuevoProducto,renderIndex,addProduct,
    obtenerProductoId,deleteProduct,actualizarProducto,
    renderRegister,renderLogin, logueado, registroNuevo,renderUsuarios} = require('../controllers/indexControlles');
const validateLogin = require('../middleware/validateLogin');
const router= express.Router();
 const login = require('../middleware/validateLogin');
const validate=require('../middleware/validateRegister');
const validateUpdate = require('../middleware/validateUpdate');
// router.get('/',(req,res)=>{
//     res.send("Welcome")
// });

// rutas para Login y Register
router.get('/login',renderLogin);
router.get('/register',renderRegister);
router.get('/usuarios',renderUsuarios);
router.post('/login',login,logueado);
router.post('/register', validate,registroNuevo);
// rutas para operaciones CRUD
router.get('/',renderIndex);
router.get('/products',renderProducts);
router.post('/products',validateUpdate,addProduct);
//router.get('/producto',nuevoProducto);
router.get('/products/:id',obtenerProductoId);
router.delete('/products/:id',deleteProduct);
router.put('/products/:id', validateUpdate,actualizarProducto);

module.exports = router;