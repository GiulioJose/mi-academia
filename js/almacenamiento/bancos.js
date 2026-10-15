
const CLAVE_FAVORITAS = "academiaFavoritas";
const CLAVE_FALLADAS = "academiaFalladas";
const CLAVE_REVISION = "academiaRevision";

// Leer un banco del navegador
function leerBanco(clave) {
  try {
    const datos = JSON.parse(
      localStorage.getItem(clave) || "[]"
    );

    return Array.isArray(datos) ? datos : [];

  } catch (error) {
    console.error("Error al leer banco:", clave, error);
    return [];
  }
}

// Guardar un banco
function guardarBanco(clave, ids) {
  localStorage.setItem(clave, JSON.stringify(ids));
}

// Consultar favoritas
export function obtenerFavoritas() {
  return leerBanco(CLAVE_FAVORITAS);
}

// Consultar falladas
export function obtenerFalladas() {
  return leerBanco(CLAVE_FALLADAS);
}

// Consultar pendientes de revisión
export function obtenerRevision() {
  return leerBanco(CLAVE_REVISION);
}

// Comprobar si una pregunta es favorita
export function esFavorita(id) {
  return obtenerFavoritas().includes(id);
}

// Añadir o quitar una favorita
export function alternarFavorita(id) {
  const favoritas = obtenerFavoritas();

  const actualizadas = favoritas.includes(id)
    ? favoritas.filter(function(item) {
        return item !== id;
      })
    : [...favoritas, id];

  guardarBanco(CLAVE_FAVORITAS, actualizadas);

  return actualizadas.includes(id);
}

// Comprobar si una pregunta está pendiente de revisión
export function estaEnRevision(id) {
  return obtenerRevision().includes(id);
}

// Añadir o quitar una pregunta pendiente de revisión
export function alternarRevision(id) {
  const revision = obtenerRevision();

  const actualizadas = revision.includes(id)
    ? revision.filter(function(item) {
        return item !== id;
      })
    : [...revision, id];

  guardarBanco(CLAVE_REVISION, actualizadas);

  return actualizadas.includes(id);
}

// Registrar una respuesta incorrecta
export function registrarFallo(id) {
  const falladas = obtenerFalladas();

  if (!falladas.includes(id)) {
    falladas.push(id);
    guardarBanco(CLAVE_FALLADAS, falladas);
  }
}

// Eliminar una pregunta fallada cuando se acierta
export function resolverFallo(id) {
  const actualizadas = obtenerFalladas().filter(
    function(item) {
      return item !== id;
    }
  );

  guardarBanco(CLAVE_FALLADAS, actualizadas);
}
