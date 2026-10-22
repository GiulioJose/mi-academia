
import { cargarMaterias } from "./datos/catalogo.js";
import { configurarExportacion } from "./contenido/exportar.js";
import { configurarMaterias } from "./contenido/materias.js";
import { configurarModulos } from "./contenido/modulos.js";
import { configurarTemas } from "./contenido/temas.js";
import { configurarEjemplo } from "./contenido/ejemplo.js";

// Catálogo centralizado
let materias = [];

// Elementos necesarios para coordinar la página
const selectorMateria = document.querySelector("#contenido-materia");
const mensaje = document.querySelector("#mensaje-contenido");
const botonExportarCatalogo = document.querySelector("#exportar-catalogo");

// ==========================================
// CARGA INICIAL
// ==========================================

async function iniciarContenido() {
  try {
    materias = await cargarMaterias();

    materias.forEach(function (materia) {
      const opcion = document.createElement("option");
      opcion.value = materia.id;
      opcion.textContent = materia.nombre;
      selectorMateria.appendChild(opcion);
    });

    botonExportarCatalogo.disabled = false;

  } catch (error) {
    console.error(error);
    mensaje.textContent = "No se pudo cargar materias.json.";
  }
}

// ==========================================
// CONFIGURACIÓN DE MATERIAS
// ==========================================

configurarMaterias(
  function () {
    return materias;
  },
  function (nuevasMaterias) {
    materias = nuevasMaterias;
  },
  mensaje
);

// ==========================================
// CONFIGURACIÓN DE MÓDULOS
// ==========================================

configurarModulos(
  function () {
    return materias;
  },
  mensaje
);

// ==========================================
// CONFIGURACIÓN DE TEMAS
// ==========================================

configurarTemas(
  function () {
    return materias;
  },
  mensaje
);

// ==========================================
// CONFIGURACIÓN DEL EJEMPLO JSON
// ==========================================

configurarEjemplo(
  function () {
    return materias;
  }
);

// ==========================================
// CONFIGURACIÓN DE EXPORTACIÓN
// ==========================================

configurarExportacion(
  function () {
    return materias;
  },
  mensaje
);

// ==========================================
// INICIAR LA PÁGINA
// ==========================================

iniciarContenido();
