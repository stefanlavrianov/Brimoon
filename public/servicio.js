$(document).ready(function() {
    $('.select2').select2();

    actualizarTablaResultados();
});

var servicios = [];


function actualizarTablaResultados() {
    const resultadoTable = document.getElementById("resultado");
    resultadoTable.innerHTML = "";
    
    const fechaInicio = $('#fechaInicio').val();
    const fechaFin = $('#fechaFin').val();

    const filtro = {
        fechaInicio: fechaInicio != "" ? fechaInicio : formatDateToYYYYMMDD(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        fechaFin: fechaFin != "" ? fechaFin : formatDateToYYYYMMDD(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
    };

    fetch('/api/services',{
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filtro) 
      })
    .then(response => {
        if (!response.ok) {
        throw new Error('Error en la solicitud de la API');
        }
        return response.json();
    })
    .then(data => {
        // Suponiendo que data es un arreglo de objetos con los campos mencionados
        data[0].forEach(item => {
            const row = `
                <tr>
                    <td>${item.servicio}</td>
                    <td>${item.precio}€</td>
                    <td>${item.metodo_pago}</td>
                    <td>${item.de_quien}</td>
                    <td>${item.porcentaje_primero}%</td>
                    <td>${item.total_primero.toFixed(2)}€</td>
                    <td>${item.para_quien}</td>
                    <td>${item.porcentaje_segundo}%</td>
                    <td>${item.total_segundo.toFixed(2)}€</td>
                    <td><button class="btn btn-danger bold" onclick="eliminarFila(${item.id})">Eliminar</button></td>
                </tr>
            `;
    
            resultadoTable.innerHTML += row;
        });

        servicios = data[0];
        actualizarTotales();
    })
    .catch(error => {
        console.error('Error al obtener datos de la API:', error);
    });
}

function eliminarFila(index) {
    Swal.fire({
        text: "Seguro quieres eliminar este registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/services/${index}`, {
                method: 'DELETE',
            }).then(response => {
                  if (!response.ok) {
                    throw new Error('Error al eliminar el recurso');
                  }
                  
                  actualizarTablaResultados();
                })
                .catch(error => {
                  console.error('Error al enviar la solicitud DELETE:', error);
            });
        }
      })
}

function actualizarParaQuien(){
    
}

function calcularPorcentajes() {
    const servicio = document.getElementById("servicio").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const metodo = document.getElementById("metodo").value;
    const nombre1 = document.getElementById("nombre1").value;
    const nombre2 = document.getElementById("nombre2").value;

    if (precio === 0) {
        $('#precio').addClass('error');
        $('#errorPrecioText').show();
    } else {
        $('#precio').removeClass('error');
        $('#errorPrecioText').hide();

        let porcentajeNombre1 = 0;
        let porcentajeNombre2 = 0;

        if (nombre1 === "Anna" && nombre2 === "Vera") {
            porcentajeNombre1 = 40;
            porcentajeNombre2 = 60;
        } else if (nombre1 === "Vera" && nombre2 === "Anna") {
            porcentajeNombre1 = 80;
            porcentajeNombre2 = 20;
        } else if (nombre1 === "Anna" && nombre2 === "Valia") {
            porcentajeNombre1 = 30;
            porcentajeNombre2 = 70;
        } else if (nombre1 === "Anna" && nombre2 === "Os") {
            porcentajeNombre1 = 70;
            porcentajeNombre2 = 30;
        } else {
            porcentajeNombre1 = 100;
            porcentajeNombre2 = 0;
        }

        const totalNombre1 = (porcentajeNombre1 / 100) * precio;
        const totalNombre2 = (porcentajeNombre2 / 100) * precio;

        const data = {
            servicio: servicio,
            metodo_pago: metodo,
            de_quien: nombre1,
            porcentaje_primero: porcentajeNombre1,
            total_primero: totalNombre1,
            para_quien: nombre2,
            porcentaje_segundo: porcentajeNombre2,
            total_segundo: totalNombre2,
            precio: precio,
            fecha: formatDateToYYYYMMDD(new Date()),
        };
        
        fetch('/api/services/addService', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Error al insertar el recurso');
        }
        
        actualizarTablaResultados();
        })
        .catch(error => {
        console.error('Error al enviar la solicitud PUT:', error);
        });

    }
}

function actualizarTotales() {
    const totalesNombres = {
        Anna: 0,
        Vera: 0,
        Valia: 0,
        Os: 0
    };

    for (const servicio of servicios) {
        totalesNombres[servicio.de_quien] += servicio.total_primero;
        totalesNombres[servicio.para_quien] += servicio.total_segundo;
    }

    for (const nombre in totalesNombres) {
        const totalElement = document.getElementById(`total${nombre}`);
        totalElement.textContent = nombre +": "+ totalesNombres[nombre].toFixed(2) +"€";
    }
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade un 0 inicial si es necesario
    const day = date.getDate().toString().padStart(2, '0'); // Añade un 0 inicial si es necesario
    return `${year}-${month}-${day}`;
}