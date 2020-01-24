const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);//Para eliminar warning de consola.

let rolesValidos = {//Para controlar los roles permitidos. VALUE: rol asignado por el usuario
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol válido' 
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es necesaio']//Mensaje en caso de faltar nombre
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El email es obligatorio']
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

usuarioSchema.methods.toJSON = function(){//Se quita el campo pass cuando se imrpima con un toJSON, asi no se le da informacion del campo passsword al usuario
    
    let user = this;//Se toma el objeto del usuaio
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);//Se crea modelo usuario con la configuracion de usuarioSchema