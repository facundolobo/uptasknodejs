const express = require('express');
const router =express.Router();

//importamos de express-validator
const {body} = require('express-validator')

//importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController= require('../controllers/authController');

module.exports = function (){ //funcion apra exportar
    // ruta para el home
    router.get('/', 
        authController.usuarioAutenticado, //revisa si el usuario esta autenticado
        proyectosController.proyectosHome
    ); //cuando el navegador ingresa a esa Url activa el controlador



    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado, //revisa si el usuario esta autenticado
        proyectosController.formularioProyecto);
    
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(), //restricciones que agregamos para depurar 
        proyectosController.nuevoProyecto);

    //Listar proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosController.proyectoPorUrl);
    
    //Actualizar el proyecto
    router.get('/proyectos/editar/:id',
        authController.usuarioAutenticado,    
        proyectosController.formualrioEditar);

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,   
        body('nombre').not().isEmpty().trim().escape(), //restricciones que agregamos para depurar 
        proyectosController.actualizarProyecto);

    // Eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,    
        tareasController.cambiarEstadoTarea); //patch es para actualizar una aprte del objeto, put es para actualizar todo el objeto 

    //Eliminar tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea); 

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta)
    //iniciar sesión 
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    //cerrar sesion
    router.get('/cerrar-sesion',authController.cerrarSesion);
    
    //Resablecer contraseñas
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);


    return router;
}

