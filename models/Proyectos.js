const Sequelize = require('sequelize');
const db = require('../config/db'); //importamos la config q creamos
const slug = require('slug');
const shortid = require('shortid');

//definimos la estructura de datos
const Proyetos = db.define('Proyectos',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING 
}, {
    hooks: { 
        beforeCreate(proyecto){
                const url = slug(proyecto.nombre).toLowerCase();
                // console.log(shortid.generate())

                proyecto.url = `${url}-${shortid.generate()}`;
                //proyecto.url = url;
        }
    }
})

//exportamos la estructura

module.exports = Proyetos;