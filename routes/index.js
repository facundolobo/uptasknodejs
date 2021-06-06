const express = require('express');
const router =express.Router();

//importamos de express-validator
const {body} = require('express-validator')

//importamos el controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController')


module.exports = function (){ //funcion apra exportar
    // ruta para el home
    router.get('/', proyectosController.proyectosHome); //cuando el navegador ingresa a esa Url activa el controlador
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(), //restricciones que agregamos para depurar 
        proyectosController.nuevoProyecto);

    //Listar proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);
    
    //Actualizar el proyecto
    router.get('/proyectos/editar/:id',proyectosController.formualrioEditar);
    router.post('/nuevo-proyecto/:id', 
        body('nombre').not().isEmpty().trim().escape(), //restricciones que agregamos para depurar 
        proyectosController.actualizarProyecto);

    // Eliminar proyecto
    router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', tareasController.agregarTarea)

    return router;
}

