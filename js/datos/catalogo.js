
const cachePreguntas = new Map();

export async function cargarMaterias() {
  const respuesta = await fetch("./materias.json");

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar materias.json");
  }

  return await respuesta.json();
}

export async function contarPreguntas(tema) {
  if (!tema.archivo) return 0;

  if (cachePreguntas.has(tema.archivo)) {
    return cachePreguntas.get(tema.archivo);
  }

  try {
    const respuesta = await fetch("./" + tema.archivo);

    if (!respuesta.ok) {
      throw new Error("Archivo no disponible: " + tema.archivo);
    }

    const preguntas = await respuesta.json();

    if (!Array.isArray(preguntas)) {
      throw new Error("Formato incorrecto: " + tema.archivo);
    }

    cachePreguntas.set(tema.archivo, preguntas.length);

    return preguntas.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
