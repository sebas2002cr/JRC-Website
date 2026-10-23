"use client";
import { useEffect, useRef, useState } from "react";
import { crearEspejo, conGuiones, numerosDe, formato } from "./espejo";

/**
 * El tiquete de la consulta tributaria gratis, en el hero del home.
 *
 * Opción 2 «Tiquete en el hero» del plan de SEO (22 oct 2026). Es el mismo
 * papel de consultasituaciontributaria.cr: se imprime al cargar y, al pasar
 * el mouse, se alza 6 px y el papel oscila una sola vez (styles/tailwind.css,
 * «Tiquete de la consulta»). Los errores del campo también son los de allá:
 * el «!» rojo que entra, el borde rojo y, al insistir, un pulso. Y la cédula
 * se escribe con la misma animación, con los guiones puestos solos (espejo.js).
 *
 * jrc.cr no guarda la cédula ni la manda a ningún lado: la pone en la
 * dirección de la consulta, después del #, y la abre en otra pestaña. Lo que
 * va después del # no sale del navegador, así que tampoco llega al servidor
 * de la consulta ni a sus registros. Allá se escribe en el campo y la
 * consulta corre sola. Si esto cambia, se cambia también /privacidad.
 */
const SITIO = "https://consultasituaciontributaria.cr";

// Las mismas reglas y los mismos textos que el campo de la consulta (src/util.js
// de ese sitio): guiones, puntos y espacios se quitan; la física tiene 9
// números, la jurídica 10 y el DIMEX 11 o 12. La física con el 0 de adelante
// (como la guarda el MEIC) pierde ese 0.
const SEPARADORES = /[\s.\-–—]/g;
const LETRAS = /[^\d\s.\-–—]/;
const LARGO = "La física tiene 9, la jurídica 10 y el DIMEX 11 o 12.";
const SOLO_NUMEROS = "Usá solo números. Los guiones son opcionales.";
const sinCero = (d) => (d.length === 10 && d.startsWith("0") ? d.slice(1) : d);
function limpiar(v) {
  if (LETRAS.test(v)) return { error: SOLO_NUMEROS };
  const d = sinCero(v.replace(SEPARADORES, ""));
  if (d.length > 12) return { error: `Sobran números: escribiste ${d.length}. ${LARGO}` };
  if (![9, 10, 11, 12].includes(d.length)) return { error: `Faltan números: escribiste ${d.length}. ${LARGO}` };
  return { d };
}
// Mientras escribe, como allá: las letras y los números de más se dicen de una
// vez; lo que falta, solo al tocar Consultar.
function revisarEscrito(v) {
  if (!v.trim()) return "";
  if (LETRAS.test(v)) return SOLO_NUMEROS;
  const d = sinCero(v.replace(SEPARADORES, ""));
  return d.length > 12 ? `Sobran números: escribiste ${d.length}. ${LARGO}` : "";
}

// Una sola oscilación amortiguada, colgada del borde de arriba:
// ángulo = dir · 1,6 · e^(−t/0,42) · sen(2πt/0,95), en 1,5 s.
const OSCILA = (dir) =>
  Array.from({ length: 41 }, (_, i) => {
    const t = (i / 40) * 1.5;
    const ang = dir * 1.6 * Math.exp(-t / 0.42) * Math.sin((2 * Math.PI * t) / 0.95);
    return { transform: i === 40 ? "none" : `rotate(${ang.toFixed(3)}deg)` };
  });

export default function TiqueteConsulta() {
  const [error, setError] = useState("");
  const papel = useRef(null);
  const campo = useRef(null);
  const entrada = useRef(null);
  const espejo = useRef(null);
  const escrito = useRef("");
  const animacion = useRef(null);

  // La capa que dibuja la cédula se arma en el navegador; sin JavaScript el
  // campo se ve como siempre.
  useEffect(() => {
    espejo.current = crearEspejo(entrada.current);
    return () => espejo.current?.quitar();
  }, []);

  // Mientras escribe: los guiones se ponen solos, el cursor queda después del
  // mismo número y el error, si lo hay, se dice de una vez.
  const alEscribir = (ev) => {
    const input = ev.currentTarget;
    const borroGuion = ev.nativeEvent.inputType === "deleteContentBackward" && input.value.replace(/\D/g, "") === escrito.current.replace(/\D/g, "");
    const g = conGuiones(input.value, input.selectionStart ?? input.value.length, borroGuion);
    if (g && g.t !== input.value) {
      input.value = g.t;
      input.setSelectionRange(g.pos, g.pos);
    }
    escrito.current = input.value;
    espejo.current?.pintar();
    setError(revisarEscrito(input.value));
  };
  // Si pega un texto con la cédula adentro, se queda con los números.
  const alPegar = (ev) => {
    const txt = ev.clipboardData?.getData("text") || "";
    const d = numerosDe(txt);
    if (!d || !LETRAS.test(txt)) return;
    ev.preventDefault();
    const input = ev.currentTarget;
    input.value = formato(d);
    escrito.current = input.value;
    espejo.current?.pintar();
    setError("");
  };

  // `dir` sale del lado por donde entró el mouse.
  const mecer = (ev) => {
    if (ev.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ev.currentTarget.getBoundingClientRect();
    const dir = ev.clientX < r.left + r.width / 2 ? -1 : 1;
    animacion.current?.cancel();
    animacion.current = papel.current?.animate(OSCILA(dir), { duration: 1500, easing: "linear" });
  };

  // Al tocar Consultar con un error, el campo se marca otra vez para que se note.
  const insistir = () => {
    const el = campo.current;
    if (!el) return;
    el.classList.remove("tq-insiste");
    void el.offsetWidth;
    el.classList.add("tq-insiste");
  };

  const consultar = (ev) => {
    ev.preventDefault();
    const valor = ev.currentTarget.cedula.value.trim();
    // Sin cédula, el botón abre la consulta normal.
    if (!valor) {
      setError("");
      window.open(SITIO, "_blank", "noopener");
      return;
    }
    const r = limpiar(valor);
    if (r.error) {
      setError(r.error);
      insistir();
      ev.currentTarget.cedula.focus();
      return;
    }
    setError("");
    window.open(`${SITIO}/#cedula=${r.d}`, "_blank", "noopener");
  };

  return (
    <div className="tq-consulta mx-auto mt-8 w-full max-w-[480px] text-left" onPointerEnter={mecer}>
      <div ref={papel} className="tq-consulta-papel grid grid-cols-[minmax(0,1fr)] gap-3 bg-white px-5 pb-[30px] pt-[18px]">
        <p className="flex justify-between gap-3 border-b-[1.5px] border-dashed border-[#c6d2c9] pb-2 text-xs font-semibold uppercase tracking-[.08em] text-[#305832]">
          <span>Gratis</span>
          <span>Al instante</span>
        </p>
        <h2 className="text-xl font-bold text-[#0f1d15]">
          Consultá tu situación tributaria
        </h2>
        <form onSubmit={consultar} noValidate>
          <label htmlFor="tq-cedula" className="sr-only">
            Número de cédula
          </label>
          <div ref={campo} className={`tq-campo flex overflow-hidden rounded-xl bg-white${error ? " es-error" : ""}`}>
            <input
              ref={entrada}
              id="tq-cedula"
              name="cedula"
              inputMode="numeric"
              autoComplete="off"
              spellCheck="false"
              maxLength={24}
              placeholder="Escribí tu cédula"
              aria-invalid={error ? "true" : undefined}
              aria-describedby="tq-error"
              onInput={alEscribir}
              onPaste={alPegar}
              className="w-0 min-w-0 flex-1 border-0 bg-transparent px-3.5 py-3 text-base text-[#0f1d15] placeholder:text-[#6b7a72] focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="m-1 rounded-[9px] bg-[#305832] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#234621]">
              Consultar
            </button>
          </div>
          {/* La key hace que el aviso vuelva a entrar solo cuando cambia el
              texto, no con cada número que escribe. */}
          <div id="tq-error" role="alert">
            {error && (
              <p key={error} className="tq-aviso">
                {error}
              </p>
            )}
          </div>
        </form>
        <p className="border-t-[3px] border-double border-[rgba(48,88,50,.22)] pt-2 text-[12.5px] text-gray-600">
          El resultado se abre en consultasituaciontributaria.cr ↗
        </p>
      </div>
    </div>
  );
}
