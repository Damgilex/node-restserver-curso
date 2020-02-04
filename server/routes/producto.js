const express = require('express');
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

//Obtener productos
app.get('/productos', (req, res) =>{

    Producto.find({})
        .populate('usuario','nombre email')   
        .sort('nombre') 
        .exec((err,productos) => {
            if(err){  
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

          res.json({
              ok:true,
              productos
          });
    });

});

//Obtener producto por ID
app.get('/productos/:id', (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria','nombre descripcion')
        .sort('nombre')
        .exec((err,productoBD)=>{
            if(err){  
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            if(!productoBD){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'El producto no existe'
                    }
                })
            }

            res.json({
                ok:true,
                productoBD
            });
        })
});

//Obtener producto por ID
app.post('/productos', verificaToken, (req, res) =>{

    const idUsuario = req.usuario._id;
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: idUsuario
    });

    producto.save((err,productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'No se pudo'
                }
            });
        }

        res.status(201).json({
            ok:true,
            productoBD
        });
    })
    
});

//Actualizar producto por id
app.put('/productos/:id', (req, res) =>{

    const idProducto = req.params.id;
    const body = _.pick(req.body,['nombre','precioUni','descripcion','categoria']);

    Producto.findByIdAndUpdate(idProducto,body,{new:true, runValidators:true},(err,productoBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no encontrado'
                }
            }); 
        }  

        res.json({
            ok:true,
            productoBD
        });
    });
});

//Eliminar producto por id
app.delete('/productos/:id',[verificaToken,verificaAdminRole], (req, res) =>{

    const idProducto = req.params.id;
    const cambiaEstado = {
        disponible:false
    }

    Producto.findByIdAndUpdate(idProducto,cambiaEstado,{new:true,runValidators:true},(err,productoBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!productoBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no encontrado'
                }
            });    
        }
        
        res.json({
            ok:true,
            producto:productoBorrado
        })
    })
});

module.exports = app;
