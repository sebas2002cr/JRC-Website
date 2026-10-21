"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./textos";
import { pedir } from "./api";
import { Icono, ICONOS, Logo, Puntos, SelectorIdioma, Tarjeta } from "./comun";

const ESPERA_REENVIO = 45;

/** «car•••@ejemplo.com»: el correo a medias, para confirmar sin mostrarlo entero. */
function aMedias(correo) {
  const [u, d] = String(correo).split("@");
  if (!d) return correo;
  return `${u.slice(0, Math.min(3, u.length))}•••@${d}`;
}

/**
 * La entrada al panel: correo → código de 6 dígitos → «Hola». Copia del lienzo
 * «Tarjeta»: la tarjeta flota a la izquierda y el cuadro del login cambia de
 * paso con un deslizamiento corto. `alEntrar({ token, afiliado, desde })`
 * recibe el cuadro del login, del que crece el velo hacia el panel.
 */
export default function Login({ idioma, alIdioma, alEntrar, legales, mensaje }) {
  const t = T[idioma];
  const [paso, setPaso] = useState("correo");
  const [atras, setAtras] = useState(false);
  const [vuelta, setVuelta] = useState(0);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(mensaje || "");
  const [sacude, setSacude] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [ok, setOk] = useState(false);
  const [saludo, setSaludo] = useState("");
  const [espera, setEspera] = useState(0);
  const [reenviado, setReenviado] = useState(false);
  const forma = useRef(null);
  const campoCodigo = useRef(null);
  const relojes = useRef([]);

  useEffect(() => () => relojes.current.forEach(clearTimeout), []);
  const despues = (ms, fn) => relojes.current.push(setTimeout(fn, ms));

  // La cuenta regresiva de «Reenviar en 0:45».
  useEffect(() => {
    if (paso !== "codigo" || espera <= 0) return undefined;
    const r = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(r);
  }, [paso, espera]);

  const ir = (nuevo, haciaAtras = false) => {
    setAtras(haciaAtras);
    setVuelta((v) => v + 1);
    setPaso(nuevo);
  };

  const textoError = (r) => {
    if (r.status === 429) return t.muchosIntentos;
    if (r.datos?.codigo === "tarda") return t.tarda;
    if (r.datos?.codigo === "sinConexion" || r.status === 0 || r.status >= 500) return t.sinConexion;
    return null;
  };

  async function pedirCodigo(e, { reenvio = false } = {}) {
    e?.preventDefault();
    if (enviando) return;
    const c = correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)) {
      setError(t.correoMal);
      return;
    }
    setError("");
    setEnviando(true);
    const r = await pedir("POST", "/panel/codigo", { cuerpo: { correo: c } });
    setEnviando(false);
    if (!r.ok) {
      setError(textoError(r) || (r.status === 400 ? t.correoMal : t.sinConexion));
      return;
    }
    setEspera(ESPERA_REENVIO);
    setCodigo("");
    if (reenvio) {
      setReenviado(true);
      despues(4000, () => setReenviado(false));
      return;
    }
    ir("codigo");
    despues(80, () => campoCodigo.current?.focus());
  }

  async function verificar(cod) {
    setVerificando(true);
    setError("");
    const r = await pedir("POST", "/panel/entrar", { cuerpo: { correo: correo.trim().toLowerCase(), codigo: cod } });
    if (!r.ok || !r.datos?.token) {
      setVerificando(false);
      setError(textoError(r) || t.codigoMal);
      setSacude((s) => s + 1);
      setCodigo("");
      despues(60, () => campoCodigo.current?.focus());
      return;
    }
    // Las cajas se pintan de verde una por una, aparece «Hola» y el velo crece
    // desde el cuadro hacia el panel (los tiempos del lienzo).
    setOk(true);
    setSaludo(r.datos.afiliado?.saludo || r.datos.afiliado?.nombre || "");
    despues(700, () => {
      ir("hola");
      setVerificando(false);
    });
    despues(1750, () => alEntrar({ token: r.datos.token, afiliado: r.datos.afiliado, desde: forma.current }));
  }

  const escribir = (e) => {
    if (verificando || ok) return;
    const limpio = String(e.target.value || "").replace(/\D/g, "").slice(0, 6);
    setCodigo(limpio);
    setError("");
    if (limpio.length === 6) despues(180, () => verificar(limpio));
  };

  const anim = `${atras ? "pnVuelve" : "pnPaso"}${vuelta % 2 ? "A" : "B"} 460ms cubic-bezier(0.22,1,0.36,1) backwards`;

  return (
    <div className="pn-entrar">
      <header className="pn-entrar-cab pn-aparece">
        <a href="/" className="pn-volver pn-link">
          <Icono d={ICONOS.atras} />
          <span className="pn-txt">{t.irAlSitio}</span>
        </a>
        <span className="pn-cab-der">
          <SelectorIdioma idioma={idioma} alCambiar={alIdioma} rotulo={t.idioma} />
          <span className="pn-marca">
            <Logo tam={38} alt="JRC Consulting Group" />
            <span className="pn-marca-sep pn-txt" />
            {/* Ocupa siempre lo del texto más largo de los dos idiomas: al cambiar de idioma no se mueve el selector. */}
            <span className="pn-marca-txt pn-txt pn-ancho-fijo">
              <span>{t.programa}</span>
              <span aria-hidden="true" className="pn-ancho-otro">{T[idioma === "en" ? "es" : "en"].programa}</span>
            </span>
          </span>
        </span>
      </header>

      <div className="pn-entrar-medio">
        <div className="pn-login">
          <div className="pn-login-izq pn-sube">
            <div className="pn-login-tarjeta pn-flota">
              <Tarjeta>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Logo tam={44} />
                  <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
                    <rect x="0.5" y="0.5" width="45" height="33" rx="7" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
                    <path d="M0 12h46M0 22h46M16 0v34M30 0v34" stroke="rgba(255,255,255,0.28)" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{t.programa}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>{t.recomendaYGana}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 13.5, color: "rgba(255,255,255,0.85)" }}>
                  <span>{t.desdeCadaMes}</span>
                  <span>jrc.cr</span>
                </div>
              </Tarjeta>
            </div>
            <div aria-hidden="true" className="pn-sombra" />
          </div>

          <section ref={forma} className="pn-forma pn-sube" aria-live="polite">
            {paso === "correo" && (
              <form key={`c${vuelta}`} style={{ animation: anim }} onSubmit={pedirCodigo} noValidate>
                <h1 className="pn-h1">{t.entraTitulo}</h1>
                <p className="pn-p">{t.entraTexto}</p>
                <label htmlFor="pn-correo" className="pn-rot">
                  {t.correo}
                </label>
                <input
                  id="pn-correo"
                  className="pn-campo pn-correo"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setError("");
                  }}
                  aria-invalid={error ? "true" : "false"}
                />
                {error && (
                  <div role="alert" className="pn-alerta">
                    {error}
                  </div>
                )}
                <button type="submit" className="pn-btn pn-claro pn-grande" aria-busy={enviando ? "true" : "false"}>
                  {enviando ? (
                    <>
                      <Puntos color="#0a0d0c" />
                      <span className="pn-oculto">{t.enviandoCodigo}</span>
                    </>
                  ) : (
                    <>
                      {t.enviarCodigo}
                      <Icono d={ICONOS.derecha} tam={17} grosor={2.3} />
                    </>
                  )}
                </button>
                <p style={{ margin: "22px 0 0", fontSize: 14, color: "var(--pn-suave)" }}>
                  {t.noSosAfiliado}{" "}
                  <a href="/partners" style={{ fontWeight: 600 }}>
                    {t.conoce}
                  </a>
                </p>
              </form>
            )}

            {paso === "codigo" && (
              <div key={`k${vuelta}`} style={{ animation: anim }}>
                <button type="button" onClick={() => (ir("correo", true), setError(""), setCodigo(""))} className="pn-otro pn-link">
                  <Icono d={ICONOS.izquierda} grosor={2.3} />
                  {t.otroCorreo}
                </button>
                <h1 className="pn-h1" style={{ fontSize: 30 }}>
                  {t.revisaCorreo}
                </h1>
                <p className="pn-p" style={{ marginBottom: 24 }}>
                  {t.mandamosA(correo)[0]}
                  <strong style={{ color: "var(--pn-tinta)", fontWeight: 600 }}>{aMedias(correo.trim().toLowerCase())}</strong>
                  {t.mandamosA(correo)[2]}
                </p>
                <div className="pn-cajas-envoltura">
                  <div role="group" aria-label={t.codigoDe6} className={`pn-cajas${error ? ` es-error ${sacude % 2 ? "pn-sacude" : "pn-sacude2"}` : ""}`}>
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const d = codigo[i] || "";
                      const activa = !verificando && !ok && i === Math.min(codigo.length, 5) && codigo.length < 6;
                      return (
                        <span
                          key={`${i}-${d ? "l" : "v"}`}
                          className={`pn-caja${d || ok ? " es-llena" : ""}${activa && !error ? " es-activa" : ""}${ok ? " pn-caja-ok" : d ? " pn-caja-llena" : ""}`}
                          style={ok ? { animationDelay: `${i * 70}ms` } : undefined}
                        >
                          {d}
                        </span>
                      );
                    })}
                  </div>
                  <input
                    ref={campoCodigo}
                    aria-label={t.codigo}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={codigo}
                    onChange={escribir}
                    className="pn-codigo-input"
                    disabled={verificando || ok}
                  />
                </div>
                {error && (
                  <div role="alert" className="pn-alerta">
                    {error}
                  </div>
                )}
                <div className="pn-reenvio">
                  <span>{reenviado ? t.reenviado : t.noLlego}</span>
                  {espera > 0 ? (
                    <span className="pn-num" style={{ color: "var(--pn-tenue)" }}>
                      {t.reenviarEn(espera)}
                    </span>
                  ) : (
                    <button type="button" className="pn-reenvio-btn" onClick={(e) => pedirCodigo(e, { reenvio: true })} disabled={enviando}>
                      {t.reenviar}
                    </button>
                  )}
                </div>
              </div>
            )}

            {paso === "hola" && (
              <div key={`h${vuelta}`} className="pn-hola" style={{ animation: anim }}>
                <span className="pn-hola-circulo pn-circulo" aria-hidden="true">
                  <Icono d="m5 13 4 4L19 7" tam={36} grosor={2.4} color="#ffffff" visto />
                </span>
                <h1 className="pn-h1" style={{ margin: 0 }}>
                  {t.hola(saludo)}
                </h1>
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="pn-pie">
        <span>© {new Date().getFullYear()} JRC Consulting Group</span>
        {legales.map((l) => (
          <a key={l.href} href={l.href} className="pn-link">
            {t[l.clave]}
          </a>
        ))}
      </footer>
    </div>
  );
}
