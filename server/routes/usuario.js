const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {//obtener registros

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Usuario.find({},'nombre email role') Podemos elegir que campos mostrar mandandolos entre comillas.
    Usuario.find({estado:true},)//dentro de las llaves van las condiciones.
    .skip(desde)//Se salta los primeros 5
    .limit(limite)//limita la cantidad de registros
    .exec((err,usuarios) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        Usuario.countDocuments({estado:true}, (err, conteo) =>{//Para obtener la cantidad de registros.
            res.json({
                ok:true,
                usuarios,
                cuantos: conteo
            });
        })

     
    })
});
 
app.post('/usuario', function (req, res) {//Guardar usuario

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err,usuarioDB) =>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok:true,
            usuario:usuarioDB
        });

    });

});

app.put('/usuario/:id', function (req, res) {//Actualizar usuario
    
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);//Solo toma para actualizar los datos enviados por el arreglo

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err,usuarioDB)=>{//funcion de mongoseDB. el new es para regresar el nuevo usuario en el callack
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });    
         };

         res.json({
             ok:true,
             usuario:usuarioDB
         });
    });

});

app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true},(err,usuarioBorrado)=>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            });    
        }
        
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    })

    //EL SIGUIENTE CODIGO ELIMINA UN REGISTRO POR COMPLETO DE LA BASE DE DATOS, PERO SE RECOMIENDA MEJOR SOLAMENTE DESACTIVARLO USANDO UNA BANDERA.
    // Usuario.findByIdAndRemove(id,(err, usuarioBorrado) => {//Elimina el registro de la base de datos por completo.
        
    //     if(err){
    //         return res.sstatus(400).json({
    //             ok:false,
    //             err
    //         });    
    //      };

    //      if(!usuarioBorrado){//Para verificar si borro algo ya que si no existe el usuario no genera un error
    //         return res.status(400).json({
    //             ok:false,
    //             err:{
    //                 message:'Usuario no encontrado'
    //             }
    //         });    
    //      }

    //      res.json({
    //         ok:true,
    //         usuario:usuarioBorrado
    //      });

    // });

});

module.exports = app;