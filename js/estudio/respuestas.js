
import {
  registrarFallo,
  resolverFallo
} from "../almacenamiento/bancos.js";

// Comprobar una respuesta
export function comprobarRespuesta(pregunta, esCorrecta) {

  if (esCorrecta) {
    // Si estaba en falladas, eliminarla
    resolverFallo(pregunta.id);
  } else {
    // Guardar la pregunta como fallada
    registrarFallo(pregunta.id);
  }

  return {
    esCorrecta: esCorrecta,

    resultado: esCorrecta
      ? "✅ Respuesta correcta"
      : "❌ Respuesta incorrecta",

    respuestaCorrecta: esCorrecta
      ? ""
      : "Respuesta correcta: " +
        pregunta.opciones[pregunta.correcta],

    explicacion: pregunta.explicacion
  };
}
