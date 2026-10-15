
import {
  estado,
  obtenerPreguntaActual
} from "./estado.js";

import { estaEnRevision } from "../almacenamiento/bancos.js";

// Elementos de la página
const contador = document.querySelector("#contador-revision");
const identificador = document.querySelector("#id-revision");
const titulo = document.querySelector("#pregunta-revision");
const imagen = document.querySelector("#imagen-revision");
const opciones = document.querySelector("#opciones-revision");
const explicacion = document.querySelector("#explicacion-revision");

const anterior = document.querySelector("#anterior-revision");
const siguiente = document.querySelector("#siguiente-revision");
const quitarRevision = document.querySelector("#quitar-revision");

// Mostrar la pregunta actual
export function mostrarPregunta() {
  const pregunta = obtenerPreguntaActual();
  if (!pregunta) return;

  const marcada = estaEnRevision(pregunta.id);

  quitarRevision.textContent = marcada
    ? "✓ Quitar de pendientes de revisión"
    : "♧ Marcar para revisar";

  contador.textContent =
    `Pregunta ${estado.indiceActual + 1} de ${estado.preguntas.length}`;

  identificador.textContent = pregunta.id;
  titulo.textContent = pregunta.pregunta;
  explicacion.textContent = pregunta.explicacion || "";

  opciones.innerHTML = "";
  imagen.innerHTML = "";

  if (pregunta.imagen) {
    const elementoImagen = document.createElement("img");
    elementoImagen.src = `./${pregunta.imagen}`;
    elementoImagen.alt = "Imagen de la pregunta";
    elementoImagen.style.maxWidth = "100%";
    imagen.appendChild(elementoImagen);
  }

  pregunta.opciones.forEach(function (opcion, indice) {
    const elemento = document.createElement("p");
    elemento.textContent = `${indice + 1}. ${opcion}`;

    if (indice === pregunta.correcta) {
      elemento.style.fontWeight = "bold";
      elemento.style.color = "var(--exito)";
    }

    opciones.appendChild(elemento);
  });

  anterior.disabled = estado.indiceActual === 0;
  siguiente.disabled =
    estado.indiceActual === estado.preguntas.length - 1;
}
