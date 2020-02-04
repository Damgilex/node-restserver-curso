const jwt = require('jsonwebtoken');

//==============================
//Verificar token
//==============================

//Middleware
let verificaToken= (req, res, next) => {
    
    //leer token del header de una peticion GET
    let token = req.get('token');

    jwt.verify(token, process.env.SEED , (err,decode) => {

        if(err){//Hubo un error, token vencido etc.
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario; //decode: es la informacion del token, contiene al usuario
        next();//Continua la ejecucion del programa cuando termina esta funcion verificaToken
    });   
};

//==============================
//Verificar admin Role
//==============================
let verificaAdminRole= (req, res, next) => {
    
  let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        res.status(401).json({
            ok:false,
            err:{
                message: 'Usuario no es administrador'
            }
        });
    }

};

//==============================
//Verificar toekn img
//==============================
let verificaTokenImg= (req, res, next) => {
    
    let token = req.query.token;
  
    jwt.verify(token, process.env.SEED , (err,decode) => {

        if(err){//Hubo un error, token vencido etc.
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario; //decode: es la informacion del token, contiene al usuario
        next();//Continua la ejecucion del programa cuando termina esta funcion verificaToken
    });   
  };


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}