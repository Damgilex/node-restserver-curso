const express = require('express');

const app = express();


//Definicion de rutas
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;