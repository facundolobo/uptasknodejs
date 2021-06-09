const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son Obligatorios' //resscreibe el msj por defecto de "Missing credentials"
});

//Funcion para revisar si el usuario esta logueado o no

exports.usuarioAutenticado = (req, res, next) =>{
    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');

}

//funcion para cerrar sesion
exports.cerrarSesion = (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
    })
}

//Genera un token si el usuario es valido
exports.enviarToken = async(req, res) =>{
    //verificar que el usuario exista
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    //si no existe el usuario
    if(!usuario){
        req.flash('error','No existe esa cuenta')
        res.render('/reestablecer');

    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion =Date.now() + 3600000; //genera por una hora
    
    //Guardar en la base de datos
    await usuario.save(); //guarda con el token y expiracion

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //console.log(resetUrl);
    
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //terminar 
    req.flash('correcto','Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req, res) =>{

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    //si no encuentra el usuario
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/reestablecer');
    }
    //formualario para generar el password
    res.render('resetPassword',{
        nombre: 'Reestablecer Contraseña'
    })
}
//cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res) =>{
    //verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })
    //verificar si el usuario existe
    if (!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado coorectamente')
    res.redirect('/iniciar-sesion');


}