import { contarPreguntas } from "../datos/catalogo.js";

let versionSeleccion = 0;

export function iniciarSeleccion(materias) {
  const selectorMateria = document.querySelector("#materia");
  const contenedorModulos = document.querySelector("#modulos");
  const contenedorTemas = document.querySelector("#temas");
  const comenzar = document.querySelector("#comenzar");
  const cantidad = document.querySelector("#cantidad");
  const modoEstudio = document.querySelector("#modo-estudio");

  selectorMateria.addEventListener("change", function () {
    versionSeleccion++;

    contenedorModulos.innerHTML = "";
    contenedorTemas.innerHTML = "";
    comenzar.disabled = true;

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    materia.modulos.forEach(function (modulo) {
      const etiqueta = document.createElement("label");
      const casilla = document.createElement("input");

      casilla.type = "checkbox";
      casilla.value = modulo.id;
      casilla.className = "modulo";

      etiqueta.appendChild(casilla);
      etiqueta.append(" " + modulo.nombre);

      contenedorModulos.appendChild(etiqueta);
      contenedorModulos.appendChild(document.createElement("br"));
    });
  });

  contenedorModulos.addEventListener("change", async function () {
    const versionActual = ++versionSeleccion;

    contenedorTemas.innerHTML = "";
    comenzar.disabled = true;

    const materia = materias.find(function (item) {
      return item.id === selectorMateria.value;
    });

    if (!materia) return;

    const modulosSeleccionados = Array.from(
      document.querySelectorAll(".modulo:checked")
    ).map(function (casilla) {
      return casilla.value;
    });

    const temasDisponibles = [];

    materia.modulos.forEach(function (modulo) {
      if (!modulosSeleccionados.includes(modulo.id)) return;

      modulo.temas.forEach(function (tema) {
        temasDisponibles.push({ modulo, tema });
      });
    });

    for (const elemento of temasDisponibles) {
      const modulo = elemento.modulo;
      const tema = elemento.tema;

      const etiqueta = document.createElement("label");
      const casilla = document.createElement("input");
      const contador = document.createElement("span");

      casilla.type = "checkbox";
      casilla.className = "tema";
      casilla.value = modulo.id + ":" + tema.id;
      casilla.disabled = true;

      contador.textContent = " — Comprobando...";

      etiqueta.appendChild(casilla);
      etiqueta.append(" " + modulo.nombre + " - " + tema.nombre);
      etiqueta.appendChild(contador);

      contenedorTemas.appendChild(etiqueta);
      contenedorTemas.appendChild(document.createElement("br"));

      const total = await contarPreguntas(tema);

      if (versionActual !== versionSeleccion) return;

      if (total > 0) {
        casilla.disabled = false;
        casilla.checked = true;
        contador.textContent = " — " + total + " preguntas";
      } else {
        contador.textContent = " — Sin preguntas";
      }
    }

    actualizarBoton();
  });

  contenedorTemas.addEventListener("change", actualizarBoton);

  function actualizarBoton() {
    comenzar.disabled =
      document.querySelectorAll(".tema:checked").length === 0;
  }

  comenzar.addEventListener("click", function () {
    const seleccion = {
      modoEstudio: modoEstudio.value,
      materia: selectorMateria.value,
      temas: Array.from(
        document.querySelectorAll(".tema:checked")
      ).map(function (casilla) {
        return casilla.value;
      }),
      cantidad: modoEstudio.value === "revision"
        ? "todas"
        : cantidad.value
    };

    sessionStorage.setItem(
      "seleccionAcademia",
      JSON.stringify(seleccion)
    );

    window.location.href = modoEstudio.value === "revision"
      ? "./revision.html"
      : "./cuestionario.html";
  });
}
