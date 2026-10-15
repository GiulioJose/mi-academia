
import {
  estado,
  obtenerPreguntaActual,
  irAnterior,
  irSiguiente
} from "./revision/estado.js";

import { cargarRevision } from "./revision/carga.js";
import { mostrarPregunta } from "./revision/vista.js";

import {
  abrirEdicion,
  guardarCambios,
  iniciarVistaPreviaImagen,
  cancelarCambios
} from "./revision/editor.js";

import { exportarJSONModificados } from "./revision/exportacion.js";
import { alternarRevision } from "./almacenamiento/bancos.js";

// Elementos de la página
const mensaje = document.querySelector("#mensaje-revision");
const anterior = document.querySelector("#anterior-revision");
const siguiente = document.querySelector("#siguiente-revision");
const editar = document.querySelector("#editar-revision");
const quitarRevision = document.querySelector("#quitar-revision");
const exportarCambios = document.querySelector("#exportar-cambios");

const guardarEdicion = document.querySelector("#guardar-edicion");
const cancelarEdicion = document.querySelector("#cancelar-edicion");

// Control de exportación
let cambiosPendientes = false;
let exportando = false;

// Actualizar el botón de exportación
function actualizarBotonExportar() {
  const cantidad = estado.cambiosTemporales.size;

  if (exportando) {
    exportarCambios.textContent = "Exportando...";
    exportarCambios.disabled = true;
    return;
  }

  if (cantidad === 0) {
    exportarCambios.textContent = "Exportar cambios (0)";
    exportarCambios.disabled = true;
    return;
  }

  if (cambiosPendientes) {
    exportarCambios.textContent = `Exportar cambios (${cantidad})`;
    exportarCambios.disabled = false;
  } else {
    exportarCambios.textContent = `Cambios exportados (${cantidad})`;
    exportarCambios.disabled = true;
  }
}

// Iniciar el modo Revisión
async function iniciarRevision() {
  try {
    await cargarRevision();
    mostrarPregunta();
    actualizarBotonExportar();
  } catch (error) {
    console.error(error);
    mensaje.textContent = error.message;

    anterior.disabled = true;
    siguiente.disabled = true;
    editar.disabled = true;
    quitarRevision.disabled = true;
    exportarCambios.disabled = true;
  }
}

// Navegación
anterior.addEventListener("click", function () {
  if (estado.indiceActual > 0) {
    irAnterior();
    mensaje.textContent = "";
    mostrarPregunta();
  }
});

siguiente.addEventListener("click", function () {
  if (estado.indiceActual < estado.preguntas.length - 1) {
    irSiguiente();
    mensaje.textContent = "";
    mostrarPregunta();
  }
});

// Edición
editar.addEventListener("click", abrirEdicion);

guardarEdicion.addEventListener("click", async function () {
  const guardado = await guardarCambios();

  if (guardado) {
    cambiosPendientes = true;
    actualizarBotonExportar();
  }
});

iniciarVistaPreviaImagen();

cancelarEdicion.addEventListener("click", cancelarCambios);

// Pendientes de revisión
quitarRevision.addEventListener("click", function () {
  const pregunta = obtenerPreguntaActual();
  if (!pregunta) return;

  alternarRevision(pregunta.id);
  mostrarPregunta();
});

// Exportación
exportarCambios.addEventListener("click", async function () {
  if (
    estado.cambiosTemporales.size === 0 ||
    !cambiosPendientes ||
    exportando
  ) {
    return;
  }

  exportando = true;
  actualizarBotonExportar();

  mensaje.textContent = "Preparando archivos JSON...";

  try {
    const cantidad = await exportarJSONModificados(
      estado.cambiosTemporales,
      estado.archivosPorPregunta
    );

    cambiosPendientes = false;

    mensaje.textContent =
      `Se prepararon ${cantidad} archivo(s) JSON. ` +
      "Comprueba las descargas antes de sustituir los originales.";

  } catch (error) {
    console.error(error);
    mensaje.textContent = error.message;

    // Los cambios siguen pendientes para poder reintentar.
    cambiosPendientes = true;

  } finally {
    exportando = false;
    actualizarBotonExportar();
  }
});

// Advertencia al abandonar la página
window.addEventListener("beforeunload", function (evento) {
  if (!cambiosPendientes) return;

  evento.preventDefault();
  evento.returnValue = "";
});

// Iniciar
editar.disabled = false;
quitarRevision.disabled = false;

actualizarBotonExportar();
iniciarRevision();
