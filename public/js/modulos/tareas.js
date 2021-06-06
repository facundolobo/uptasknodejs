const tareas = document.querySelector('.listado-pendientes');

if(tareas){ //funcion para saber en q lugar hiciste click, devolvera la clase
    tareas.addEventListener('click', e =>{
        console.log(e.target.classList);
    })
}

export default tareas;