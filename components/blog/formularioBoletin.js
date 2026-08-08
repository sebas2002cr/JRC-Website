"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/utils/all";
import { pedirAlBoletin, VERDE } from "@/lib/boletin";

/**
 * El formulario de alta al boletín, sin marco.
 *
 * Vive aparte porque lo usan DOS lugares: el panel flotante del blog
 * (components/blog/newsletter.js) y la página jrc.cr/boletin, que es la que
 * se le manda a un cliente por WhatsApp. Con una copia en cada lado, alcanza
 * con que alguien agregue un campo en uno para que el otro quede viejo, y
 * eso no se nota hasta que una persona real se suscribe por el camino
 * equivocado y llega incompleta a la base.
 *
 * Acá adentro va todo lo que es el alta en sí: los campos, las defensas
 * contra bots, el consentimiento y el desenlace. Lo que cambia entre un uso
 * y el otro (el botón flotante, el encabezado, el fondo) queda afuera.
 */

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

export default function FormularioBoletin() {
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [estado, setEstado] = useState("inicial"); // inicial | enviando | listo
  // enviado | yaSuscrito | confirmacionPendiente
  const [resultado, setResultado] = useState("enviado");
  const [error, setError] = useState("");

  // El campo trampa. Va en el estado y no suelto en el formulario para poder
  // leerlo al enviar sin tener que ir a buscarlo al DOM.
  const [sitioWeb, setSitioWeb] = useState("");

  /**
   * Desde cuándo la persona tiene el formulario delante.
   *
   * Sirve para descartar los envíos instantáneos, que no los hace una
   * persona. Se guarda el momento y se manda el tiempo TRANSCURRIDO, no la
   * hora: así no importa si el reloj de esa computadora está desfasado, que
   * es algo bastante común.
   *
   * Se marca al montar, y eso funciona igual en los dos usos: en el panel el
   * formulario recién se monta cuando alguien lo abre, y en la página cuando
   * alguien entra.
   */
  const montadoDesde = useRef(0);
  useEffect(() => {
    montadoDesde.current = Date.now();
  }, []);

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
      msEnPantalla: Date.now() - montadoDesde.current
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

  if (estado === "listo") return <Resultado correo={correo} caso={resultado} />;

  return (
    <>
      {/* El texto no encierra el boletín en lo tributario: las cuatro áreas
          son las que trabaja la firma, y hablarle solo a "tu empresa" dejaba
          afuera a los independientes, que son buena parte de quienes
          consultan. */}
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Todos los lunes, un resumen de las novedades en materia{" "}
        <strong className="font-semibold text-gray-800 dark:text-gray-200">
          {AREAS}
        </strong>{" "}
        en Costa Rica, y qué significan para tu empresa o para vos como
        independiente.
      </p>

      {/* ── Cómo está ordenado este formulario ──────────────
          De arriba abajo: correo, nombre, ocupación, la casilla de la
          política y recién al final el botón.

          Antes el botón iba pegado al campo del correo, arriba de todo lo
          demás. Se veía ágil, pero dejaba dos problemas. Uno visual: el
          correo quedaba angosto para hacerle lugar al botón y el nombre
          ocupaba todo el ancho, así que dos campos hermanos tenían tamaños
          distintos sin ningún motivo. Y otro de fondo: se podía enviar el
          formulario sin haber llegado siquiera a ver la casilla de la
          política, que estaba más abajo. El consentimiento tiene que estar a
          la vista ANTES del botón que lo da por otorgado.

          Los dos campos comparten exactamente las mismas clases
          (CLASES_CAMPO) para que no se puedan desalinear de nuevo al tocar
          uno solo. */}
      {/* Los dos campos llevan tope de caracteres. Son los mismos que aplica
          el backend al guardar (120 el nombre) y el máximo que puede medir
          una dirección de correo según el estándar (254). Ponerlos también
          acá no es duplicar la validación: sin tope, alguien que pega un
          texto larguísimo no ve nada raro y el servidor lo recorta en
          silencio, así que la persona termina guardada con un nombre a
          medias sin enterarse. */}
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

        {/* Nombre y ocupación no bloquean la suscripción, pero NO se rotulan
            como opcionales: decir "opcional" es una invitación a
            saltárselos, y entonces casi nadie los completa. Se presentan
            como parte natural del formulario y quien no quiera, sigue de
            largo. */}
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
                  // Se puede desmarcar: si alguien la tocó por error, tiene
                  // que poder dejarla en blanco.
                  onClick={() => setOcupacion(activa ? "" : opcion)}
                  aria-pressed={activa}
                  className={cx(
                    // Más alto en el celular: con py-1.5 el botón mide unos
                    // 32px y el dedo falla o toca el de al lado. Arriba de
                    // 640px vuelve a la altura original, que ahí se apunta
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
          {/* Sin marcar por defecto: la Ley 8968 pide consentimiento
              expreso, y una casilla ya marcada no lo es. */}
          <input
            type="checkbox"
            checked={acepta}
            onChange={e => setAcepta(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#305832]"
          />
          <span>
            Acepto la{" "}
            <a
              href="/privacidad"
              className="font-medium text-[#305832] underline dark:text-[#8cbe8f]">
              Política de Privacidad
            </a>{" "}
            y los{" "}
            <a
              href="/terminos"
              className="font-medium text-[#305832] underline dark:text-[#8cbe8f]">
              Términos y Condiciones
            </a>
            , y que JRC me escriba a este correo.
          </span>
        </label>

        {/* El error va ARRIBA del botón, no debajo. Con el botón al final del
            formulario, un mensaje debajo puede quedar fuera de la parte
            visible: la persona apretaría de nuevo sin llegar a leer nunca
            por qué no funcionó. */}
        {error && (
          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* El botón cierra el formulario, después de la casilla. Ocupa todo
            el ancho para que la columna cierre pareja con los dos campos de
            arriba. */}
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="mt-5 w-full rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          style={{ backgroundColor: VERDE }}>
          {estado === "enviando" ? "Enviando..." : "Suscribirme"}
        </button>
      </form>
    </>
  );
}

/**
 * Lo que se ve después de dejar el correo.
 *
 * Tres desenlaces, no uno. El que más importa distinguir es el del medio:
 * quien ya se anotó y no abrió el correo no está suscrito todavía, y decirle
 * "ya estás suscrito" lo dejaría esperando un boletín que nunca le va a
 * llegar.
 */
function Resultado({ correo, caso }) {
  const yaEstaba = caso === "yaSuscrito";

  return (
    <div className="rounded-xl border-2 border-dashed p-6" style={{ borderColor: VERDE }}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: VERDE }}>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <p className="text-lg font-bold text-gray-800 dark:text-white">
          {yaEstaba ? "Ya estás en la lista" : "Ya casi"}
        </p>
      </div>

      {yaEstaba ? (
        <p className="text-gray-600 dark:text-gray-400">
          <strong className="text-gray-800 dark:text-gray-200">{correo}</strong> ya
          está suscrito al newsletter. Nos vemos el lunes.
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Te escribimos a{" "}
          <strong className="text-gray-800 dark:text-gray-200">{correo}</strong>{" "}
          para confirmar que la dirección es tuya. Abrí ese correo y listo. Si no
          aparece en unos minutos, revisá el correo no deseado.
        </p>
      )}
    </div>
  );
}

/**
 * El campo trampa: invisible para una persona, irresistible para un bot.
 *
 * NO se oculta con display:none ni con hidden, que es lo primero que un bot
 * medianamente hecho aprende a saltear. Se saca de la pantalla con posición
 * absoluta, se le quita el tabulador y se le apaga el autocompletado para
 * que ningún navegador se lo llene solo a una persona de verdad.
 */
function CampoTrampa({ valor, alCambiar }) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden="true">
      <label htmlFor="sitioWeb-boletin">Sitio web</label>
      <input
        id="sitioWeb-boletin"
        name="sitioWeb"
        type="text"
        value={valor}
        onChange={e => alCambiar(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
