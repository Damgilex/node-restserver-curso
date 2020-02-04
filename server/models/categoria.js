const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es necesario'], 
    },
    descripcion:{
        type:String,
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario',
        required: true
    },
    activo:{
        type:Boolean,
        default:true,
    },
});

module.exports = mongoose.model('Categoria',categoriaSchema);
