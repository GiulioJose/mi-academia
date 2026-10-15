
import { cargarMaterias } from "./datos/catalogo.js";

// Elementos del editor
const modoEditor = document.querySelector("#modo-editor");
const filtrosEditor = document.querySelector("#filtros-editor");

const materiaEditor = document.querySelector("#materia-editor");
const moduloEditor = document.querySelector("#modulo-editor");
const temaEditor = document.querySelector("#tema-editor");

const botonCargar = document.querySelector("#cargar-editor");
const mensajeEditor = document.querySelector("#mensaje-editor");

// Catálogo
let materias = [];

// Limpiar un selector
function limpiarSelector(selector, mensaje) {
  selector.innerHTML = "";

  const opcion = document.createElement("option");
  opcion.value = "";
  opcion.textContent = mensaje;

  selector.appendChild(opcion);
  selector.disabled = true;
}

// Añadir opciones
function agregarOpciones(selector, elementos) {
  elementos.forEach(function(elemento) {
    const opcion = document.createElement("option");

    opcion.value = elemento.id;
    opcion.textContent = elemento.nombre;

    selector.appendChild(opcion);
  });

  selector.disabled = false;
}

// Cambiar materia
materiaEditor.addEventListener("change", function() {
  limpiarSelector(moduloEditor, "Selecciona un módulo");
  limpiarSelector(temaEditor, "Selecciona un tema");

  botonCargar.disabled = true;

  const materia = materias.find(function(item) {
    return item.id === materiaEditor.value;
  });

  if (!materia) return;

  agregarOpciones(moduloEditor, materia.modulos);
});

// Cambiar módulo
moduloEditor.addEventListener("change", function() {
  limpiarSelector(temaEditor, "Selecciona un tema");

  botonCargar.disabled = true;

  const materia = materias.find(function(item) {
    return item.id === materiaEditor.value;
  });

  if (!materia) return;

  const modulo = materia.modulos.find(function(item) {
    return item.id === moduloEditor.value;
  });

  if (!modulo) return;

  agregarOpciones(temaEditor, modulo.temas);
});

// Cambiar tema
temaEditor.addEventListener("change", function() {
  botonCargar.disabled = !temaEditor.value;
});

// Cambiar modo de revisión
modoEditor.addEventListener("change", function() {
  const porTema = modoEditor.value === "tema";

  filtrosEditor.hidden = !porTema;

  botonCargar.disabled = porTema
    ? !temaEditor.value
    : false;
});

// Inicializar editor
async function iniciarEditor() {
  try {
    materias = await cargarMaterias();

    agregarOpciones(materiaEditor, materias);

    mensajeEditor.textContent =
      "Selecciona una materia, un módulo y un tema.";

  } catch (error) {
    console.error(error);

    mensajeEditor.textContent =
      "No se pudo cargar el catálogo de materias.";
  }
}

// Navegación por preguntas
const panelPregunta = document.querySelector("#panel-pregunta");
const contadorEditor = document.querySelector("#contador-editor");
const idEditor = document.querySelector("#id-editor");
const preguntaEditor = document.querySelector("#pregunta-editor");
const opcionesEditor = document.querySelector("#opciones-editor");
const explicacionEditor = document.querySelector("#explicacion-editor");
const imagenEditor = document.querySelector("#imagen-editor");

const botonAnterior = document.querySelector("#anterior-editor");
const botonSiguiente = document.querySelector("#siguiente-editor");

let preguntasEditor = [];
let indicePregunta = 0;

// Mostrar una pregunta
function mostrarPreguntaEditor() {
  const pregunta = preguntasEditor[indicePregunta];

  contadorEditor.textContent =
    `Pregunta ${indicePregunta + 1} de ${preguntasEditor.length}`;

  idEditor.textContent = pregunta.id;
  preguntaEditor.textContent = pregunta.pregunta;
  explicacionEditor.textContent = pregunta.explicacion || "";

  opcionesEditor.innerHTML = "";
  imagenEditor.innerHTML = "";

  pregunta.opciones.forEach(function(opcion, indice) {
    const elemento = document.createElement("p");

    elemento.textContent =
      `${indice + 1}. ${opcion}`;

    if (indice === pregunta.correcta) {
      elemento.style.fontWeight = "bold";
      elemento.style.color = "var(--exito)";
    }

    opcionesEditor.appendChild(elemento);
  });

  botonAnterior.disabled = indicePregunta === 0;
  botonSiguiente.disabled =
    indicePregunta === preguntasEditor.length - 1;

  panelPregunta.hidden = false;
}

// Cargar preguntas del tema seleccionado
botonCargar.addEventListener("click", async function() {
  panelPregunta.hidden = true;
  mensajeEditor.textContent = "Cargando preguntas...";

  if (modoEditor.value !== "tema") {
    mensajeEditor.textContent =
      "La carga de pendientes de revisión será el siguiente paso.";
    return;
  }

  const materia = materias.find(item =>
    item.id === materiaEditor.value
  );

  const modulo = materia?.modulos.find(item =>
    item.id === moduloEditor.value
  );

  const tema = modulo?.temas.find(item =>
    item.id === temaEditor.value
  );

  if (!tema?.archivo) {
    mensajeEditor.textContent =
      "Este tema todavía no tiene un archivo de preguntas.";
    return;
  }

  try {
    const respuesta = await fetch(`./${tema.archivo}`);

    if (!respuesta.ok) {
      throw new Error("No se pudo abrir el archivo JSON.");
    }

    const datos = await respuesta.json();

    preguntasEditor = Array.isArray(datos)
      ? datos
      : datos.preguntas;

    if (!Array.isArray(preguntasEditor) ||
        preguntasEditor.length === 0) {
      mensajeEditor.textContent =
        "Este tema no contiene preguntas.";
      return;
    }

    indicePregunta = 0;
    mostrarPreguntaEditor();
    mensajeEditor.textContent = "";

  } catch (error) {
    console.error(error);
    mensajeEditor.textContent =
      "No se pudieron cargar las preguntas.";
  }
});

// Navegar a la pregunta anterior
botonAnterior.addEventListener("click", function() {
  if (indicePregunta > 0) {
    indicePregunta--;
    mostrarPreguntaEditor();
  }
});

// Navegar a la siguiente pregunta
botonSiguiente.addEventListener("click", function() {
  if (indicePregunta < preguntasEditor.length - 1) {
    indicePregunta++;
    mostrarPreguntaEditor();
  }
});

iniciarEditor();
