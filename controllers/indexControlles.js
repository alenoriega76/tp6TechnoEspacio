const fs = require("fs");
const bcrypt = require("bcrypt");
const { writeData, readData } = require("../service/productService");
const { readDataUsuarios, writeDataUsuarios } = require("../service/usuariosService");
const session = require('express-session');
// pagina inicio
const renderIndex = (req, res) => {
    res.render('index');
};
const renderLogin = (req, res) => {
    res.render('login', { errors: [] });
};
const renderRegister = (req, res) => {
    res.render('register', { errors: [] });
}
const registroNuevo = async (req, res) => {
    const { nombre, email, password, usuario, fec_nac } = req.body;

    try {
        // Leer usuarios existentes desde el archivo JSON
        let usuarios = await readDataUsuarios();

        // Generar el hash de la contraseña
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al hashear la contraseña");
            }

            const nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

            // Crear el nuevo usuario
            const nuevoUsuario = {
                id: nuevoId,
                email,
                password: hashedPassword,
                nombre,
                fec_nac,
                usuario
            };

            // Agregar el nuevo usuario al array existente
            usuarios.push(nuevoUsuario);

            // Escribir el array actualizado en el archivo JSON
            await writeDataUsuarios(usuarios);

            console.log(nuevoUsuario);

            // Guardar el email del usuario en la sesión
            req.session.usuario = email;

            // Redirigir a la página de inicio después del registro
            res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error en el registro");
    }
};


const logueado = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuarios = await readDataUsuarios();
        const usuario = usuarios.find((user) => user.email === email);

        if (!usuario) {
            return res.status(404).send("Usuario no encontrado");
        }

        bcrypt.compare(password, usuario.password, (err, result) => {
            if (err) {
                return res.status(400).send("Error al comparar contraseñas");
            }
            if (result) {
                console.log("contraseña correcta");

                // Almacena el objeto completo del usuario en la sesión
                req.session.usuario = usuario;

                // Redirige a la página de perfil
                res.render('perfil',{usuario});
            } else {
                console.log("contraseña incorrecta");
                res.status(401).send("Contraseña incorrecta");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al autenticar usuario");
    }
};


// obtengo todos los productos
const renderProducts = (req, res) => {
    try {
        const productos = readData();
        res.json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al Obtener los productos!!")
    }
    res.render('products');
};

//obtengo  todos los usuarios
const renderUsuarios = async (req, res) => {
    try {
        const usuarios = await readDataUsuarios();
        console.log("Usuarios:", usuarios); // Agrega este mensaje de depuración
        res.json(usuarios); // Enviar respuesta JSON
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al Obtener los usuarios!!");
    }
};

// creo un nuevo producto
const addProduct = (req, res) => {
    try {
        const { id, name, description, price } = req.body;
        //lee la informacion del json
        let productos = readData();
        //se crea automaticamente el id
        const nuevId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
        const newProduct = {
            id: nuevId,
            name,
            description,
            price
        };
        productos.push(newProduct);
        writeData(productos);
        console.log(newProduct);
        res.send("Producto creado con éxito");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error al crear el producto")
    }


};
// actualizo producto por id
const actualizarProducto = (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        const productos = readData();
        let productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
        if (productoIndex === -1) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        const updateProduct = {
            id: parseInt(id),
            name,
            description,
            price
        }
        productos[productoIndex] = updateProduct;
        writeData(productos);
        res.status(200).send("Producto actualizado con exito!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar actualizar producto!!");
    }
}

// obtengo los productos por id
const obtenerProductoId = (req, res) => {
    try {
        const productos = readData();
        const idProduct = parseInt(req.params.id);
        const producto = productos.find((producto) => producto.id === idProduct);
        if (!producto) {
            return res.status(404).send("Producto no encontrado.");
        }

        res.status(200).json(producto);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener el producto!!");
    }
    res.send("Producto actualizado!!")
};
// elimino un producto por el id 
const deleteProduct = (req, res) => {
    const { id } = req.params;
    try {
        const productos = readData();

        const productId = productos.findIndex((producto) => producto.id === parseInt(id));
        if (productId === -1) {
            return res.status(404).send("Producto no encontrado");
        }

        productos.splice(productId, 1);
        writeData(productos);

        res.send({ message: 'Producto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el producto");
    }
}

module.exports = {
    renderIndex,
    renderProducts,
    addProduct,
    renderProducts,
    obtenerProductoId,
    deleteProduct,
    actualizarProducto,
    renderLogin,
    renderRegister,
    logueado,
    registroNuevo,
    renderUsuarios
};