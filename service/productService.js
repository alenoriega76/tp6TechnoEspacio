const fs =require("fs");

function  readData (){
    const prouctos= fs.readFileSync('productos.json','utf-8');
    const productosParser = JSON.parse(prouctos);
    return productosParser;
}

function writeData (productos) {
    const productStringified = JSON.stringify(productos, null, 2);
    const result = fs.writeFileSync('productos.json',productStringified, 'utf8');
    return result;  
}

module.exports ={ readData, writeData}