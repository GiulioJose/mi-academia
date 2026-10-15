
import {
  cargarPreguntas,
  mezclar
} from "./datos/preguntas.js";

import {
  esFavorita,
  alternarFavorita,
  estaEnRevision,
  alternarRevision
} from "./almacenamiento/bancos.js";

import {
  comprobarRespuesta
} from "./estudio/respuestas.js";

import {
  mostrarResultados
} from "./estudio/resultados.js";

// Elementos HTML
const pregunta = document.querySelector("#pregunta");
const idPregunta = document.querySelector("#id-pregunta");
const contador = document.querySelector("#contador");
const contenedorOpciones = document.querySelector("#opciones");

const resultado = document.querySelector("#resultado");
const respuestaCorrecta = document.querySelector("#respuesta-correcta");
const explicacion = document.querySelector("#explicacion");

const siguiente = document.querySelector("#siguiente");
const favorito = document.querySelector("#favorito");
const revisar = document.querySelector("#revisar");

// Estado del cuestionario
let preguntas = [];
let preguntaActual = 0;
let respondida = false;
let aciertos = 0;

// Recuperar selección del inicio
const seleccion = JSON.parse(
  sessionStorage.getItem("seleccionAcademia") || "null"
);

// Actualizar botón de favoritas
function actualizarFavorito() {
  const actual = preguntas[preguntaActual];

  favorito.textContent = esFavorita(actual.id)
    ? "★ Quitar de favoritas"
    : "☆ Guardar en favoritas";
}

// Actualizar botón de revisión
function actualizarRevision() {
  const actual = preguntas[preguntaActual];

  revisar.textContent = estaEnRevision(actual.id)
    ? "✓ Quitar de revisión"
    : "☐ Marcar para revisar";
}

// Guardar o quitar favorita
favorito.addEventListener("click", function() {
  if (preguntas.length === 0) return;

  const actual = preguntas[preguntaActual];

  alternarFavorita(actual.id);
  actualizarFavorito();
});

// Marcar o desmarcar para revisión
revisar.addEventListener("click", function() {
  if (preguntas.length === 0) return;

  const actual = preguntas[preguntaActual];

  alternarRevision(actual.id);
  actualizarRevision();
});

// Mostrar pregunta actual
function mostrarPregunta() {
  const actual = preguntas[preguntaActual];

  contador.textContent =
    "Pregunta " + (preguntaActual + 1) +
    " de " + preguntas.length;

  idPregunta.textContent = "ID: " + actual.id;
  pregunta.textContent = actual.pregunta;

  actualizarFavorito();
  actualizarRevision();

  // Preparar opciones conservando la correcta
  const opciones = actual.opciones.map(function(texto, indice) {
    return {
      texto: texto,
      esCorrecta: indice === actual.correcta
    };
  });

  contenedorOpciones.innerHTML = "";

  mezclar(opciones).forEach(function(opcion) {
    const boton = document.createElement("button");

    boton.className = "opcion";
    boton.textContent = opcion.texto;

    boton.addEventListener("click", function() {
      responder(opcion.esCorrecta);
    });

    contenedorOpciones.appendChild(boton);
  });

  resultado.textContent = "";
  respuestaCorrecta.textContent = "";
  explicacion.textContent = "";

  respondida = false;
  siguiente.disabled = true;

  siguiente.textContent =
    preguntaActual + 1 === preguntas.length
      ? "Ver resultados"
      : "Siguiente pregunta";
}

// Procesar respuesta
function responder(esCorrecta) {
  if (respondida || preguntas.length === 0) return;

  const actual = preguntas[preguntaActual];

  const correccion = comprobarRespuesta(
    actual,
    esCorrecta
  );

  if (correccion.esCorrecta) {
    aciertos++;
  }

  resultado.textContent = correccion.resultado;
  respuestaCorrecta.textContent = correccion.respuestaCorrecta;
  explicacion.textContent = correccion.explicacion;

  respondida = true;

  document.querySelectorAll(".opcion").forEach(function(boton) {
    boton.disabled = true;
  });

  siguiente.disabled = false;
}

// Avanzar o terminar
siguiente.addEventListener("click", function() {
  if (!respondida) return;

  if (preguntaActual + 1 < preguntas.length) {
    preguntaActual++;
    mostrarPregunta();
  } else {
    mostrarResultados(preguntas.length, aciertos);
  }
});

// Iniciar cuestionario
async function iniciarCuestionario() {
  siguiente.disabled = true;
  favorito.disabled = true;
  revisar.disabled = true;

  if (!seleccion) {
    pregunta.textContent =
      "Primero debes seleccionar qué estudiar.";
    return;
  }

  pregunta.textContent = "Cargando preguntas...";

  try {
    preguntas = await cargarPreguntas(seleccion);

    if (preguntas.length === 0) {
      pregunta.textContent =
        "No hay preguntas disponibles para esta selección.";
      return;
    }

    preguntaActual = 0;
    aciertos = 0;

    favorito.disabled = false;
    revisar.disabled = false;

    mostrarPregunta();

  } catch (error) {
    console.error(error);

    pregunta.textContent =
      "Error al cargar las preguntas. Revisa la consola.";
  }
}

iniciarCuestionario();
