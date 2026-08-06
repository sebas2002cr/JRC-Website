"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/utils/all";
import { pedirAlBoletin, VERDE } from "@/lib/boletin";

/**
 * Suscripción al boletín semanal.
 *
 * El alta es de doble opt-in: acá solo se deja el correo, y la suscripción
 * queda pendiente hasta que la persona abre el enlace que le llega. Además
 * de ser la buena práctica de correo, es la prueba del consentimiento que
 * exige la Ley 8968.
 *
 * El recorrido está inspirado en un sitio que usaron de referencia: botón
 * flotante, panel que se abre encima, y el resultado dentro del mismo panel.
 * La estética es la de JRC, no la de la referencia.
 */

/**
 * Interruptor del boletín. APAGADO salvo que se pida explícitamente.
 *
 * Va apagado por defecto —y no encendido con una variable para apagarlo—
 * porque el olvido tiene que fallar del lado seguro: si nadie define nada,
 * no se muestra. Para trabajarlo en local basta poner
 * NEXT_PUBLIC_NEWSLETTER=true en .env.local.
 *
 * OJO: las NEXT_PUBLIC_* se incrustan al COMPILAR. Cambiar el valor exige
 * volver a desplegar; reiniciar el servidor no alcanza.
 */
const HABILITADO = process.env.NEXT_PUBLIC_NEWSLETTER === "true";

// Las cuatro áreas de la firma. El boletín NO es solo tributario: decirlo
// así encerraba a JRC en una sola materia cuando el trabajo abarca cuatro.
const AREAS = "tributario, fiscal, legal y financiero";

/**
 * Las clases de los campos de texto, en un solo lugar.
 *
 * El correo y el nombre las comparten para que sean idénticos: mismo ancho,
 * mismo alto, misma letra. Escritas por separado en cada campo, alcanzaba
 * con retocar uno para que la columna quedara despareja, que es exactamente
 * lo que había pasado.
 *
 * `text-base` (16px) no es una decisión estética: Safari en iPhone hace zoom
 * sobre cualquier campo con letra más chica apenas lo tocás, y deja la
 * página agrandada y corrida.
 */
const CLASES_CAMPO =
  "w-full rounded-full border border-gray-200 px-5 py-3 text-base text-gray-800 outline-none transition-colors focus:border-[#305832] dark:border-gray-700 dark:bg-gray-800 dark:text-white";

// Ocupación, opcional. Sirve para saber a quién le estamos escribiendo y,
// más adelante, poder ajustar el contenido a cada perfil.
const OCUPACIONES = [
  "Profesional independiente",
  "Empresario",
  "Asalariado",
  "Estudiante",
];

export default function Newsletter() {
  // El corte va acá, antes de cualquier hook: apagado no se monta nada, ni
  // se registra el listener de Escape ni se toca el scroll de la página.
  if (!HABILITADO) return null;
  return <PanelBoletin />;
}

function PanelBoletin() {
  const [abierto, setAbierto] = useState(false);
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [estado, setEstado] = useState("inicial"); // inicial | enviando | listo
  // enviado | yaSuscrito | confirmacionPendiente
  const [resultado, setResultado] = useState("enviado");
  const [error, setError] = useState("");
  const panel = useRef(null);

  // El campo trampa. Va en el estado y no suelto en el formulario para poder
  // leerlo al enviar sin tener que ir a buscarlo al DOM.
  const [sitioWeb, setSitioWeb] = useState("");

  // Cuándo se abrió el panel. Sirve para descartar los envíos instantáneos,
  // que no los hace una persona. Se guarda el momento y se manda el tiempo
  // TRANSCURRIDO, no la hora: así no importa si el reloj de esa computadora
  // está desfasado, que es algo bastante común.
  const abiertoDesde = useRef(0);

  // Escape cierra, y con el panel abierto se bloquea el scroll de atrás.
  useEffect(() => {
    if (!abierto) return;

    const alTeclado = evento => {
      if (evento.key === "Escape") setAbierto(false);
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alTeclado);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", alTeclado);
    };
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    // El resultado se conserva a propósito: si alguien cierra y vuelve a
    // abrir, sigue viendo que ya se suscribió en vez de un formulario en
    // blanco que lo invite a repetir.
  };

  const enviar = async evento => {
    evento.preventDefault();
    setError("");

    // Validación mínima del lado del cliente. La de verdad va en el
    // servidor: esta solo evita el viaje cuando el error es evidente.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) {
      setError("Revisá el correo, parece que le falta algo.");
      return;
    }
    if (!acepta) {
      setError("Necesitamos que aceptes la política para poder escribirte.");
      return;
    }

    setEstado("enviando");

    const { ok, datos } = await pedirAlBoletin("/boletin/suscribir", {
      correo: correo.trim(),
      nombre,
      ocupacion,
      acepta,
      sitioWeb,
      msEnPantalla: Date.now() - abiertoDesde.current
    });

    if (!ok) {
      setEstado("inicial");
      setError(datos.error || "No pudimos completar la suscripción. Probá de nuevo.");
      return;
    }

    // El backend dice en qué situación estaba esa dirección: nueva, ya
    // suscrita, o con una confirmación sin abrir. Son tres mensajes
    // distintos porque son tres cosas distintas, y en una de ellas la
    // persona todavía tiene algo que hacer.
    setResultado(datos.codigo || "enviado");
    setEstado("listo");
  };

  return (
    <>
      {/* Botón flotante, abajo a la IZQUIERDA.
          La esquina derecha ya la ocupa el selector de idioma de globalseo
          (fixed bottom-2 right-4 en app/layout.tsx), y los dos juntos se
          encimaban. La izquierda queda libre: el botón de "volver al blog"
          que vive ahí solo aparece dentro de una nota, y este solo en el
          listado, así que nunca coinciden. */}
      <button
        onClick={() => {
          abiertoDesde.current = Date.now();
          setAbierto(true);
        }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: VERDE }}
        aria-label="Suscribirme al newsletter">
        <IconoSobre className="h-5 w-5" />
        <span className="hidden sm:inline">Newsletter</span>
      </button>

      {!abierto ? null : (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={evento => {
            if (evento.target === evento.currentTarget) cerrar();
          }}>
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-newsletter"
            /* La altura va en dvh y no en vh, y en el celular es la
               diferencia entre que el formulario se pueda enviar o no.
               `vh` mide la pantalla COMPLETA, incluida la franja que tapan
               la barra de direcciones y la de botones del navegador: un
               panel de 90vh se mete debajo de ellas y la casilla de la
               política y el botón quedan fuera de alcance, sin forma de
               llegar. `dvh` mide lo que de verdad se ve.

               Se pone en el style y no como clase para que sirva de
               respaldo: un navegador viejo que no entienda dvh descarta
               esta línea y se queda con el max-h-[90vh] de la clase. */
            style={{ maxHeight: "85dvh" }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            {/* Encabezado propio, como en la referencia */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <IconoSobre className="h-5 w-5" style={{ color: VERDE }} />
                <span
                  id="titulo-newsletter"
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: VERDE }}>
                  Newsletter de JRC
                </span>
              </div>
              {/* -m-2 p-2: agranda la zona que responde al toque sin
                  agrandar la equis ni mover el encabezado. Con p-1 el
                  objetivo medía unos 28px y cerrar el panel desde el celular
                  costaba dos o tres intentos. */}
              <button
                onClick={cerrar}
                aria-label="Cerrar"
                className="-m-2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              {estado === "listo" ? (
                <Resultado correo={correo} caso={resultado} />
              ) : (
                <>
                  <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                    Lo que cambió esta semana, en una sola lectura
                  </h2>
                  {/* El texto no encierra el boletín en lo tributario: las
                      cuatro áreas son las que trabaja la firma, y hablarle
                      solo a "tu empresa" dejaba afuera a los independientes,
                      que son buena parte de quienes consultan. */}
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Todos los lunes, un resumen de las novedades en materia{" "}
                    <strong className="font-semibold text-gray-800 dark:text-gray-200">
                      {AREAS}
                    </strong>{" "}
                    en Costa Rica, y qué significan para tu empresa o para vos
                    como independiente.
                  </p>

                  {/* ── Cómo está ordenado este formulario ──────────────
                      De arriba abajo: correo, nombre, ocupación, la casilla
                      de la política y recién al final el botón.

                      Antes el botón iba pegado al campo del correo, arriba
                      de todo lo demás. Se veía ágil, pero dejaba dos
                      problemas. Uno visual: el correo quedaba angosto para
                      hacerle lugar al botón y el nombre ocupaba todo el
                      ancho, así que dos campos hermanos tenían tamaños
                      distintos sin ningún motivo. Y otro de fondo: se podía
                      enviar el formulario sin haber llegado siquiera a ver
                      la casilla de la política, que estaba más abajo. El
                      consentimiento tiene que estar a la vista ANTES del
                      botón que lo da por otorgado.

                      Los dos campos comparten exactamente las mismas clases
                      (CLASES_CAMPO) para que no se puedan desalinear de
                      nuevo al tocar uno solo. */}
                  {/* Los dos campos llevan tope de caracteres. Son los
                      mismos que aplica el backend al guardar (120 el nombre)
                      y el máximo que puede medir una dirección de correo
                      según el estándar (254). Ponerlos también acá no es
                      duplicar la validación: sin tope, alguien que pega un
                      texto larguísimo no ve nada raro y el servidor lo
                      recorta en silencio, así que la persona termina
                      guardada con un nombre a medias sin enterarse. */}
                  <form onSubmit={enviar} noValidate>
                    <input
                      type="email"
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="tu@empresa.com"
                      aria-label="Tu correo electrónico"
                      maxLength={254}
                      autoComplete="email"
                      className={CLASES_CAMPO}
                    />

                    {/* Nombre y ocupación no bloquean la suscripción, pero
                        NO se rotulan como opcionales: decir "opcional" es una
                        invitación a saltárselos, y entonces casi nadie los
                        completa. Se presentan como parte natural del
                        formulario y quien no quiera, sigue de largo. */}
                    <input
                      type="text"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="Tu nombre completo"
                      aria-label="Tu nombre completo"
                      maxLength={120}
                      autoComplete="name"
                      className={cx("mt-3", CLASES_CAMPO)}
                    />

                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        ¿Cuál te describe mejor?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {OCUPACIONES.map(opcion => {
                          const activa = ocupacion === opcion;
                          return (
                            <button
                              key={opcion}
                              type="button"
                              // Se puede desmarcar: si alguien la tocó por
                              // error, tiene que poder dejarla en blanco.
                              onClick={() => setOcupacion(activa ? "" : opcion)}
                              aria-pressed={activa}
                              className={cx(
                                // Más alto en el celular: con py-1.5 el
                                // botón mide unos 32px y el dedo falla o
                                // toca el de al lado. Arriba de 640px vuelve
                                // a la altura original, que ahí se apunta
                                // con el mouse.
                                "rounded-full border px-4 py-2.5 text-sm transition-colors sm:py-1.5",
                                activa
                                  ? "border-transparent text-white"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                              )}
                              style={activa ? { backgroundColor: VERDE } : undefined}>
                              {opcion}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <CampoTrampa valor={sitioWeb} alCambiar={setSitioWeb} />

                    <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {/* Sin marcar por defecto: la Ley 8968 pide
                          consentimiento expreso, y una casilla ya marcada no
                          lo es. */}
                      <input
                        type="checkbox"
                        checked={acepta}
                        onChange={e => setAcepta(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#305832]"
                      />
                      <span>
                        Acepto la{" "}
                        <a href="/privacidad" className="font-medium underline" style={{ color: VERDE }}>
                          Política de Privacidad
                        </a>{" "}
                        y los{" "}
                        <a href="/terminos" className="font-medium underline" style={{ color: VERDE }}>
                          Términos y Condiciones
                        </a>
                        , y que JRC me escriba a este correo.
                      </span>
                    </label>

                    {/* El error va ARRIBA del botón, no debajo. Con el botón
                        al final del formulario, un mensaje debajo puede
                        quedar fuera de la parte visible del panel: la
                        persona apretaría de nuevo sin llegar a leer nunca
                        por qué no funcionó. */}
                    {error && (
                      <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    )}

                    {/* El botón cierra el formulario, después de la casilla.
                        Ocupa todo el ancho para que la columna cierre
                        pareja con los dos campos de arriba. */}
                    <button
                      type="submit"
                      disabled={estado === "enviando"}
                      className="mt-5 w-full rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                      style={{ backgroundColor: VERDE }}>
                      {estado === "enviando" ? "Enviando..." : "Suscribirme"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Lo que se ve después de dejar el correo.
 *
 * Tres desenlaces, no uno. El que más importa distinguir es el del medio:
 * quien ya se anotó y no abrió el correo no está suscrito todavía, y
 * decirle "ya estás suscrito" lo dejaría esperando un boletín que nunca le
 * va a llegar.
 */
function Resultado({ correo, caso }) {
  const yaEstaba = caso === "yaSuscrito";

  return (
    <div className="rounded-xl border-2 border-dashed p-6" style={{ borderColor: VERDE }}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: VERDE }}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <p className="text-lg font-bold text-gray-800 dark:text-white">
          {yaEstaba ? "Ya estás en la lista" : "Ya casi"}
        </p>
      </div>

      {caso === "yaSuscrito" && (
        <>
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            <strong className="break-words text-gray-800 dark:text-gray-200">{correo}</strong> ya está
            suscrito al boletín, así que no hay nada más que hacer.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            No te mandamos otro correo para no duplicarte nada. ¡Nos vemos el lunes!
          </p>
        </>
      )}

      {caso === "confirmacionPendiente" && (
        <>
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            Ya te habíamos mandado el correo de confirmación a{" "}
            <strong className="break-words text-gray-800 dark:text-gray-200">{correo}</strong> hace un
            rato, y todavía está sin abrir.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Buscalo en tu bandeja, y si no aparece revisá SPAM o Promociones. Ese enlace
            sigue sirviendo.
          </p>
        </>
      )}

      {caso !== "yaSuscrito" && caso !== "confirmacionPendiente" && (
        <>
          {/* Se pide CONFIRMAR, no se da de alta directo. Además de ser mejor
              práctica de correo, es la prueba del consentimiento que exige la
              Ley 8968. */}
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            Te mandamos un correo a{" "}
            <strong className="break-words text-gray-800 dark:text-gray-200">{correo}</strong> para que
            confirmes la suscripción.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Si no lo ves en la bandeja principal, revisá SPAM o Promociones.
            ¡Nos vemos el lunes!
          </p>
        </>
      )}
    </div>
  );
}

/**
 * El anti-bot: un campo que ninguna persona ve y que un programa completa.
 *
 * Reemplaza al recuadro de "Verificación completada" que había acá, que era
 * un dibujo y no verificaba nada. Se descartó Cloudflare Turnstile: obliga a
 * abrir una cuenta de terceros y a cargar un script suyo en todas las
 * páginas del blog para un problema que todavía no tenemos. Si algún día
 * aparece spam real, se agrega sin rehacer nada de esto.
 *
 * Se esconde moviéndolo fuera de la pantalla y NO con display:none ni
 * hidden, que es lo primero que los bots aprendieron a detectar: si el campo
 * está oculto de la forma obvia, lo saltean y la trampa no atrapa a nadie.
 *
 * `tabIndex={-1}` lo saca del recorrido del tabulador y `aria-hidden` de los
 * lectores de pantalla: quien navega con teclado o con lector no tiene por
 * qué tropezarse con un campo que no existe para él.
 */
function CampoTrampa({ valor, alCambiar }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="sitio-web-boletin">No completar este campo</label>
      <input
        id="sitio-web-boletin"
        type="text"
        name="sitioWeb"
        value={valor}
        onChange={e => alCambiar(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

function IconoSobre({ className, style }) {
  return (
    <svg
      className={cx(className)}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}
