const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.agregarTarea = async(req, res, next) => {
    //obtenermos el Proyecto actual
    const proyecto = await Proyectos.findOne({where : {url: req.params.url}})

    //leer el valor del input
    const {tarea} = req.body;

    //estado 0 = incompleto y ID de proyecto
    const estado = 0; 
    const proyectoId = proyecto.id;
   
    //Insertar en la base de datos
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    //redireccionar 
    res.redirect(`/proyectos/${req.params.url}`); //es como refrescar la pagina
}  

exports.cambiarEstadoTarea = async(req, res) => {
    const {id} = req.params; //obtenemos el id de la tarea
    const tarea = await Tareas.findOne({where: {id}});

    console.log(tarea);
    //cambiar estado
    let estado=0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save(); //guardamos cambios

    if(!resultado) return next(); //si ocurre algun error entonces vuelve no lanza el siguiente status



    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async(req, res) =>{
    const {id} = req.params;

    //Eliminar la tarea
    const resultado = await Tareas.destroy({where : {id}})
    if(!resultado) return next(); //si ocurre algun error entonces vuelve no lanza el siguiente status


    res.status(200).send('Tarea Eliminada Correctamente')
}