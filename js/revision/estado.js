
/**
 * Estado compartido del modo Revisión.
 *
 * Las funciones modifican el mismo objeto para que
 * todos los módulos consulten los datos actualizados.
 */

export const estado = {
  preguntas: [],
  indiceActual: 0,
  catalogo: [],
  cambiosTemporales: new Map(),
  archivosPorPregunta: new Map()
};

export function obtenerPreguntaActual() {
  return estado.preguntas[estado.indiceActual] || null;
}

export function establecerPreguntas(preguntas) {
  estado.preguntas = preguntas;
  estado.indiceActual = 0;
}

export function establecerCatalogo(catalogo) {
  estado.catalogo = catalogo;
}

export function establecerIndiceArchivos(indice) {
  estado.archivosPorPregunta = indice;
}

export function irAnterior() {
  if (estado.indiceActual > 0) {
    estado.indiceActual--;
  }
}

export function irSiguiente() {
  if (estado.indiceActual < estado.preguntas.length - 1) {
    estado.indiceActual++;
  }
}

export function actualizarPreguntaActual(pregunta) {
  if (!obtenerPreguntaActual()) return;

  estado.preguntas[estado.indiceActual] = pregunta;
  estado.cambiosTemporales.set(pregunta.id, pregunta);
}
