
import {
  obtenerPreguntaActual,
  actualizarPreguntaActual
} from "./estado.js";

import {
  rutaImagenValida,
  comprobarImagen,
  actualizarVistaPrevia
} from "./imagenes.js";

import { mostrarPregunta } from "./vista.js";

// Elementos del formulario
const mensaje = document.querySelector("#mensaje-revision");
const formularioEdicion = document.querySelector("#formulario-edicion");

const editarEnunciado = document.querySelector("#editar-enunciado");
const editarOpciones = document.querySelector("#editar-opciones");
const editarCorrecta = document.querySelector("#editar-correcta");
const editarExplicacion = document.querySelector("#editar-explicacion");
const editarImagen = document.querySelector("#editar-imagen");
const vistaPreviaImagen = document.querySelector("#vista-previa-imagen");

const editar = document.querySelector("#editar-revision");
const anterior = document.querySelector("#anterior-revision");
const siguiente = document.querySelector("#siguiente-revision");
const quitarRevision = document.querySelector("#quitar-revision");
const guardarEdicion = document.querySelector("#guardar-edicion");
const cancelarEdicion = document.querySelector("#cancelar-edicion");

// Abrir el formulario de edición
export function abrirEdicion() {
  const pregunta = obtenerPreguntaActual();
  if (!pregunta) return;

  mensaje.textContent = "";

  editarEnunciado.value = pregunta.pregunta;
  editarExplicacion.value = pregunta.explicacion || "";
  editarImagen.value = pregunta.imagen || "";

  actualizarVistaPrevia(editarImagen, vistaPreviaImagen);

  editarOpciones.innerHTML = "";
  editarCorrecta.innerHTML = "";

  pregunta.opciones.forEach(function (opcion, indice) {
    const etiqueta = document.createElement("label");
    etiqueta.textContent = `Opción ${indice + 1}`;

    const campo = document.createElement("textarea");
    campo.value = opcion;
    campo.rows = 2;
    campo.dataset.indice = indice;

    editarOpciones.appendChild(etiqueta);
    editarOpciones.appendChild(campo);

    const alternativa = document.createElement("option");
    alternativa.value = indice;
    alternativa.textContent = `Opción ${indice + 1}`;

    editarCorrecta.appendChild(alternativa);
  });

  editarCorrecta.value = String(pregunta.correcta);

  formularioEdicion.hidden = false;
  editar.disabled = true;
  anterior.disabled = true;
  siguiente.disabled = true;
  quitarRevision.disabled = true;
}

// Cerrar el formulario de edición
export function cerrarEdicion() {
  formularioEdicion.hidden = true;
  editar.disabled = false;
  quitarRevision.disabled = false;
  mostrarPregunta();
}

// Guardar cambios temporalmente
export async function guardarCambios() {
  const pregunta = obtenerPreguntaActual();
  if (!pregunta) return false;

  const nuevoEnunciado = editarEnunciado.value.trim();

  const nuevasOpciones = Array.from(
    editarOpciones.querySelectorAll("textarea")
  ).map(campo => campo.value.trim());

  const nuevaCorrecta = Number(editarCorrecta.value);
  const nuevaExplicacion = editarExplicacion.value.trim();
  const nuevaImagen = editarImagen.value.trim();

  if (
    !nuevoEnunciado ||
    nuevasOpciones.length === 0 ||
    nuevasOpciones.some(opcion => !opcion)
  ) {
    mensaje.textContent =
      "El enunciado y todas las opciones deben tener contenido.";
    return false;
  }

  if (
    !Number.isInteger(nuevaCorrecta) ||
    nuevaCorrecta < 0 ||
    nuevaCorrecta >= nuevasOpciones.length
  ) {
    mensaje.textContent =
      "Selecciona una respuesta correcta válida.";
    return false;
  }

  if (nuevaImagen) {
    if (!rutaImagenValida(nuevaImagen)) {
      mensaje.textContent =
        "La imagen debe estar en img/ y tener un nombre válido.";
      return false;
    }

    guardarEdicion.disabled = true;

    try {
      const existe = await comprobarImagen(nuevaImagen);

      if (!existe) {
        mensaje.textContent =
          "No se encontró la imagen. Comprueba la ruta.";
        return false;
      }
    } finally {
      guardarEdicion.disabled = false;
    }
  }

  const preguntaActualizada = {
    ...pregunta,
    pregunta: nuevoEnunciado,
    opciones: nuevasOpciones,
    correcta: nuevaCorrecta,
    explicacion: nuevaExplicacion
  };

  if (nuevaImagen) {
    preguntaActualizada.imagen = nuevaImagen;
  } else {
    delete preguntaActualizada.imagen;
  }

  actualizarPreguntaActual(preguntaActualizada);
  cerrarEdicion();

  mensaje.textContent =
    "Cambios guardados temporalmente. Pendientes de exportar.";

  return true;
}

// Actualizar vista previa al escribir una ruta
export function iniciarVistaPreviaImagen() {
  editarImagen.addEventListener("input", function () {
    actualizarVistaPrevia(editarImagen, vistaPreviaImagen);
  });
}

// Cancelar edición
export function cancelarCambios() {
  cerrarEdicion();
  mensaje.textContent = "Edición cancelada.";
}
