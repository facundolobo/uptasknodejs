import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar){ //agregamos este if para cuando el boton eliminar existe
    btnEliminar.addEventListener('click', e =>{
        const urlProyecto = e.target.dataset.proyectoUrl; //obtenemos la variable enviada en el boton eliminar
        // console.log(urlProyecto);
    
        Swal.fire({ 
            title: '¿Deseas borrar un proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

              //enviar peticion a axios  
              const url = `${location.origin}/proyectos/${urlProyecto}`;
              
              axios.delete(url, {params: {urlProyecto}})
                .then(function(respuesta){
                    console.log(respuesta)
                   
                    Swal.fire(
                      'Proyecto Eliminado',
                      respuesta.data,
                      'success'
                    );
                    // redireccionar al inicio
                    setTimeout(() => {
                      window.location.href = '/'    
                    }, 3000);
                })
              
              .catch(()=>{
                Swal.fire({
                  
                  type: 'error',
                  title: 'Hubo un error',
                  text: 'No se pudo eliminar el Proyecto'
                  })
              })
            }
          })
    })
}

export default btnEliminar;
