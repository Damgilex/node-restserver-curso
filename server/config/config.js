//===========================
//Puerto
//===========================
process.env.PORT = process.env.PORT || 3000;

//===========================
//Entorno
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
//Vencimiento del token
//===========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===========================
//Semilla de autenticación
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarollo';

//===========================
//Base de datos
//===========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'//direccion local
} else{
    urlDB = process.env.MONGO_URI;//direccion de la nube. Se creo variable de entorno en hroku con el nombre MONG_URI
    //MONGO_URI //obligara que se inicie sesion en heroku, asi protegemos las credenciales en el repositorio publico github
}

process.env.URLDB = urlDB;


