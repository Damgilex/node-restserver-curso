//===========================
//Puerto
//===========================

process.env.PORT = process.env.PORT || 3000;


//===========================
//Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===========================
//Base de datos
//===========================
let urlDB;

// if(process.env.NODE_ENV === 'dev'){
//     urlDB = 'mongodb://localhost:27017/cafe'//direccion local
// } else{
    urlDB = 'mongodb+srv://damgilex:hhy8y3m8h9yUs0qM@cluster0-yfbmz.mongodb.net/cafe';//direccion de la nube
//}

process.env.URLDB = urlDB;

