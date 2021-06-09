const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


// Referencia al Modelo vamos a autentificar

const Usuarios = require('../models/Usuarios');


//local strategy - Login con credenciales propias (usuarios y password)
passport.use(
    new localStrategy(
        //por default passport espera un usuario
        {
            usernameField: 'email', //email es como esta en el modelo"
            passwordField: 'password'
        },
        async(email, password, done) =>{
            try {
                const usuario = await Usuarios.findOne({ //buscamos email en la base de dato
                    where: {
                        email,
                        activo: 1
                    }
                });
                //usuario exit, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false,{
                        message: 'Password Incorrecto'
                    })    
                }
                //email existe, y el password correcto
                return done(null, usuario)
            } catch (error) {
                //ese usuario no existe
                return done(null, false,{
                    message: 'Esa cuenta no existe'
                })
            }

        }
        
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});
//deserializar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

//exportar
module.exports = passport;