
export function configurarExportacion(obtenerMaterias, mensaje) {
  const botonExportarCatalogo =
    document.querySelector("#exportar-catalogo");

  botonExportarCatalogo.addEventListener("click", function () {
    // Obtener el catálogo actualizado
    const materias = obtenerMaterias();

    // Convertir el catálogo en JSON
    const contenido = JSON.stringify(materias, null, 2);

    // Preparar el archivo para descargar
    const blob = new Blob([contenido], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal de descarga
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "materias.json";

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    // Liberar la URL temporal
    URL.revokeObjectURL(url);

    // Mostrar instrucciones
    mensaje.textContent =
      "Archivo descargado: materias.json. " +
      "Ubicación: mi-academia/materias.json. " +
      "Si el archivo ya existe, reemplázalo por el descargado. " +
      "Después, recarga Mi Academia para aplicar los cambios.";
  });
}
