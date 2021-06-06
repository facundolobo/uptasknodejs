const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas') //importamos als tareas


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
        
        await Proyectos.create({ nombre });
        res.redirect('/'); //despeus de ingresar los datos lo llevara a home     
    }
}

exports.proyectoPorUrl = async(req, res) =>{
    

    const proyectosPromise = Proyectos.findAll(); //es para mostrar los proyectos a la izquierda en el sidebar

    const proyectoPromise = Proyectos.findOne({ //es para buscar el proyecto en el cual estoy trabajando
        where:{
            url: req.params.url //el id q enviamos el router ":id"
        } 
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas de Proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id 
        }, 
        // include: [ //para hacer como un "JOIN" 
        //     {model: Proyectos}
        // ]
    })




    if (!proyectos) return next(); //si no encuentra la url que coincida entonces continuara 

    //render a la vista
    res.render('tareas', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas //enviamos las tareas a la vista
    })
}

exports.formualrioEditar= async(req, res) =>{

    const proyectosPromise = Proyectos.findAll(); //es para mostrar los proyectos a la izquierda en el sidebar

    const proyectoPromise = Proyectos.findOne({ //es para buscar el proyecto en el cual estoy trabajando
        where:{
            id: req.params.id //el id q enviamos el router ":id"
        } 
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);


    // render a la vista
    res.render ('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}


exports.actualizarProyecto = async(req, res)=>{
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
        
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id}} //para saber q registro cambiar, sino tiene where lanza error por que es un update
        );

        res.redirect('/'); //despeus de ingresar los datos lo llevara a home     
    }
}
exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params 
    // console.log(req.query);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    if(!resultado){
        return next(); //saltar a otro midelware y no muestres la res de abajo
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}