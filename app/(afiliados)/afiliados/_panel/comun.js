"use client";

import { useEffect, useRef, useState } from "react";

/** El logo del sitio (public/Logo-blanco.svg), en blanco sobre el oscuro. */
export function Logo({ tam = 38, alt = "" }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/Logo-blanco.svg" alt={alt} width={tam} height={tam} className="pn-logo" style={{ width: tam, height: tam }} />;
}

export const ICONOS = {
  atras: "M19 12H5M11 6l-6 6 6 6",
  izquierda: "M15 6l-6 6 6 6",
  derecha: "M5 12h14M13 6l6 6-6 6",
  enlace: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  mas: "M12 5v14M5 12h14",
  cerrar: "M6 6l12 12M18 6L6 18",
  abajo: "M6 9l6 6 6-6",
  visto: "M5 12.5l4.5 4.5L19 7.5",
  mensualidad: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  adicional: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 13h18",
  banco: "M3 10h18M5 10v10M19 10v10M9 10v10M15 10v10M3 20h18M12 3l9 5H3z",
  whatsapp: "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z",
};

export function Icono({ d, tam = 16, grosor = 2.2, color = "currentColor", className, visto }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={d} className={visto ? "pn-visto" : undefined} pathLength={visto ? 1 : undefined} />
    </svg>
  );
}

/** Los tres puntos que laten mientras algo se envía. */
export function Puntos({ color }) {
  return (
    <span aria-hidden="true" className="pn-puntos" style={color ? { color } : undefined}>
      <span className="pn-punto" />
      <span className="pn-punto" style={{ animationDelay: "150ms" }} />
      <span className="pn-punto" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

const quieto = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

/**
 * La tarjeta verde del login y del panel (lienzo, 20 oct 2026), que se puede
 * voltear (Omar, 22 oct 2026, la «controlada»): se arrastra y gira en 3D, pero
 * al soltarla siempre vuelve derecha, de frente o de espaldas, nunca se queda
 * de lado. Un clic o un toque sin arrastrar le da media vuelta; con el
 * teclado, Enter o las flechas. Sin arrastrar, se inclina un poco con el mouse.
 *
 *   · El giro va en `.pn-giro` y no en la cara: la cara tiene overflow:hidden,
 *     que aplana el 3D. Las dos caras son `.pn-tarjeta` (la de atrás, girada
 *     180°) con backface-visibility: hidden.
 *   · El grosor: las caras se separan --pn-canto y en medio van capas finas
 *     (`.pn-canto`), más claras al centro, que de lado se ven como el canto.
 *   · Al soltar busca la cara más cercana, un poco adelantada si se soltó con
 *     impulso: un tirón rápido la voltea aunque no haya pasado de 90°.
 *   · En el celular el deslizamiento horizontal la gira y el vertical sigue
 *     moviendo la página (touch-action: pan-y).
 *   · Con «reducir movimiento» no hay arrastre: el clic la voltea de una vez.
 *
 * `reverso` es lo de atrás; sin él la tarjeta solo se inclina.
 */
const LIMITE_X = 12;
const VOLTEO_MS = 760;
const ASIENTO_MS = 700;
const CANTO = Array.from({ length: 21 }, (_, i) => {
  // De -0,48 a 0,48: las de los extremos no tocan el plano de las caras.
  const z = (i / 20 - 0.5) * 0.96;
  return { z, color: Math.abs(z) > 0.42 ? "#1f5039" : Math.abs(z) > 0.24 ? "#3f8763" : "#6fb592" };
});

export function Tarjeta({ className = "", children, reverso = null, rotulo = "" }) {
  const giro = useRef(null);
  const s = useRef({ x: 0, y: 0, hx: 0, hy: 0, arrastre: null });

  const pintar = (ms = 0, curva = "cubic-bezier(0.22,1,0.36,1)") => {
    const el = giro.current;
    if (!el) return;
    const e = s.current;
    el.style.transition = ms ? `transform ${ms}ms ${curva}` : "none";
    el.style.transform = `rotateX(${(e.x + e.hx).toFixed(2)}deg) rotateY(${(e.y + e.hy).toFixed(2)}deg)`;
    // El brillo sigue el ángulo, en la cara que se esté viendo.
    const ry = ((((e.y + e.hy) % 360) + 360) % 360) * (Math.PI / 180);
    el.style.setProperty("--mx", `${(50 + Math.sin(ry) * 45).toFixed(1)}%`);
    el.style.setProperty("--my", `${(30 - Math.sin(((e.x + e.hx) * Math.PI) / 180) * 45).toFixed(1)}%`);
  };

  const voltear = (lado = 1) => {
    const e = s.current;
    e.y = Math.round(e.y / 180) * 180 + 180 * lado;
    e.x = 0;
    pintar(quieto() ? 0 : VOLTEO_MS);
  };

  // v: grados por cuadro al soltar; diez cuadros de adelanto.
  const asentar = (v = 0) => {
    const e = s.current;
    e.y = Math.round((e.y + v * 10) / 180) * 180;
    e.x = 0;
    pintar(quieto() ? 0 : ASIENTO_MS);
  };

  const bajar = (e) => {
    if (!reverso || (e.pointerType === "mouse" && e.button !== 0)) return;
    const st = s.current;
    st.hx = 0;
    st.hy = 0;
    st.arrastre = { id: e.pointerId, x0: e.clientX, y0: e.clientY, rx: st.x, ry: st.y, mov: 0, tipo: e.pointerType, ux: e.clientX, ut: performance.now(), v: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* sin captura sigue funcionando mientras el puntero esté encima */
    }
    giro.current?.classList.add("es-arrastre");
  };

  const mover = (e) => {
    const st = s.current;
    const a = st.arrastre;
    if (a && a.id === e.pointerId) {
      const dx = e.clientX - a.x0;
      const dy = e.clientY - a.y0;
      a.mov = Math.max(a.mov, Math.abs(dx) + Math.abs(dy));
      if (quieto()) return;
      st.y = a.ry + dx * 0.5;
      if (a.tipo !== "touch") st.x = Math.max(-LIMITE_X, Math.min(LIMITE_X, a.rx - dy * 0.15));
      const ahora = performance.now();
      // La velocidad en grados por cuadro (16 ms), para el adelanto al soltar.
      a.v = ((e.clientX - a.ux) * 0.5 * 16) / Math.max(1, ahora - a.ut);
      a.ux = e.clientX;
      a.ut = ahora;
      pintar();
      return;
    }
    if (e.pointerType !== "mouse" || quieto()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    st.hx = -y * 5;
    st.hy = x * 7;
    pintar(160, "ease-out");
  };

  const soltar = (e) => {
    const st = s.current;
    const a = st.arrastre;
    if (!a || a.id !== e.pointerId) return;
    st.arrastre = null;
    giro.current?.classList.remove("es-arrastre");
    if (e.type !== "pointercancel" && a.mov < 6) return voltear();
    // Si se soltó quieta (más de 80 ms sin moverse) no lleva adelanto.
    asentar(performance.now() - a.ut < 80 ? a.v : 0);
  };

  const salir = () => {
    const st = s.current;
    if (st.arrastre) return;
    st.hx = 0;
    st.hy = 0;
    pintar(700);
  };

  const tecla = (e) => {
    if (!reverso) return;
    const lado = { Enter: 1, " ": 1, ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!lado) return;
    e.preventDefault();
    voltear(lado);
  };

  return (
    <div className={`pn-escena ${className}`}>
      <div
        ref={giro}
        className={`pn-giro${reverso ? " se-gira" : ""}`}
        onPointerDown={bajar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={salir}
        onKeyDown={tecla}
        tabIndex={reverso ? 0 : undefined}
        role={reverso ? "button" : undefined}
        aria-label={reverso ? rotulo : undefined}
      >
        {reverso && (
          <span className="pn-canto" aria-hidden="true">
            {CANTO.map((c, i) => (
              <i key={i} style={{ "--z": c.z, background: c.color }} />
            ))}
          </span>
        )}
        <div className="pn-tarjeta">{children}</div>
        {reverso && (
          <div className="pn-tarjeta es-reverso" aria-hidden="true">
            {reverso}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * El selector ES | EN de la consulta tributaria
 * (cst/consulta-situacion-tributaria/src/partes/idioma.html): la pastilla
 * verde se desliza en medio segundo. Acá va en oscuro.
 */
export function SelectorIdioma({ idioma, alCambiar, rotulo }) {
  return (
    <nav className={`pn-idioma${idioma === "en" ? " es-en" : ""}`} aria-label={rotulo}>
      <span className="pn-idioma-pastilla" aria-hidden="true" />
      <button type="button" lang="es" aria-current={idioma === "es" ? "true" : undefined} onClick={() => alCambiar("es")}>
        ES
      </button>
      <button type="button" lang="en" aria-current={idioma === "en" ? "true" : undefined} onClick={() => alCambiar("en")}>
        EN
      </button>
    </nav>
  );
}

/** Una cifra que sube desde cero (1,3 s, desaceleración cúbica), como en el lienzo. */
export function useCuenta(valor, { desde = 0, ms = 1300, retraso = 250 } = {}) {
  const [v, setV] = useState(quieto() ? valor : desde);
  const raf = useRef(0);
  useEffect(() => {
    if (quieto()) {
      setV(valor);
      return undefined;
    }
    let t0 = 0;
    const paso = (ahora) => {
      if (!t0) t0 = ahora;
      const x = Math.min(1, (ahora - t0) / ms);
      setV(desde + (valor - desde) * (1 - Math.pow(1 - x, 3)));
      if (x < 1) raf.current = requestAnimationFrame(paso);
    };
    const t = setTimeout(() => (raf.current = requestAnimationFrame(paso)), retraso);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
  }, [valor, desde, ms, retraso]);
  return v;
}

export { quieto };
