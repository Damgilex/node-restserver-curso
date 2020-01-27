const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

app.post('/login', (req,res) => {//importante definir ruta.
   
    let body = req.body;

    Usuario.findOne({email:body.email}, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario o contraseña incorrecto'
                }
            });
        }

        //Se encripta la contraseña y se hace comparacion con la que esta en BD para ver si hacen match
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{//Los paentesis en contraseña es para identificar que es la que está mal, pero en producción no se deben poner
                    message:'Usuario o (contraseña) incorrecto'
                }
            });
        }

        //Genera token.
        let token = jwt.sign({
            usuario:usuarioDB,
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })
    });
});

module.exports = app;