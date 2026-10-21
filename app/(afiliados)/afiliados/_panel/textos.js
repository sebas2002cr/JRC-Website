/**
 * Los textos del panel, en español (voseo) y en inglés.
 *
 * Omar lo marcó como muy importante (20 oct 2026): textos, fechas y montos en
 * el idioma que elige el afiliado. Cada texto vive al lado de su traducción;
 * las funciones arman lo que lleva datos. Los estados son los cuatro fijos del
 * plan más «No se dio».
 */

const MESES = {
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const MESES_CORTOS = {
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const DIAS = {
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/** «Octubre» de «2026-10». */
export function nombreMes(mes, l) {
  const n = Number(String(mes || "").slice(5, 7));
  return MESES[l][n - 1] || "";
}

/** «Noviembre» del mes siguiente a «2026-10». */
export function mesSiguiente(mes, l) {
  const n = Number(String(mes || "").slice(5, 7));
  return MESES[l][n % 12] || "";
}

/** «3 Oct» / «Oct 3», de «2026-10-03» o de un instante. */
export function diaCorto(fecha, l) {
  const d = diaDe(fecha);
  if (!d) return "";
  const m = MESES_CORTOS[l][Number(d.slice(5, 7)) - 1];
  return l === "en" ? `${m} ${Number(d.slice(8, 10))}` : `${Number(d.slice(8, 10))} ${m}`;
}

/** «jueves 15 Oct» / «Thursday, Oct 15». */
export function diaConNombre(fecha, l) {
  const d = diaDe(fecha);
  if (!d) return "";
  const dia = DIAS[l][new Date(`${d}T12:00:00`).getDay()];
  return l === "en" ? `${dia}, ${diaCorto(d, l)}` : `${dia} ${diaCorto(d, l)}`;
}

/** El día en Costa Rica de una fecha o un instante: «2026-10-03». */
export function diaDe(fecha) {
  const f = String(fecha || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return f;
  if (!f || Number.isNaN(Date.parse(f))) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Costa_Rica", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(f));
}

/** «Hoy, 9:41 a. m.» / «Today, 9:41 AM», o el día. Para «Últimos ingresos». */
export function cuandoIngreso(instante, l) {
  const d = diaDe(instante);
  if (!d) return "";
  const hoy = diaDe(new Date().toISOString());
  if (d !== hoy) return diaCorto(d, l);
  const hora = new Intl.DateTimeFormat(l === "en" ? "en-US" : "es-CR", { timeZone: "America/Costa_Rica", hour: "numeric", minute: "2-digit" }).format(new Date(instante));
  return `${l === "en" ? "Today" : "Hoy"}, ${hora}`;
}

/** Un monto en su moneda: en español «$1 234,56», en inglés «$1,234.56». */
export function monto(n, moneda, l) {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  const [e, d] = Math.abs(v).toFixed(2).split(".");
  const miles = l === "en" ? "," : " ";
  const decimal = l === "en" ? "." : ",";
  return `${v < 0 ? "-" : ""}${moneda === "CRC" ? "₡" : "$"}${e.replace(/\B(?=(\d{3})+(?!\d))/g, miles)}${decimal}${d}`;
}

/**
 * La cuenta como la describe el ERP («Cuenta BAC · dólares · ••••4821»), en el
 * idioma del panel. El ERP la escribe en español; acá solo se traducen sus
 * piezas fijas, el número recortado queda igual.
 */
export function cuentaEn(descripcion, l) {
  if (l !== "en" || !descripcion) return descripcion || "";
  return String(descripcion).replace(/^Cuenta BAC/, "BAC account").replace(/dólares/i, "US dollars");
}

/** «5 %» / «5%». */
export const pct = (n, l) => (l === "en" ? `${String(n)}%` : `${String(n).replace(".", ",")} %`);

/** Iniciales para el cuadrito de cada recomendado y del perfil. */
export function iniciales(nombre) {
  return String(nombre || "")
    .replace(/S\.A\.|S\.R\.L\.|&/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}

export const T = {
  es: {
    irAlSitio: "Ir al sitio de JRC",
    programa: "Programa de afiliados",
    panelNombre: "Panel de afiliados",
    idioma: "Idioma",
    recomendaYGana: "Recomendá y ganá",
    desdeCadaMes: "Desde 5 % · cada mes",
    entraTitulo: "Entrá a tu panel",
    entraTexto: "Escribí el correo con el que te registramos. Te mandamos un código para entrar.",
    correo: "Correo",
    enviarCodigo: "Enviarme el código",
    enviandoCodigo: "Enviando el código",
    noSosAfiliado: "¿Todavía no sos afiliado?",
    conoce: "Conocé el programa",
    otroCorreo: "Usar otro correo",
    revisaCorreo: "Revisá tu correo",
    mandamosA: (c) => ["Te mandamos un código de 6 dígitos a ", c, ". Vence en 10 minutos."],
    codigoDe6: "Código de 6 dígitos",
    codigo: "Código",
    noLlego: "¿No te llegó? Revisá el correo no deseado.",
    reenviarEn: (s) => `Reenviar en 0:${String(s).padStart(2, "0")}`,
    reenviar: "Reenviar el código",
    reenviado: "Te mandamos otro código.",
    codigoMal: "El código no es correcto o ya venció. Revisalo o pedí uno nuevo.",
    correoMal: "Revisá el correo.",
    hola: (n) => `Hola, ${n}`,
    hastaPronto: (n) => `Hasta pronto${n ? `, ${n}` : ""}`,
    privacidad: "Privacidad",
    terminos: "Términos",
    condiciones: "Condiciones del programa",
    salir: "Salir",
    salirDelPanel: "Salir del panel",
    tuPerfil: "Tu perfil",
    llevasEn: (m) => `Llevás en ${m}`,
    copiar: "Copiar enlace",
    copiado: "Copiado",
    recomendar: "Recomendar",
    proximoPago: "Próximo pago",
    primerosDias: (m) => `Primeros días de ${m}`,
    elUltimoDia: (m) => `El último día de ${m}`,
    seDeposita: "Se deposita en",
    sinCuenta: "Falta tu cuenta",
    recibidoEn: (a) => `Recibido en ${a}`,
    comoGanas: "Cómo ganás",
    mensualidades: "Mensualidades",
    serviciosHasta: (m) => `Servicios hasta ${m}`,
    serviciosDeMas: "Servicios de más",
    duracion: (d) => (d.tipo === "meses" ? `Durante sus primeros ${d.meses} meses como cliente` : "Mientras siga siendo cliente"),
    bienvenida: (n) => `Ya sos parte del programa, ${n}`,
    bienvenidaTexto: "Cada empresa que recomendés queda a tu nombre. Cuando se vuelva cliente y pague, tu comisión aparece en la tarjeta.",
    paso1: "Copiá tu enlace y compartilo",
    paso1d: "Por WhatsApp o correo, con quien necesite contabilidad, impuestos o temas legales.",
    paso2: "O recomendá una empresa directo",
    paso2d: "Nos dejás el contacto y la llamamos nosotros.",
    paso3: "Seguí cada avance aquí",
    paso3d: "Y te avisamos por correo cuando se vuelva cliente.",
    tabs: { mes: "Este mes", rec: "Recomendados", pag: "Pagos" },
    estados: { recomendado: "Recomendado", enConversacion: "En conversación", yaEsCliente: "Ya es cliente", teGeneroComision: "Te generó comisión", noSeDio: "No se dio" },
    noSeDieron: (n) => `No se dieron · ${n}`,
    notas: {
      porTuEnlace: "Llegó por tu enlace",
      porContactar: "Pronto le escribimos",
      reunion: (d) => `Tiene reunión el ${d}`,
      conversando: "Ya estamos conversando",
      faltaPago: "Firmó, falta su primer pago",
      clienteDesde: (m) => `Cliente desde ${m}`,
      yaEraCliente: "Ya era cliente de JRC",
      revisando: "Lo estamos revisando",
      yaEnContacto: "Ya estaba en contacto con JRC",
      noSiguio: "Decidió no seguir por ahora",
    },
    listaVacia: "No hay recomendados en este estado.",
    cargarMas: "Cargar más",
    servicio: { mensualidad: "Mensualidad", adicional: "Servicio adicional" },
    alCambio: (m) => `${m} al cambio`,
    reversa: "Reversado",
    totalDe: (m) => `Total de ${m}`,
    mesSinComisiones: (m) => `Todavía no hay comisiones en ${m}. Aparecen cuando un recomendado paga.`,
    faltaTipo: "Una comisión espera el tipo de cambio del día y se suma en unos minutos.",
    sePagaEn: (m) => `Se paga los primeros días de ${m}`,
    sePagaUltimo: (m) => `Se paga el último día de ${m}`,
    preparando: "Lo estamos preparando para pagarte",
    enProceso: "En proceso de pago",
    transferido: (d, c) => `Transferido el ${d}${c ? ` a ${c}` : ""}`,
    reversado: "Se reversó: se descuenta del próximo pago",
    ajuste: "Ajuste",
    sinPagos: "Todavía no hay pagos. El primero llega el mes después de tu primera comisión.",
    recomendarTitulo: "Recomendar una empresa",
    recomendarTexto: "La contactamos nosotros y te avisamos cuando se vuelva cliente. Desde ahí ganás tu comisión cada vez que pague.",
    empresa: "Empresa",
    empresaPista: "Nombre de la empresa",
    persona: "Persona de contacto",
    personaPista: "Con quién hablamos",
    contacto: "Teléfono o correo",
    contactoPista: "Para contactarla",
    necesita: "Qué necesita",
    necesitaPista: "Contabilidad, impuestos, temas legales…",
    sabe: "La empresa sabe que la recomendé y que JRC la va a contactar.",
    enviarRec: "Enviar recomendación",
    errEmpresa: "Escribí el nombre de la empresa.",
    errContacto: "Dejanos un teléfono de 8 dígitos o un correo para contactarla.",
    errSabe: "Confirmá que la empresa sabe que la vamos a contactar.",
    recibimos: "Recibimos tu recomendación",
    recibimosTexto: "Ya aparece en tus recomendados. Te avisamos por correo cuando se vuelva cliente.",
    otra: "Recomendar otra",
    listo: "Listo",
    cerrar: "Cerrar",
    categoria: "Categoría",
    telefono: "Teléfono",
    sinTelefono: "Sin anotar",
    cambiar: "Cambiar",
    guardar: "Guardar",
    cancelar: "Cancelar",
    guardado: "Guardado",
    afiliadoDesde: "En el programa desde",
    dondePagamos: "Dónde te pagamos",
    enMoneda: { USD: "En dólares", CRC: "En colones" },
    sinCuentaTexto: "Todavía no tenemos tu cuenta. Escribinos y la anotamos.",
    pedirCambio: "Solicitar cambio de cuenta",
    pedirCuenta: "Enviar mi cuenta por WhatsApp",
    enRevision: (c) => `Tenemos una cuenta nueva tuya en revisión. Hasta verificarla seguimos pagando a ${c}.`,
    mensajeCambio: (n) => `Hola, soy ${n}, del programa de afiliados de JRC. Quiero cambiar la cuenta donde me pagan las comisiones.`,
    mensajeCuenta: (n) => `Hola, soy ${n}, del programa de afiliados de JRC. Les paso la cuenta donde me pagan las comisiones.`,
    ultimosIngresos: "Últimos ingresos",
    estaSesion: "Esta sesión",
    sinConexion: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.",
    tarda: "El servidor está tardando demasiado. Probá de nuevo en un momento.",
    reintentar: "Probar de nuevo",
    cargando: "Cargando tu panel",
    sesionVencida: "Tu sesión venció. Entrá de nuevo con un código.",
    muchosIntentos: "Pediste varios códigos seguidos. Esperá un rato y probá de nuevo.",
  },
  en: {
    irAlSitio: "Go to the JRC site",
    programa: "Affiliate program",
    panelNombre: "Affiliate panel",
    idioma: "Language",
    recomendaYGana: "Refer and earn",
    desdeCadaMes: "From 5% · every month",
    entraTitulo: "Sign in to your panel",
    entraTexto: "Enter the email we registered you with. We'll send you a code to sign in.",
    correo: "Email",
    enviarCodigo: "Send me the code",
    enviandoCodigo: "Sending the code",
    noSosAfiliado: "Not an affiliate yet?",
    conoce: "Learn about the program",
    otroCorreo: "Use another email",
    revisaCorreo: "Check your email",
    mandamosA: (c) => ["We sent a 6-digit code to ", c, ". It expires in 10 minutes."],
    codigoDe6: "6-digit code",
    codigo: "Code",
    noLlego: "Didn't get it? Check your spam folder.",
    reenviarEn: (s) => `Resend in 0:${String(s).padStart(2, "0")}`,
    reenviar: "Resend the code",
    reenviado: "We sent you another code.",
    codigoMal: "The code is wrong or expired. Check it or ask for a new one.",
    correoMal: "Check the email.",
    hola: (n) => `Hi, ${n}`,
    hastaPronto: (n) => `See you soon${n ? `, ${n}` : ""}`,
    privacidad: "Privacy",
    terminos: "Terms",
    condiciones: "Program terms",
    salir: "Sign out",
    salirDelPanel: "Sign out of the panel",
    tuPerfil: "Your profile",
    llevasEn: (m) => `So far in ${m}`,
    copiar: "Copy link",
    copiado: "Copied",
    recomendar: "Refer",
    proximoPago: "Next payment",
    primerosDias: (m) => `Early ${m}`,
    elUltimoDia: (m) => `The last day of ${m}`,
    seDeposita: "Paid into",
    sinCuenta: "Account missing",
    recibidoEn: (a) => `Received in ${a}`,
    comoGanas: "How you earn",
    mensualidades: "Monthly fees",
    serviciosHasta: (m) => `Services up to ${m}`,
    serviciosDeMas: "Larger services",
    duracion: (d) => (d.tipo === "meses" ? `For their first ${d.meses} months as a client` : "For as long as they stay a client"),
    bienvenida: (n) => `You're now part of the program, ${n}`,
    bienvenidaTexto: "Every company you refer is credited to you. When they become a client and pay, your commission shows up on the card.",
    paso1: "Copy your link and share it",
    paso1d: "By WhatsApp or email, with anyone who needs accounting, tax or legal help.",
    paso2: "Or refer a company directly",
    paso2d: "Leave us the contact and we'll reach out.",
    paso3: "Follow every step here",
    paso3d: "And we'll email you when they become a client.",
    tabs: { mes: "This month", rec: "Referrals", pag: "Payments" },
    estados: { recomendado: "Referred", enConversacion: "In talks", yaEsCliente: "Now a client", teGeneroComision: "Earned you commission", noSeDio: "Didn't work out" },
    noSeDieron: (n) => `Didn't work out · ${n}`,
    notas: {
      porTuEnlace: "Came through your link",
      porContactar: "We'll reach out soon",
      reunion: (d) => `Meeting on ${d}`,
      conversando: "We're already talking",
      faltaPago: "Signed, first payment pending",
      clienteDesde: (m) => `Client since ${m}`,
      yaEraCliente: "Was already a JRC client",
      revisando: "We're reviewing it",
      yaEnContacto: "Was already in touch with JRC",
      noSiguio: "Decided not to go ahead for now",
    },
    listaVacia: "No referrals in this status.",
    cargarMas: "Load more",
    servicio: { mensualidad: "Monthly fee", adicional: "Additional service" },
    alCambio: (m) => `${m} at the exchange rate`,
    reversa: "Reversed",
    totalDe: (m) => `${m} total`,
    mesSinComisiones: (m) => `No commissions in ${m} yet. They show up when a referral pays.`,
    faltaTipo: "One commission is waiting for the day's exchange rate and will be added in a few minutes.",
    sePagaEn: (m) => `Paid in early ${m}`,
    sePagaUltimo: (m) => `Paid on the last day of ${m}`,
    preparando: "We're getting it ready to pay you",
    enProceso: "Payment in process",
    transferido: (d, c) => `Transferred on ${d}${c ? ` to ${c}` : ""}`,
    reversado: "Reversed: it's deducted from the next payment",
    ajuste: "Adjustment",
    sinPagos: "No payments yet. The first one arrives the month after your first commission.",
    recomendarTitulo: "Refer a company",
    recomendarTexto: "We'll reach out to them and let you know when they become a client. From then on you earn your commission every time they pay.",
    empresa: "Company",
    empresaPista: "Company name",
    persona: "Contact person",
    personaPista: "Who we should talk to",
    contacto: "Phone or email",
    contactoPista: "To reach them",
    necesita: "What they need",
    necesitaPista: "Accounting, taxes, legal matters…",
    sabe: "The company knows I referred them and that JRC will contact them.",
    enviarRec: "Send referral",
    errEmpresa: "Enter the company name.",
    errContacto: "Leave us an 8-digit phone number or an email to reach them.",
    errSabe: "Confirm the company knows we'll contact them.",
    recibimos: "We got your referral",
    recibimosTexto: "It's already in your referrals. We'll email you when they become a client.",
    otra: "Refer another",
    listo: "Done",
    cerrar: "Close",
    categoria: "Category",
    telefono: "Phone",
    sinTelefono: "Not set",
    cambiar: "Change",
    guardar: "Save",
    cancelar: "Cancel",
    guardado: "Saved",
    afiliadoDesde: "In the program since",
    dondePagamos: "Where we pay you",
    enMoneda: { USD: "In US dollars", CRC: "In colones" },
    sinCuentaTexto: "We don't have your account yet. Message us and we'll add it.",
    pedirCambio: "Request an account change",
    pedirCuenta: "Send my account by WhatsApp",
    enRevision: (c) => `We have a new account of yours under review. Until it's verified we keep paying to ${c}.`,
    mensajeCambio: (n) => `Hi, I'm ${n}, from the JRC affiliate program. I'd like to change the account where you pay my commissions.`,
    mensajeCuenta: (n) => `Hi, I'm ${n}, from the JRC affiliate program. Here is the account where you can pay my commissions.`,
    ultimosIngresos: "Recent sign-ins",
    estaSesion: "This session",
    sinConexion: "We couldn't connect. Check your connection and try again.",
    tarda: "The server is taking too long. Try again in a moment.",
    reintentar: "Try again",
    cargando: "Loading your panel",
    sesionVencida: "Your session expired. Sign in again with a code.",
    muchosIntentos: "You asked for several codes in a row. Wait a while and try again.",
  },
};
