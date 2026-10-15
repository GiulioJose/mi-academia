
// Calcular los resultados del cuestionario
export function calcularResultados(total, aciertos) {
  const errores = total - aciertos;

  const porcentaje = total > 0
    ? (aciertos / total) * 100
    : 0;

  return {
    total: total,
    aciertos: aciertos,
    errores: errores,
    porcentaje: porcentaje
  };
}

// Mostrar los resultados en pantalla
export function mostrarResultados(total, aciertos) {
  const resultados = calcularResultados(total, aciertos);

  const cuestionario = document.querySelector("#cuestionario");
  const resultadosFinales = document.querySelector("#resultados-finales");

  cuestionario.hidden = true;
  resultadosFinales.hidden = false;

  document.querySelector("#total-preguntas").textContent =
    "Preguntas respondidas: " + resultados.total;

  document.querySelector("#total-aciertos").textContent =
    "Respuestas correctas: " + resultados.aciertos;

  document.querySelector("#total-errores").textContent =
    "Respuestas incorrectas: " + resultados.errores;

  document.querySelector("#porcentaje").textContent =
    "Resultado: " + resultados.porcentaje.toFixed(1) + "%";
}
