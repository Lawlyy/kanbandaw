
let tareas = [];

// Cargar tareas al iniciar

document.addEventListener("DOMContentLoaded", () => {

    cargarTareas();

    renderizarTablero();

});

// Guardar tareas en localStorage

function guardarTareas() {

    localStorage.setItem("tareasKanban", JSON.stringify(tareas));

}

// Cargar tareas desde localStorage

function cargarTareas() {

    const tareasGuardadas = localStorage.getItem("tareasKanban");

    if (tareasGuardadas) {

        tareas = JSON.parse(tareasGuardadas);

    } else {

        tareas = [
            {
                id: 1,
                titulo: "Primera tarea",
                descripcion: "Ejemplo de tarea de prueba",
                prioridad: "media",
                fechaLimite: "2026-05-15",
                estado: "porHacer"
            }
        ];

        guardarTareas();

    }

}

// Renderizar tablero

function renderizarTablero() {

    const columnaPorHacer = document.getElementById("columnaPorHacer");
    const columnaEnCurso = document.getElementById("columnaEnCurso");
    const columnaHecho = document.getElementById("columnaHecho");

    // Limpiar columnas

    columnaPorHacer.innerHTML = "";
    columnaEnCurso.innerHTML = "";
    columnaHecho.innerHTML = "";

    // Recorrer tareas

    tareas.forEach(tarea => {

        const tarjeta = crearTarjetaTarea(tarea);

        if (tarea.estado === "porHacer") {

            columnaPorHacer.appendChild(tarjeta);

        } else if (tarea.estado === "enCurso") {

            columnaEnCurso.appendChild(tarjeta);

        } else {

            columnaHecho.appendChild(tarjeta);

        }

    });

}

// Crear tarjeta visual

function crearTarjetaTarea(tarea) {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("tarea");

    tarjeta.classList.add(`prioridad-${tarea.prioridad}`);

    tarjeta.innerHTML = `
    
        <h3 class="text-lg font-bold">
            ${tarea.titulo}
        </h3>

        <p>
            ${tarea.descripcion}
        </p>

        <p class="mt-2">
            <strong>Prioridad:</strong> ${tarea.prioridad}
        </p>

        <p>
            <strong>Fecha límite:</strong> ${tarea.fechaLimite}
        </p>

    `;

    return tarjeta;

}