
import { cargarMaterias } from "../datos/catalogo.js";
import { cargarPreguntas } from "../datos/preguntas.js";
import { obtenerRevision } from "../almacenamiento/bancos.js";

import {
  estado,
  establecerPreguntas,
  establecerCatalogo,
  establecerIndiceArchivos
} from "./estado.js";

import { construirIndiceArchivos } from "./exportacion.js";

// Cargar las preguntas correspondientes a la selección
export async function cargarRevision() {
  const seleccionGuardada =
    sessionStorage.getItem("seleccionAcademia");

  if (!seleccionGuardada) {
    throw new Error("No hay una selección guardada.");
  }

  const seleccion = JSON.parse(seleccionGuardada);

  establecerCatalogo(await cargarMaterias());

  if (seleccion.modo === "revision") {
    const preguntas = await cargarPreguntas(seleccion);

    if (preguntas.length === 0) {
      throw new Error(
        "No hay preguntas pendientes de revisión."
      );
    }

    const ordenPendientes = obtenerRevision();

    preguntas.sort(function (a, b) {
      return ordenPendientes.indexOf(a.id) -
        ordenPendientes.indexOf(b.id);
    });

    establecerPreguntas(preguntas);

  } else {
    if (seleccion.modoEstudio !== "revision") {
      throw new Error(
        "No se ha seleccionado el modo revisión."
      );
    }

    const materia = estado.catalogo.find(function (item) {
      return item.id === seleccion.materia;
    });

    if (!materia) {
      throw new Error(
        "No se encontró la materia seleccionada."
      );
    }

    const preguntas = [];

    for (const modulo of materia.modulos) {
      for (const tema of modulo.temas) {
        const identificadorTema =
          `${modulo.id}:${tema.id}`;

        if (!seleccion.temas.includes(identificadorTema)) {
          continue;
        }

        if (!tema.archivo) continue;

        const respuesta = await fetch(
          `./${tema.archivo}`
        );

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo cargar ${tema.archivo}`
          );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error(
            `Formato incorrecto: ${tema.archivo}`
          );
        }

        preguntas.push(...datos);
      }
    }

    establecerPreguntas(preguntas);
  }

  if (estado.preguntas.length === 0) {
    throw new Error("No hay preguntas disponibles.");
  }

  establecerIndiceArchivos(
    await construirIndiceArchivos(estado.catalogo)
  );
}
