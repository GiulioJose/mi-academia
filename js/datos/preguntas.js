import {
  obtenerFavoritas,
  obtenerFalladas,
  obtenerRevision
} from "../almacenamiento/bancos.js";

// Mezclar un array sin modificar el original
export function mezclar(array) {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

// Leer un archivo JSON
async function leerJSON(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar: " + ruta);
  }

  return await respuesta.json();
}

// Crear catálogo de archivos registrados
function obtenerCatalogo(materias) {
  const catalogo = [];

  materias.forEach(function(materia) {
    materia.modulos.forEach(function(modulo) {
      modulo.temas.forEach(function(tema) {
        if (tema.archivo) {
          catalogo.push({
            materia: materia.id,
            modulo: modulo.id,
            tema: tema.id,
            archivo: tema.archivo
          });
        }
      });
    });
  });

  return catalogo;
}

// Seleccionar archivos necesarios
function seleccionarArchivos(catalogo, seleccion) {
  if (
    seleccion.modo === "favoritas" ||
    seleccion.modo === "falladas" ||
    seleccion.modo === "revision"
  ) {
    return catalogo;
  }

  return catalogo.filter(function(item) {
    return (
      item.materia === seleccion.materia &&
      seleccion.temas.includes(
        item.modulo + ":" + item.tema
      )
    );
  });
}

// Cargar preguntas para un cuestionario
export async function cargarPreguntas(seleccion) {
  const materias = await leerJSON("./materias.json");
  const catalogo = obtenerCatalogo(materias);
  const archivos = seleccionarArchivos(catalogo, seleccion);

  if (archivos.length === 0) {
    return [];
  }

  const rutas = [
    ...new Set(
      archivos.map(function(item) {
        return item.archivo;
      })
    )
  ];

  const resultados = await Promise.all(
    rutas.map(function(ruta) {
      return leerJSON("./" + ruta);
    })
  );

  resultados.forEach(function(datos) {
    if (!Array.isArray(datos)) {
      throw new Error(
        "Un archivo de preguntas no contiene una lista JSON."
      );
    }
  });

  let todas = resultados.flat();

  // Filtrar según el tipo de estudio
  if (seleccion.modo === "favoritas") {
    const favoritas = obtenerFavoritas();

    todas = todas.filter(function(item) {
      return favoritas.includes(item.id);
    });

  } else if (seleccion.modo === "falladas") {
    const falladas = obtenerFalladas();

    todas = todas.filter(function(item) {
      return falladas.includes(item.id);
    });

  } else if (seleccion.modo === "revision") {
    const revision = obtenerRevision();

    todas = todas.filter(function(item) {
      return revision.includes(item.id);
    });

  } else {
    todas = todas.filter(function(item) {
      return (
        item.materia === seleccion.materia &&
        seleccion.temas.includes(
          item.modulo + ":" + item.tema
        )
      );
    });
  }

  // Evitar preguntas duplicadas
  const idsEncontrados = new Set();

  todas = todas.filter(function(item) {
    if (idsEncontrados.has(item.id)) {
      return false;
    }

    idsEncontrados.add(item.id);
    return true;
  });

  // Mezclar preguntas
  todas = mezclar(todas);

  // Aplicar cantidad seleccionada
  if (
    seleccion.cantidad &&
    seleccion.cantidad !== "todas"
  ) {
    todas = todas.slice(
      0,
      Number(seleccion.cantidad)
    );
  }

  return todas;
}
