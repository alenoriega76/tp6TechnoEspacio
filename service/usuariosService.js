

const fs = require('fs/promises'); 

const readDataUsuarios = async () => {
    try {
        const data = await fs.readFile('usuarios.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        // Si el archivo no existe o hay algún error, regresamos un array vacío.
        return [];
    }
};


const writeDataUsuarios = async (data) => {
    try {
        await fs.writeFile("usuarios.json", JSON.stringify(data, null, 2), "utf-8");
        return true; 
    } catch (err) {
        console.error(err);
        return false; 
    }
};

module.exports = { readDataUsuarios, writeDataUsuarios };
