export function configurarEjemplo(obtenerMaterias) {
  const selectorMateria = document.querySelector("#contenido-materia");
  const selectorModulo = document.querySelector("#contenido-modulo");
  const selectorTema = document.querySelector("#contenido-tema");
  const ejemploPregunta = document.querySelector("#ejemplo-pregunta");
  const botonCopiarPregunta = document.querySelector("#copiar-pregunta");

  const prefijosPreguntas = {
    hackfy: "HAC",
    ciberseguridad: "CIB"
  };

  // El botón comienza desactivado
  botonCopiarPregunta.disabled = true;

  // ==========================================
  // GENERAR EJEMPLO JSON
  // ==========================================

  function actualizarEjemplo() {
    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    const modulo = materia?.modulos.find(function (item) {
      return item.id === selectorModulo.value;
    });

    const tema = modulo?.temas.find(function (item) {
      return item.id === selectorTema.value;
    });

    // Comprobar que las selecciones son válidas
    if (!materia || !modulo || !tema) {
      ejemploPregunta.textContent = "";
      botonCopiarPregunta.disabled = true;
      return;
    }

    // Obtener el prefijo de la materia
    const prefijo = materia.prefijo || prefijosPreguntas[materia.id];

    if (!prefijo) {
      ejemploPregunta.textContent = "";
      botonCopiarPregunta.disabled = true;
      return;
    }

    // Generar identificador de la pregunta
    const id =
      prefijo + "-" +
      modulo.id.toUpperCase() + "-" +
      tema.id.toUpperCase() + "-001";

    // Crear la plantilla de pregunta
    const pregunta = {
      id: id,
      materia: materia.id,
      modulo: modulo.id,
      tema: tema.id,
      pregunta: "",
      opciones: ["", "", ""],
      correcta: 0,
      explicacion: "",
      imagen: ""
    };

    // Mostrar el JSON y activar el botón
    ejemploPregunta.textContent = JSON.stringify(pregunta, null, 2);
    botonCopiarPregunta.disabled = false;
  }

  // ==========================================
  // ACTUALIZAR SEGÚN LA SELECCIÓN
  // ==========================================

  selectorMateria.addEventListener("change", actualizarEjemplo);
  selectorModulo.addEventListener("change", actualizarEjemplo);
  selectorTema.addEventListener("change", actualizarEjemplo);

  // ==========================================
  // COPIAR EJEMPLO AL PORTAPAPELES
  // ==========================================

  botonCopiarPregunta.addEventListener("click", async function () {
    const contenido = ejemploPregunta.textContent.trim();

    if (!contenido) return;

    try {
      await navigator.clipboard.writeText(contenido);

      const textoOriginal = botonCopiarPregunta.textContent;
      botonCopiarPregunta.textContent = "¡Copiado!";

      setTimeout(function () {
        botonCopiarPregunta.textContent = textoOriginal;
      }, 2000);

    } catch (error) {
      console.error("No se pudo copiar el ejemplo:", error);
      alert("No se pudo copiar el ejemplo JSON.");
    }
  });
}
