
/**
 * Construye un índice:
 * ID de pregunta -> ruta de su archivo JSON original.
 */
export async function construirIndiceArchivos(catalogo) {
  const archivosPorPregunta = new Map();

  for (const materia of catalogo) {
    for (const modulo of materia.modulos) {
      for (const tema of modulo.temas) {
        if (!tema.archivo) continue;

        const respuesta = await fetch(`./${tema.archivo}`);

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

        for (const pregunta of datos) {
          if (archivosPorPregunta.has(pregunta.id)) {
            throw new Error(
              `ID duplicado en el catálogo: ${pregunta.id}`
            );
          }

          archivosPorPregunta.set(
            pregunta.id,
            tema.archivo
          );
        }
      }
    }
  }

  return archivosPorPregunta;
}

/**
 * Descarga un archivo JSON.
 */
function descargarJSON(nombreArchivo, datos) {
  const contenido = JSON.stringify(datos, null, 2);

  const blob = new Blob(
    [contenido],
    { type: "application/json;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Exporta los temas completos que contienen
 * preguntas modificadas.
 */
export async function exportarJSONModificados(
  cambiosTemporales,
  archivosPorPregunta
) {
  if (cambiosTemporales.size === 0) {
    return 0;
  }

  const cambiosPorArchivo = new Map();

  for (const [id, pregunta] of cambiosTemporales) {
    const archivo = archivosPorPregunta.get(id);

    if (!archivo) {
      throw new Error(
        `No se encontró el archivo original de ${id}`
      );
    }

    if (!cambiosPorArchivo.has(archivo)) {
      cambiosPorArchivo.set(archivo, new Map());
    }

    cambiosPorArchivo.get(archivo).set(id, pregunta);
  }

  // Preparar todos los archivos antes de descargarlos.
  const descargas = [];

  for (const [archivo, cambios] of cambiosPorArchivo) {
    const respuesta = await fetch(`./${archivo}`);

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo cargar el archivo ${archivo}`
      );
    }

    const originales = await respuesta.json();

    if (!Array.isArray(originales)) {
      throw new Error(
        `El archivo ${archivo} no contiene una lista de preguntas.`
      );
    }

    const idsOriginales = new Set(
      originales.map(pregunta => pregunta.id)
    );

    for (const id of cambios.keys()) {
      if (!idsOriginales.has(id)) {
        throw new Error(
          `La pregunta ${id} no existe en ${archivo}`
        );
      }
    }

    // Conservar todas las preguntas y su orden.
    const actualizadas = originales.map(function (pregunta) {
      return cambios.get(pregunta.id) || pregunta;
    });

    const nombreArchivo = archivo.split("/").pop();

    descargas.push({
      nombreArchivo,
      datos: actualizadas
    });
  }

  for (const descarga of descargas) {
    descargarJSON(
      descarga.nombreArchivo,
      descarga.datos
    );
  }

  return descargas.length;
}
