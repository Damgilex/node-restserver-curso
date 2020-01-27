const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('./config/config')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));


// mongoose.connect('mongodb://localhost:27017/cafe',(err,res)=>{
//     if(err) throw err;

//     console.log('Base de datos ONLINE');
// })
 

//  mongoose.connect('mongodb://localhost:27017/cafe', { 
 mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},(err,res) =>{
    if(err) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT,()=>{
    console.log('Escuchando el puerto: ', process.env.PORT);
})

