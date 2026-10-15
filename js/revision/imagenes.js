
const extensionesImagen = [
  "png",
  "jpg",
  "jpeg",
  "jfif",
  "webp",
  "gif"
];

// Comprobar que la ruta tiene un formato válido
export function rutaImagenValida(ruta) {
  if (!ruta.startsWith("img/")) return false;

  const nombreArchivo = ruta.slice(4);

  if (!nombreArchivo || nombreArchivo.includes("/")) {
    return false;
  }

  const partes = nombreArchivo.split(".");

  if (partes.length !== 2) return false;

  const nombre = partes[0];
  const extension = partes[1].toLowerCase();

  return /^[a-zA-Z0-9_-]+$/.test(nombre) &&
    extensionesImagen.includes(extension);
}

// Comprobar que el archivo de imagen existe
export function comprobarImagen(ruta) {
  return new Promise(function (resolve) {
    const prueba = new Image();

    prueba.onload = () => resolve(true);
    prueba.onerror = () => resolve(false);

    prueba.src = `./${ruta}`;
  });
}

// Mostrar la vista previa de una imagen
export function actualizarVistaPrevia(
  campoImagen,
  contenedorVistaPrevia
) {
  const ruta = campoImagen.value.trim();

  contenedorVistaPrevia.innerHTML = "";

  if (!ruta) {
    contenedorVistaPrevia.textContent =
      "Esta pregunta no tendrá imagen.";
    return;
  }

  if (!rutaImagenValida(ruta)) {
    contenedorVistaPrevia.textContent =
      "Utiliza una ruta como img/red_1.png";
    return;
  }

  const elementoImagen = document.createElement("img");

  elementoImagen.src = `./${ruta}`;
  elementoImagen.alt = "Vista previa de la imagen";
  elementoImagen.style.maxWidth = "100%";
  elementoImagen.style.maxHeight = "300px";
  elementoImagen.style.objectFit = "contain";

  elementoImagen.onerror = function () {
    if (contenedorVistaPrevia.contains(elementoImagen)) {
      contenedorVistaPrevia.textContent =
        "No se encontró la imagen. Comprueba la ruta.";
    }
  };

  contenedorVistaPrevia.appendChild(elementoImagen);
}
