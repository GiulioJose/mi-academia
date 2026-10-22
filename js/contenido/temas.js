
export function configurarTemas(obtenerMaterias, mensaje) {
  const selectorMateria = document.querySelector("#contenido-materia");
  const selectorModulo = document.querySelector("#contenido-modulo");
  const selectorTema = document.querySelector("#contenido-tema");
  const botonAgregarTema = document.querySelector("#agregar-tema");
  const botonEliminarTema = document.querySelector("#eliminar-tema");

  const prefijosPreguntas = {
    hackfy: "HAC",
    ciberseguridad: "CIB"
  };

  // Mostrar los temas del módulo seleccionado
  function actualizarTemas() {
    selectorTema.innerHTML =
      '<option value="">Selecciona un tema</option>';

    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    const modulo = materia?.modulos.find(function (item) {
      return item.id === selectorModulo.value;
    });

    selectorTema.disabled = !modulo;
    botonAgregarTema.disabled = !modulo;
    botonEliminarTema.disabled = true;

    if (!modulo) return;

    modulo.temas.forEach(function (tema) {
      const opcion = document.createElement("option");
      opcion.value = tema.id;
      opcion.textContent = tema.nombre;
      selectorTema.appendChild(opcion);
    });
  }

  // Actualizar temas al cambiar de materia o módulo
  selectorMateria.addEventListener("change", actualizarTemas);
  selectorModulo.addEventListener("change", actualizarTemas);

  // Activar Quitar tema al seleccionar uno
  selectorTema.addEventListener("change", function () {
    botonEliminarTema.disabled = selectorTema.value === "";
  });

  // Añadir un tema
  botonAgregarTema.addEventListener("click", function () {
    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    const modulo = materia.modulos.find(function (item) {
      return item.id === selectorModulo.value;
    });

    if (!modulo) return;

    const nombre = prompt("Nombre del nuevo tema:");

    if (nombre === null || nombre.trim() === "") return;

    const nombreLimpio = nombre.trim();

    // Comprobar si el tema ya existe en este módulo
    const existe = modulo.temas.some(function (tema) {
      return tema.nombre.trim().toLowerCase() ===
        nombreLimpio.toLowerCase();
    });

    if (existe) {
      alert("Ya existe un tema con ese nombre en este módulo.");
      return;
    }

    // Calcular el siguiente identificador
    const numeros = modulo.temas.map(function (tema) {
      return Number(tema.id.replace(/^t/, ""));
    }).filter(Number.isFinite);

    const siguiente = Math.max(0, ...numeros) + 1;
    const id = "t" + String(siguiente).padStart(2, "0");

    // Obtener el prefijo de preguntas de la materia
    const prefijo = materia.prefijo || prefijosPreguntas[materia.id];

    if (!prefijo) {
      alert(
        "Esta materia todavía no tiene un prefijo de preguntas configurado."
      );
      return;
    }

    // Construir la ruta del archivo JSON
    const nombreArchivo =
      prefijo + "-" +
      modulo.id.toUpperCase() + "-" +
      id.toUpperCase() + ".json";

    const archivo =
      "preguntas/" +
      materia.id + "/" +
      modulo.carpeta + "/" +
      nombreArchivo;

    // Incorporar al catálogo interno
    modulo.temas.push({
      id: id,
      nombre: nombreLimpio,
      archivo: archivo
    });

    // Actualizar el selector
    actualizarTemas();
    selectorTema.value = id;
    selectorTema.dispatchEvent(new Event("change"));

    mensaje.textContent =
      "Tema añadido a " + modulo.nombre + ": " + nombreLimpio;
  });

  // Quitar el tema seleccionado
  botonEliminarTema.addEventListener("click", function () {
    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    const modulo = materia.modulos.find(function (item) {
      return item.id === selectorModulo.value;
    });

    if (!modulo) return;

    const tema = modulo.temas.find(function (item) {
      return item.id === selectorTema.value;
    });

    if (!tema) return;

    const confirmar = confirm(
      "¿Quieres quitar el tema \"" + tema.nombre +
      "\" del módulo \"" + modulo.nombre + "\"?"
    );

    if (!confirmar) return;

    // Eliminar el tema del catálogo interno
    modulo.temas = modulo.temas.filter(function (item) {
      return item.id !== tema.id;
    });

    // Actualizar el selector de temas
    actualizarTemas();

    mensaje.textContent =
      "Tema quitado de " + modulo.nombre + ": " + tema.nombre;
  });
}
