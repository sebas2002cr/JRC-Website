/**
 * Lo que el navegador recuerda de la persona, entre visitas.
 *
 * Son marcas de "esto ya se lo mostramos": no viajan al servidor, no se
 * comparten con nadie y no sirven para identificar a nadie. Por eso van en
 * localStorage y no en una cookie, y por eso no disparan el deber de avisar
 * sobre cookies.
 *
 * Las claves viven todas acá y no sueltas en cada componente porque varias
 * se escriben en un archivo y se leen en otro —la burbuja del newsletter la
 * escribe el botón flotante y la marca de suscrito la pone el formulario— y
 * basta una letra distinta entre los dos para que la burbuja le siga
 * apareciendo a alguien que ya se suscribió. Es la clase de error que no se
 * ve en desarrollo y que solo aparece cuando lo comenta un cliente.
 */
export const MEMORIA = {
  /**
   * Cerró la burbuja que invita al newsletter.
   *
   * Esta es la única que NO se recuerda entre visitas: se guarda con
   * recordarEnLaVisita, así que se borra al cerrar la pestaña y mañana la
   * burbuja vuelve a salir. Es a propósito. Quien hoy no se anotó puede
   * anotarse la semana que viene, y el aviso es lo bastante discreto como
   * para poder insistir; una marca permanente lo apagaba para siempre por
   * un clic distraído.
   */
  burbujaCerrada: "jrc-newsletter-burbuja-cerrada",
  /** Dejó su correo en el formulario del newsletter. */
  suscrito: "jrc-newsletter-suscrito",
  /**
   * Ya entró al blog: el punto del navbar deja de aparecer.
   *
   * Va con el mismo criterio que la burbuja —recordarEnLaVisita— y por lo
   * mismo: el blog publica cada semana, así que en la visita siguiente hay
   * algo nuevo de verdad y el punto se lo vuelve a señalar. Dentro de una
   * misma visita sí se apaga: ya lo vio.
   */
  blogVisto: "jrc-blog-visto"
};

/**
 * ¿Está puesta esta marca?
 *
 * El try no es decoración. localStorage lanza una excepción —no devuelve
 * null— cuando el navegador tiene el almacenamiento bloqueado: modo privado
 * en Safari viejo, o la configuración que apaga todo el almacenamiento de
 * sitios. Sin el try, esa excepción sube por el render y se lleva puesta la
 * página entera por culpa de una burbuja decorativa.
 */
export function recordado(clave) {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(clave) !== null;
  } catch {
    return false;
  }
}

/**
 * Pone la marca. Si el navegador no deja, no pasa nada.
 *
 * El peor caso es que el aviso vuelva a aparecer en la próxima visita, que
 * es infinitamente preferible a que reventar acá corte el envío del
 * formulario que se acaba de completar.
 */
export function recordar(clave) {
  try {
    window.localStorage.setItem(clave, "1");
  } catch {
    /* Sin almacenamiento, se vuelve a preguntar la próxima vez. */
  }
}

/**
 * Las dos de arriba, pero olvidando al cerrar la pestaña.
 *
 * sessionStorage tiene exactamente la misma forma que localStorage; lo
 * único que cambia es cuánto dura. Sirve para lo que hay que respetar
 * mientras la persona está acá y volver a ofrecer la próxima vez que
 * vuelva.
 *
 * Y hace falta que dure toda la visita, no solo la página: la navegación
 * del sitio recarga entero (los enlaces son <a> y no <Link>, ver el
 * comentario de components/navbar.js), así que sin esto la burbuja
 * reaparecería a los tres segundos en cada clic del menú.
 */
export function recordadoEnLaVisita(clave) {
  try {
    return (
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(clave) !== null
    );
  } catch {
    return false;
  }
}

export function recordarEnLaVisita(clave) {
  try {
    window.sessionStorage.setItem(clave, "1");
  } catch {
    /* Igual que arriba: sin almacenamiento, se vuelve a ofrecer. */
  }
}
