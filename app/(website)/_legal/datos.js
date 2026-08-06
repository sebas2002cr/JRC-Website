/**
 * Los datos de la empresa y los plazos que aparecen en /privacidad y
 * /terminos.
 *
 * Viven en un solo archivo porque los dos documentos los repiten. Con el
 * texto escrito a mano en cada uno, cambiar el domicilio o el correo obliga a
 * acordarse de tocar los dos, y el día que se olvide uno el sitio queda
 * diciendo dos cosas distintas sobre quién responde por los datos de la
 * gente. En un documento legal eso no es un descuido de redacción.
 *
 * Los valores los aportó el área legal el 5 de agosto de 2026.
 */
/**
 * Si las páginas legales están publicadas.
 *
 * Vive acá y no en cada archivo que la necesita porque la leen tres: el
 * armazón de los documentos (que devuelve 404 si está apagada), el sitemap y
 * el pie de página. Con la condición escrita tres veces, el día que una se
 * quede atrás el pie enlaza a una página que devuelve 404, que es peor que
 * no tener el enlace.
 *
 * Se incrusta al COMPILAR, así que cambiarla exige volver a desplegar.
 */
export const LEGALES_PUBLICADAS = process.env.NEXT_PUBLIC_LEGALES === "true";

/** Las dos páginas legales, para el pie y para el sitemap. */
export const PAGINAS_LEGALES = [
  { href: "/privacidad", titulo: "Política de Privacidad", corto: "Privacidad" },
  { href: "/terminos", titulo: "Términos y Condiciones", corto: "Términos" },
];

/**
 * La fecha que aparece en el encabezado de los dos documentos.
 *
 * No es un adorno. Si mañana se discute qué decía la política cuando alguien
 * se suscribió o contrató, la fecha es el dato que lo resuelve: sin ella, un
 * documento que cambió en el camino no prueba gran cosa. Por eso se escribe a
 * mano y NO se calcula con new Date(): tiene que decir cuándo se modificó el
 * texto por última vez, no qué día lo está leyendo la persona.
 *
 * Se cambia acá, en un solo lugar, cada vez que se toque algo de fondo de
 * cualquiera de los dos documentos.
 */
export const ACTUALIZADO = "6 de agosto de 2026";

export const EMPRESA = {
  // OJO: la razón social y el nombre comercial NO son lo mismo. La sociedad
  // inscrita es Grupo Consultor JSRC; JRC Consulting Group es el nombre con
  // el que opera y con el que la conoce la gente. Los documentos legales
  // tienen que decir las dos y aclarar la relación: quien contrata firma con
  // una sociedad cuyo nombre nunca vio en el sitio, y si eso no está escrito
  // parece otra empresa.
  razonSocial: "Grupo Consultor JSRC",
  nombreComercial: "JRC Consulting Group",
  cedula: "3-101-815282",
  domicilio:
    "San José, Escazú, San Rafael, 575 metros al oeste de Escazú Village, Edificio Monterrico, piso 2",
  correo: "info@jrc.cr",
  telefono: "6055-6705",
  // Con el prefijo de país y sin separadores, que es como lo pide un enlace
  // de teléfono para que marque desde el celular.
  telefonoEnlace: "+50660556705",
};

/**
 * Los plazos de conservación y de respuesta.
 *
 * Cada uno lleva de dónde sale, porque son las cifras que hay que poder
 * defender si alguien las cuestiona.
 */
export const PLAZOS = {
  // Decisión comercial, no legal. La ley no fija un número para este caso: el
  // artículo 6 de la Ley 8968 obliga a eliminar el dato cuando deja de ser
  // necesario para el fin con que se recolectó. Lo habitual en el mercado son
  // doce meses; el área legal recomendó seis por el principio de
  // minimización, y porque un año de guardar datos de alguien que nunca
  // contrató es difícil de justificar ante esa misma persona.
  consultasSinContratar: "seis meses",

  // El plazo de prescripción tributaria en Costa Rica es de cuatro años. Se
  // conservan cinco por margen: si el cómputo del plazo se discute, el año de
  // más evita quedarse sin el respaldo justo cuando hace falta.
  clientes: "cinco años",

  // Reglamento a la Ley 8968, Decreto Ejecutivo N.° 37554-JP.
  respuestaDerechos: "cinco días hábiles",
};

/**
 * La política de devoluciones.
 *
 * El porcentaje no es arbitrario: lo retenido cubre costos administrativos,
 * operativos y de gestión que ya se incurrieron aunque el servicio no haya
 * arrancado.
 */
export const DEVOLUCIONES = {
  plazoDias: 3,
  porcentajeSinIniciar: 75,
};
