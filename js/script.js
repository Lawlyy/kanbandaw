
let tareas = [];
let idTareaEditando = null;

// cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", () => {

    cargarTareas();

    renderizarTablero();

    document.getElementById("formularioTarea").addEventListener("submit", crearTarea);
    document.getElementById("busqueda").addEventListener("input", renderizarTablero);
    document.getElementById("filtroEstado").addEventListener("change", renderizarTablero);
    document.getElementById("filtroPrioridad").addEventListener("change", renderizarTablero)

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

    if (idTareaEditando !== null) {

        const tarea = tareas.find(tarea => tarea.id === idTareaEditando);

        tarea.titulo = titulo;
        tarea.descripcion = descripcion;
        tarea.prioridad = prioridad;
        tarea.fechaLimite = fechaLimite;

        idTareaEditando = null;

        document.querySelector("#formularioTarea button").textContent =
            "Añadir tarea";

    } else {

        const nuevaTarea = {
            id: Date.now(),
            titulo: titulo,
            descripcion: descripcion,
            prioridad: prioridad,
            fechaLimite: fechaLimite,
            estado: "porHacer"
        };

        tareas.push(nuevaTarea);

    }

    guardarTareas();

    renderizarTablero();

    document.getElementById("formularioTarea").reset();

}

function renderizarTablero() {

    const columnaPorHacer = document.getElementById("columnaPorHacer");
    const columnaEnCurso = document.getElementById("columnaEnCurso");
    const columnaHecho = document.getElementById("columnaHecho");

    // limpiar columnas

    columnaPorHacer.innerHTML = "";
    columnaEnCurso.innerHTML = "";
    columnaHecho.innerHTML = "";

    // recorrer tareas

    const tareasFiltradas = obtenerTareasFiltradas();

    tareasFiltradas.forEach(tarea => {

        const tarjeta = crearTarjetaTarea(tarea);

        if (tarea.estado === "porHacer") {

            columnaPorHacer.appendChild(tarjeta);

        } else if (tarea.estado === "enCurso") {

            columnaEnCurso.appendChild(tarjeta);

        } else {

            columnaHecho.appendChild(tarjeta);

        }

    });

    actualizarEstadisticas();
}

function obtenerTareasFiltradas() {
    
    const textoBusqueda = document.getElementById("busqueda").value.toLowerCase();
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const prioridadFiltro = document.getElementById("filtroPrioridad").value;

    return tareas.filter(tarea => {

        const coincideBusqueda = tarea.titulo.toLowerCase().includes(textoBusqueda) || tarea.descripcion.toLowerCase().includes(textoBusqueda);
        const coincideEstado = estadoFiltro === "todos" || tarea.estado === estadoFiltro;
        const coincidePrioridad = prioridadFiltro === "todas" || tarea.prioridad === prioridadFiltro;

        return coincideBusqueda && coincideEstado && coincidePrioridad;
    });
}

function actualizarEstadisticas() {

    const total = tareas.length;
    const porHacer = tareas.filter(tarea => tarea.estado === "porHacer").length;
    const enCurso = tareas.filter(tarea => tarea.estado === "enCurso").length;
    const hechas = tareas.filter(tarea => tarea.estado === "hecho").length;

    let porcentaje = 0;

    if (total > 0) {
        porcentaje = Math.round((hechas / total) * 100);
    }

    document.getElementById("totalTareas").textContent = total;
    document.getElementById("totalPorHacer").textContent = porHacer;
    document.getElementById("totalEnCurso").textContent = enCurso;
    document.getElementById("porcentajeCompletadas").textContent = porcentaje + "%";

}

function crearTarjetaTarea(tarea) {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("tarea");

    tarjeta.classList.add(`prioridad-${tarea.prioridad}`);

    tarjeta.innerHTML = `

        <div class="cabeceraTarea">
            <h3 class="tituloTarea">${tarea.titulo}</h3>

            <span class="etiquetaPrioridad etiqueta-${tarea.prioridad}">${tarea.prioridad}</span>
        </div>

        <p class="descripcionTarea">${tarea.descripcion}</p>

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
        </div>
        
        <div class="contenedorBotones">

            <select onchange="cambiarEstado(${tarea.id}, this.value)">

                <option value="porHacer" ${tarea.estado === "porHacer" ? "selected" : ""}>Por hacer</option>

                <option value="enCurso" ${tarea.estado === "enCurso" ? "selected" : ""}>En curso</option>

                <option value="hecho" ${tarea.estado === "hecho" ? "selected" : ""}>Hecho</option>

            </select>

            <button class="botonEditar" onclick="editarTarea(${tarea.id})">Editar</button>

            <button class="botonEliminar" onclick="eliminarTarea(${tarea.id})">Eliminar</button>

        </div>`;

    return tarjeta;

}


function cambiarEstado(id, nuevoEstado) {

    const tarea = tareas.find(t => t.id === id);

    if (tarea) {

        tarea.estado = nuevoEstado;

        guardarTareas();

        renderizarTablero();

    }
}

function eliminarTarea(id) {

    const confirmar = confirm("¿Seguro que quieres eliminar esta tarea?");

    if (confirmar) {

        tareas = tareas.filter(tarea => tarea.id !== id);

        guardarTareas();

        renderizarTablero();

    }
}

function editarTarea(id) {

    const tarea = tareas.find(tarea => tarea.id === id);

    if (tarea) {

        document.getElementById("titulo").value = tarea.titulo;
        document.getElementById("descripcion").value = tarea.descripcion;
        document.getElementById("prioridad").value = tarea.prioridad;
        document.getElementById("fechaLimite").value = tarea.fechaLimite;

        idTareaEditando = id;

        document.querySelector("#formularioTarea button").textContent =
            "Guardar cambios";

    }
}