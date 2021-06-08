const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res)=>{
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req, res)=>{
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar Sesión en Uptask'
    })
}

exports.crearCuenta = async(req, res) =>{
    //leer los datos
    //console.log(req.body)

    const {email, password} =req.body;
    
    try {
        //crear un usaurio
        await Usuarios.create({
            email,
            password
        });
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email,
            password
        })  
    }
}