
let tareas = [];

// cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", () => {

    cargarTareas();

    renderizarTablero();

    document.getElementById("formularioTarea").addEventListener("submit", crearTarea);

});

// guardar tareas en localStorage
function guardarTareas() {

    localStorage.setItem("tareasKanban", JSON.stringify(tareas));

}

// cargar tareas desde localStorage
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
 // crear tarea 
function crearTarea(evento) {

    evento.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const prioridad = document.getElementById("prioridad").value;
    const fechaLimite = document.getElementById("fechaLimite").value;

    if (titulo === "") {
        alert("El título es obligatorio");
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo,
        descripcion: descripcion,
        prioridad: prioridad,
        fechaLimite: fechaLimite,
        estado: "porHacer"
    };

    tareas.push(nuevaTarea);

    guardarTareas();

    renderizarTablero();

    document.getElementById("formularioTarea").reset();

}

// renderizar tablero
function renderizarTablero() {

    const columnaPorHacer = document.getElementById("columnaPorHacer");
    const columnaEnCurso = document.getElementById("columnaEnCurso");
    const columnaHecho = document.getElementById("columnaHecho");

    // limpiar columnas

    columnaPorHacer.innerHTML = "";
    columnaEnCurso.innerHTML = "";
    columnaHecho.innerHTML = "";

    // recorrer tareas

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

// crear tarjeta visual

function crearTarjetaTarea(tarea) {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("tarea");

    tarjeta.classList.add(`prioridad-${tarea.prioridad}`);

    tarjeta.innerHTML = `

    <div class="cabeceraTarea">
        <h3 class="tituloTarea">
            ${tarea.titulo}
        </h3>

        <span class="etiquetaPrioridad etiqueta-${tarea.prioridad}">
            ${tarea.prioridad}
        </span>
    </div>

    <p class="descripcionTarea">
        ${tarea.descripcion}
    </p>

    <hr class="separadorTarea">

    <div class="detalleTarea">
        <p>
            <span class="iconoPrioridad">⚑</span>
            <strong>Prioridad:</strong>
            <span class="texto-${tarea.prioridad}">${tarea.prioridad}</span>
        </p>

        <p>
            <span class="iconoFecha">▣</span>
            <strong>Fecha límite:</strong> ${tarea.fechaLimite || "Sin fecha"}
        </p>
    </div>`;

    return tarjeta;

}