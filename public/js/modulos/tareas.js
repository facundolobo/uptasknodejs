import axios from "axios";
import Swal from "sweetalert2";

const tareas = document.querySelector('.listado-pendientes');

if(tareas){ //funcion para saber en q lugar hiciste click, devolvera la clase
    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea; //para acceder al padre y al siguiente padre y obtener el id con" dataset" peude ver el data-tarea=tarea
            
            //requet ahcia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`
            
            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if (respuesta.status === 200){
                        icono.classList.toggle('completo')//se para cambiar de color el icono
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;
            
                Swal.fire({ 
                    title: '¿Deseas borrar esta Tarea?',
                    text: "Una Tarea eliminada no se puede recuperar",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Borrar!',
                    cancelButtonText: 'No, Cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`

                        //enviar el delete por medio de axios
                        axios.delete(url, {params: { idTarea }})
                            .then(function(respuesta){
                                if(respuesta.status === 200){
                                    //eliminar el nodo
                                    tareaHTML.parentElement.removeChild(tareaHTML);
                                    //opcional alerta
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        respuesta.data,
                                        'success'
                                    )
                                }
                            })
                    }
                })

        }
    })
}

export default tareas;