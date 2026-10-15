
import { cargarMaterias } from "./datos/catalogo.js";
import { iniciarSeleccion } from "./estudio/seleccion.js";

import {
  obtenerFavoritas,
  obtenerFalladas,
  obtenerRevision
} from "./almacenamiento/bancos.js";

// Selector de materia
const selectorMateria = document.querySelector("#materia");

// Modo de estudio
const selectorModo = document.querySelector("#modo-estudio");
const selectorCantidad = document.querySelector("#cantidad");

// Activar o desactivar cantidad según el modo
function actualizarModoEstudio() {
  const esRevision = selectorModo.value === "revision";

  selectorCantidad.disabled = esRevision;

  if (esRevision) {
    selectorCantidad.value = "todas";
  }
}

selectorModo.addEventListener("change", actualizarModoEstudio);
actualizarModoEstudio();

// Botones de repaso
const botonFavoritas = document.querySelector("#repasar-favoritas");
const botonFalladas = document.querySelector("#repasar-falladas");
const botonRevision = document.querySelector("#repasar-revision");

// Contadores
const cantidadFavoritas = document.querySelector("#cantidad-favoritas");
const cantidadFalladas = document.querySelector("#cantidad-falladas");
const cantidadRevision = document.querySelector("#cantidad-revision");

// Iniciar página principal
async function iniciar() {
  try {
    const materias = await cargarMaterias();

    materias.forEach(function (materia) {
      const opcion = document.createElement("option");
      opcion.value = materia.id;
      opcion.textContent = materia.nombre;
      selectorMateria.appendChild(opcion);
    });

    iniciarSeleccion(materias);

  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el catálogo de materias.");
  }

  actualizarBancos();
}

// Actualizar contadores y botones
function actualizarBancos() {
  const favoritas = obtenerFavoritas();
  const falladas = obtenerFalladas();
  const revision = obtenerRevision();

  cantidadFavoritas.textContent = favoritas.length;
  cantidadFalladas.textContent = falladas.length;
  cantidadRevision.textContent = revision.length;

  botonFavoritas.disabled = favoritas.length === 0;
  botonFalladas.disabled = falladas.length === 0;
  botonRevision.disabled = revision.length === 0;
}

// Abrir cuestionario con un banco concreto
function iniciarRepaso(tipo) {
  sessionStorage.setItem(
    "seleccionAcademia",
    JSON.stringify({
      modo: tipo,
      cantidad: "todas"
    })
  );

  window.location.href = "./cuestionario.html";
}

// Eventos de los botones
botonFavoritas.addEventListener("click", function () {
  iniciarRepaso("favoritas");
});

botonFalladas.addEventListener("click", function () {
  iniciarRepaso("falladas");
});

botonRevision.addEventListener("click", () => {
  sessionStorage.setItem(
    "seleccionAcademia",
    JSON.stringify({
      modoEstudio: "revision",
      modo: "revision",
      cantidad: "todas"
    })
  );

  window.location.href = "./revision.html";
});

iniciar();
