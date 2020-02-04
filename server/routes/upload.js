const express = require('express');
const fileUpload = require('express-fileupload');
const app = express(); 
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
app.use( fileUpload({ useTempFiles: true }) );//todo lo que este subiendose lo carga en req.files
const fs = require('fs');
const path = require('path');

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo= req.params.tipo;
    let id= req.params.id;

    if(!req.files){
        return res.status(400)
            .json({
                ok:false,
                err:{
                    message:'No se ha seleccionado ningún archivo'
                }
            });
    }

    //Valida tipo
    let tiposValidos = ['productos','usuarios'];
    
    if(tiposValidos.indexOf(tipo)< 0){
        return res.status(500)
        .json({
            ok:false,
            err:{
                message:`Los tipos validos son: ${tiposValidos}`
            }
        });
    }

    let archivo = req.files.archivo;//req.files.(nombre key como se mandara el archivo)
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];//Se obtiene la extension

    //Extrensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];
    if(extensionesValidas.indexOf(extension)< 0){//Si la extension no esta en el archivo
        return res.status(500)
        .json({
            ok:false,
            err:{
                message:`las extensiones permitidas son: ${extensionesValidas}`
            }
        });
    }

    //Cambiar nombre al archivo. debe ser unico para que no se sustituya en caso de que se suba uno con el mismo nombre
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // archivo.mv(`uploads/${tipo}/${archivo.name}` ,(err)=>{
        archivo.mv(`uploads/${tipo}/${nombreArchivo}` ,(err)=>{
        if(err){
            return res.status(500)
            .json({
                ok:false,
                err
            });
        }


        if(tipo==='usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo)
        }

        
    })
});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){
            
            borraArchivo(nombreArchivo,'usuarios');//Si el usuario no existe detodosmodos se subio la imagen, asi que hay que borrarla
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            });
        });
    });
}

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoBD)=>{
        if(err){
            
            borraArchivo(nombreArchivo,'productos');//Si el usuario no existe detodosmodos se subio la imagen, asi que hay que borrarla
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoBD){
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no existe'
                }
            });
        }

        borraArchivo(productoBD.img,'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                producto:productoGuardado,
                img:nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo){
      //Eliminar archivo si es que existe ya que se actualizará la img
      let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
      if(fs.existsSync(pathImagen)){//usar existsSync ya que el otro funciona con callbacks
          fs.unlinkSync(pathImagen)
      }
}

module.exports = app;