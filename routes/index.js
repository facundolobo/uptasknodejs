const express = require('express');
const router =express.Router();

//importamos de express-validator
const {body} = require('express-validator')

//importamos el controlador
const proyectosController = require('../controllers/proyectosController')

module.exports = function (){ //funcion apra exportar
    // ruta para el home
    router.get('/', proyectosController.proyectosHome); //cuando el navegador ingresa a esa Url activa el controlador
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(), //restricciones que agregamos para depurar 
        proyectosController.nuevoProyecto

    );

    //Listar proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    return router;
}

