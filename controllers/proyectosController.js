const Proyectos = require('../models/Proyectos');
const slug = require('slug')

exports.proyectosHome = async (req, res)=>{ //request , responce  / es async porque es una promesa por la consulta a la base de datos
    const proyectos = await Proyectos.findAll(); //obtener todos los registros del modelo (es como Select * From) se conecta al modelo
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos //enviamos los proyectos obtenidos a la vista
    }); // responder . se utilzia la funcion render utilizara una view llamada "index" q esta hecha en pug en la carpeta view
}

exports.formularioProyecto = async(req, res)=>{
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
        
    })
}

exports.nuevoProyecto = async(req, res)=>{
    const proyectos = await Proyectos.findAll();
    //enviar a la consola lo que el usuario escribio
    //console.log(req.body) 

    //validar que tengamos algo en el input
    const {nombre} = req.body;
    let errores=[];

    //si no esta vacio
    if(!nombre){
        errores.push({'texto': 'Agregar un Nombre al Proyecto'})
    }
    
    //sí hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
        //No hay errores
        // Insertar en la BD
        
        const proyecto = await Proyectos.create({ nombre });
        res.redirect('/'); //despeus de ingresar los datos lo llevara a home     
    }
}

exports.proyectoPorUrl = async(req, res) =>{
    const proyectos = await Proyectos.findAll(); //obtener todos los registros del modelo (es como Select * From) se conecta al modelo
    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url
        }
    });
    if (!proyectos) return next(); //si no encuentra la url que coincida entonces continuara 

    //render a la vista
    res.render('tareas', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos
    })
}