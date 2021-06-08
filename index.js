const express = require('express');
const router = require ('./routes'); //importamos la funcion de router
const path = require('path'); //leer los archivos q existen en las carpetas
const bodyParser = require('body-parser');
const flash = require('connect-flash');
//const expressValidator = require('express-validator')
const session = require('express-session');
const cookieParser = require('cookie-parser');

//hepers con algunas funciones
const helpers = require('./helpers');

//crear una app de express
const app= express(); 

//donde cargar los archivos estaticos
app.use(express.static('public'))

//habilitar Pug
app.set('view engine', 'pug')

//hablitar bodyParser para leer datos del form
app.use(bodyParser.urlencoded({extended: true})); 

//agregamos express validator a toda la aplicacion "NO FUNCIONA"
//app.use(expressValidator());

//Añadir la carpeta de la vistas
app.set('views', path.join(__dirname, './views')); // usamos path para acceder a la carpeta y "__dirname" me devuelve el nombre de la carpeta del proyecto , luego nos posicionamos en la carpeta views

// agregar flash messages
app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//Pasar vardump a la app
app.use((req, res, next)=>{
    res.locals.vardump = helpers.vardump; //crear una nueva variable para ser utlizada en cualquier lugar de la app
    res.locals.mensajes = req.flash();
    next();
})

//Crear la conexión a la base de datos
const db = require('./config/db');


//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');



db.sync() //sequelize es un ORM basado en Promesas
    .then(()=> console.log('Conectado al servidor'))
    .catch(error => console.log(error))

app.use('/', router()); //utilizamos la funcion router() y usara ese index

app.listen(3000); //para decir en que puerto correr


