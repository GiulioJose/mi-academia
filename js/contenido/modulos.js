
export function configurarModulos(obtenerMaterias, mensaje) {
  const selectorMateria = document.querySelector("#contenido-materia");
  const selectorModulo = document.querySelector("#contenido-modulo");
  const botonAgregarModulo = document.querySelector("#agregar-modulo");
  const botonEliminarModulo = document.querySelector("#eliminar-modulo");

  // Mostrar los módulos de la materia seleccionada
  function actualizarModulos() {
    selectorModulo.innerHTML =
      '<option value="">Selecciona un módulo</option>';

    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    selectorModulo.disabled = !materia;
    botonEliminarModulo.disabled = true;

    if (!materia) return;

    materia.modulos.forEach(function (modulo) {
      const opcion = document.createElement("option");
      opcion.value = modulo.id;
      opcion.textContent = modulo.nombre;
      selectorModulo.appendChild(opcion);
    });
  }

  // Actualizar módulos al cambiar de materia
  selectorMateria.addEventListener("change", actualizarModulos);

  // Añadir un módulo
  botonAgregarModulo.addEventListener("click", function () {
    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    const nombre = prompt("Nombre del nuevo módulo:");

    if (nombre === null || nombre.trim() === "") return;

    const nombreLimpio = nombre.trim();

    // Evitar módulos duplicados dentro de la misma materia
    const existe = materia.modulos.some(function (modulo) {
      return modulo.nombre.trim().toLowerCase() ===
        nombreLimpio.toLowerCase();
    });

    if (existe) {
      alert("Ya existe un módulo con ese nombre en esta materia.");
      return;
    }

    // Calcular el siguiente identificador
    const numeros = materia.modulos.map(function (modulo) {
      return Number(modulo.id.replace(/^m/, ""));
    }).filter(Number.isFinite);

    const siguiente = Math.max(0, ...numeros) + 1;
    const id = "m" + String(siguiente).padStart(2, "0");

    // Generar nombre de carpeta a partir del módulo
    const nombreCarpeta = nombreLimpio
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const carpeta = id + "-" + nombreCarpeta;

    // Incorporar al catálogo interno
    materia.modulos.push({
      id: id,
      nombre: nombreLimpio,
      carpeta: carpeta,
      temas: []
    });

    actualizarModulos();
    selectorModulo.value = id;
    selectorModulo.dispatchEvent(new Event("change"));

    mensaje.textContent =
      "Módulo añadido a " + materia.nombre + ": " + nombreLimpio;
  });

  // Activar o desactivar Quitar módulo
  selectorModulo.addEventListener("change", function () {
    botonEliminarModulo.disabled = selectorModulo.value === "";
  });

  // Quitar el módulo seleccionado
  botonEliminarModulo.addEventListener("click", function () {
    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    const modulo = materia.modulos.find(function (item) {
      return item.id === selectorModulo.value;
    });

    if (!modulo) return;

    const confirmar = confirm(
      "¿Quieres quitar el módulo \"" + modulo.nombre + "\"?\n\n" +
      "También se quitarán sus temas del catálogo."
    );

    if (!confirmar) return;

    // Eliminar del catálogo interno
    materia.modulos = materia.modulos.filter(function (item) {
      return item.id !== modulo.id;
    });

    actualizarModulos();
    selectorModulo.dispatchEvent(new Event("change"));

    mensaje.textContent = "Módulo quitado: " + modulo.nombre;
  });
}
