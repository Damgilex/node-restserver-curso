const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Configuraciones de Google
async function verify( token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return{
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google: true,
    }
}



app.post('/google', async (req,res) => {
    
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                    .catch(e => {
                        res.status(403).json({
                            ok:false,
                            err: e
                        });
                    });

    // res.json({
    //     usuario:googleUser
    // })

    //Verifica si existe usuario con ese email.
    Usuario.findOne({email:googleUser.email},(err,usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'Debe de usar su autenticación normal'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario:usuarioDB,
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token,
                });
            }
        }else{//Si el usuario no existe en la base de datos (primera vez en autenticar)
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password=':)';//

            usuario.save((err,usuarioDB)=>{//Se crea un nuevo usuario

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario:usuarioDB,
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token,
                });

            });
        }
    });
});

module.exports = app;