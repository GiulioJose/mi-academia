
export function configurarMaterias(
  obtenerMaterias,
  actualizarMaterias,
  mensaje
) {
  const selectorMateria = document.querySelector("#contenido-materia");
  const botonAgregarMateria = document.querySelector("#agregar-materia");
  const botonEliminarMateria = document.querySelector("#eliminar-materia");
  const botonAgregarModulo = document.querySelector("#agregar-modulo");

  const prefijosPreguntas = {
    hackfy: "HAC",
    ciberseguridad: "CIB"
  };

  // Activar botones según la materia seleccionada
  selectorMateria.addEventListener("change", function () {
    const hayMateria = selectorMateria.value !== "";

    botonAgregarModulo.disabled = !hayMateria;
    botonEliminarMateria.disabled = !hayMateria;
  });

  // Añadir materia
  botonAgregarMateria.addEventListener("click", function () {
    const nombre = prompt("Nombre de la nueva materia:");

    if (nombre === null || nombre.trim() === "") return;

    const nombreLimpio = nombre.trim();

    const id = nombreLimpio
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!id) {
      alert("El nombre no permite generar un identificador válido.");
      return;
    }

    const materias = obtenerMaterias();

    const existe = materias.some(function (materia) {
      return materia.id === id;
    });

    if (existe) {
      alert("Esa materia ya existe.");
      return;
    }

    const prefijoAutomatico = id
      .replace(/-/g, "")
      .slice(0, 3)
      .toUpperCase();

    let prefijo = prefijoAutomatico;

    const prefijosExistentes = materias.map(function (materia) {
      return materia.prefijo || prefijosPreguntas[materia.id];
    });

    while (prefijosExistentes.includes(prefijo)) {
      const respuesta = prompt(
        "El prefijo " + prefijo + " ya existe.\n\n" +
        "Introduce otro prefijo de 3 letras:",
        prefijo
      );

      if (respuesta === null) return;

      prefijo = respuesta.trim().toUpperCase();

      if (!/^[A-Z]{3}$/.test(prefijo)) {
        alert("El prefijo debe contener exactamente 3 letras (A-Z).");
        continue;
      }
    }

    materias.push({
      id: id,
      nombre: nombreLimpio,
      prefijo: prefijo,
      modulos: []
    });

    actualizarMaterias(materias);

    const opcion = document.createElement("option");
    opcion.value = id;
    opcion.textContent = nombreLimpio;

    selectorMateria.appendChild(opcion);
    selectorMateria.value = id;
    selectorMateria.dispatchEvent(new Event("change"));

    mensaje.textContent = "Materia añadida: " + nombreLimpio;
  });

  // Eliminar materia
  botonEliminarMateria.addEventListener("click", function () {
    const id = selectorMateria.value;

    if (!id) return;

    const materias = obtenerMaterias();

    const materia = materias.find(function (item) {
      return item.id === id;
    });

    if (!materia) return;

    const confirmar = confirm(
      "¿Quieres quitar la materia \"" + materia.nombre + "\"?\n\n" +
      "También se quitarán sus módulos y temas del catálogo."
    );

    if (!confirmar) return;

    const nuevasMaterias = materias.filter(function (item) {
      return item.id !== id;
    });

    actualizarMaterias(nuevasMaterias);

    const opcion = Array.from(selectorMateria.options).find(function (item) {
      return item.value === id;
    });

    if (opcion) opcion.remove();

    selectorMateria.value = "";
    selectorMateria.dispatchEvent(new Event("change"));

    mensaje.textContent = "Materia quitada: " + materia.nombre;
  });
}
