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
 * La tarjeta verde que se inclina un poco con el mouse (lienzo, segunda vuelta
 * del 20 oct 2026). En el celular y con «reducir movimiento» se queda quieta.
 */
export function Tarjeta({ className = "", children, tarjetaRef }) {
  const mover = (e) => {
    if (e.pointerType !== "mouse" || quieto()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 160ms ease-out";
    el.style.transform = `perspective(1100px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const soltar = (e) => {
    const el = e.currentTarget;
    el.style.transition = "transform 700ms cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "";
  };
  return (
    <div ref={tarjetaRef} className={`pn-tarjeta ${className}`} onPointerMove={mover} onPointerLeave={soltar}>
      {children}
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
