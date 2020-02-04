const express = require('express');
const app = express();
const _ = require('underscore');

const Categoria = require('../models/categoria');
const {verificaAdminRole, verificaToken} = require('../middlewares/autenticacion');

//Mostrar todas las categorias
app.get('/categoria',(req,res) => {

    Categoria.find({})
        .sort('nombre')//Ordena resultados por campo especificado
        .populate('usuario','nombre email')//Permite cargar informacion de algun id que estemos usando de otra colección. Primer campo especifica la coleccion, segundo parametro son los campos que queremos ver. Pueden agregarse mas instrucciones populate si hay mas esquemas que quieren desglosarse
        .exec((err,categorias) =>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }


        res.json({
            ok:true,
            categorias
        });
        
    });
});

//Mostrar una categoria por ID
app.get('/categoria/:id',(req,res)=>{

    const id = req.params.id;

    Categoria.findById(id,(err,categoriaBD) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'La categoria no existe'
                }
            })
        }

        res.json({
            ok:true,
            categoriaBD
        })
    })
});

//Crear nueva catgoria
app.post('/categoria',verificaToken, (req,res)=>{
    //regresa la nueva categoria
    const idUsuario = req.usuario._id;
    let categoria = new Categoria({
        nombre:req.body.nombre,
        descripcion:req.body.descripcion,
        usuario: idUsuario
    });

    categoria.save((err,categoriaBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaBD){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoriaBD
        });
    });
});

//Modificar descripción de la categoria
app.put('/categoria/:id', (req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','descripcion']);
    Categoria.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });     
        };


        res.json({
            ok:true,
            categoria:categoriaBD
        });
    });
});

//Eliminar categoria
app.delete('/categoria/:id',[verificaToken,verificaAdminRole], (req,res)=>{
   //Solo un administrador puede borrar categorias
   let id = req.params.id;
   
   Categoria.findByIdAndDelete(id,(err,categoriaBorrada)=>{
         let id = req.params.id;

         if(err){
            return res.status(400).json({
                ok:false,
                err
            });    
         };

        
         if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Categoria no encontrada'
                }
            });            
         }

         res.json({
             ok:true,
             categoriaBorrada
         });
    
   })

});

module.exports = app;