"use client";

import { useEffect, useRef, useState } from "react";
import { T, cuandoIngreso, nombreMes, iniciales, cuentaEn } from "./textos";
import { pedir } from "./api";
import { Icono, ICONOS, Puntos, SelectorIdioma } from "./comun";

// El WhatsApp público del sitio, el mismo del blog (Omar, 21 oct 2026).
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "");

/**
 * El cajón de la derecha, con su velo. Se cierra con Escape, con el velo o con
 * la X, y sale animado. Mientras está abierto la página de atrás no se mueve.
 */
export function Cajon({ titulo, alCerrar, cerrando, children }) {
  const t = T.es;
  const caja = useRef(null);
  useEffect(() => {
    const previo = document.activeElement;
    const tecla = (e) => e.key === "Escape" && alCerrar();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", tecla);
    caja.current?.querySelector("input, textarea, button")?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", tecla);
      if (previo && previo.focus) previo.focus({ preventScroll: true });
    };
  }, [alCerrar]);
  return (
    <>
      <div className={`pn-velo-cajon${cerrando ? " es-sale" : ""}`}>
        <button type="button" onClick={alCerrar} aria-label={t.cerrar} tabIndex={-1} />
      </div>
      <aside ref={caja} className={`pn-cajon${cerrando ? " es-sale" : ""}`} role="dialog" aria-modal="true" aria-label={titulo}>
        {children}
      </aside>
    </>
  );
}

function Cabeza({ titulo, alCerrar, idioma }) {
  return (
    <div className="pn-cajon-cab">
      <h2>{titulo}</h2>
      <button type="button" onClick={alCerrar} aria-label={T[idioma].cerrar} className="pn-cerrar pn-btn">
        <Icono d={ICONOS.cerrar} grosor={2.3} />
      </button>
    </div>
  );
}

/** «Recomendar una empresa»: entra como lead en Comercial, ligado al afiliado. */
export function Recomendar({ idioma, token, alCerrar, alRecomendo, alVencer }) {
  const t = T[idioma];
  const [f, setF] = useState({ empresa: "", persona: "", contacto: "", necesidad: "", acepta: false });
  const [error, setError] = useState({ campo: "", texto: "" });
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const cambiar = (k) => (e) => {
    setF((x) => ({ ...x, [k]: k === "acepta" ? e.target.checked : e.target.value }));
    if (error.campo === k || !error.campo) setError({ campo: "", texto: "" });
  };

  async function enviar(e) {
    e.preventDefault();
    if (enviando) return;
    if (!f.empresa.trim()) return setError({ campo: "empresa", texto: t.errEmpresa });
    const c = f.contacto.trim();
    const sirve = /\S+@\S+\.\S+/.test(c) || [8, 11].includes(c.replace(/\D/g, "").length);
    if (!sirve) return setError({ campo: "contacto", texto: t.errContacto });
    if (!f.acepta) return setError({ campo: "acepta", texto: t.errSabe });
    setEnviando(true);
    const r = await pedir("POST", "/panel/recomendar", { token, cuerpo: { empresa: f.empresa, persona: f.persona, contacto: c, necesidad: f.necesidad, acepta: true } });
    setEnviando(false);
    if (r.status === 401) return alVencer();
    if (!r.ok) {
      const txt = r.datos?.codigo === "tarda" ? t.tarda : r.status === 0 || r.status >= 500 ? t.sinConexion : idioma === "es" && r.datos?.error ? r.datos.error : t.sinConexion;
      return setError({ campo: "", texto: txt });
    }
    setListo(true);
    alRecomendo();
  }

  return (
    <>
      <Cabeza titulo={t.recomendarTitulo} alCerrar={alCerrar} idioma={idioma} />
      {!listo ? (
        <form onSubmit={enviar} noValidate>
          <p className="pn-cajon-p">{t.recomendarTexto}</p>
          <div className="pn-form">
            <label>
              <span>{t.empresa}</span>
              <input className="pn-campo" type="text" value={f.empresa} onChange={cambiar("empresa")} placeholder={t.empresaPista} aria-invalid={error.campo === "empresa" ? "true" : "false"} maxLength={120} />
            </label>
            <label>
              <span>{t.persona}</span>
              <input className="pn-campo" type="text" value={f.persona} onChange={cambiar("persona")} placeholder={t.personaPista} maxLength={120} />
            </label>
            <label>
              <span>{t.contacto}</span>
              <input className="pn-campo" type="text" value={f.contacto} onChange={cambiar("contacto")} placeholder={t.contactoPista} aria-invalid={error.campo === "contacto" ? "true" : "false"} maxLength={160} />
            </label>
            <label>
              <span>{t.necesita}</span>
              <textarea className="pn-campo" rows={3} value={f.necesidad} onChange={cambiar("necesidad")} placeholder={t.necesitaPista} maxLength={600} />
            </label>
            <label className={`pn-casilla${error.campo === "acepta" ? " es-error" : ""}`}>
              <input type="checkbox" checked={f.acepta} onChange={cambiar("acepta")} />
              {t.sabe}
            </label>
          </div>
          {error.texto && (
            <div role="alert" className="pn-alerta" style={{ marginTop: 14 }}>
              {error.texto}
            </div>
          )}
          <button type="submit" className="pn-btn pn-claro pn-enviar" aria-busy={enviando ? "true" : "false"}>
            {enviando ? <Puntos color="#0a0d0c" /> : t.enviarRec}
          </button>
        </form>
      ) : (
        <div className="pn-listo pn-sube" role="status">
          <span className="pn-listo-circulo pn-circulo" aria-hidden="true">
            <Icono d="m5 13 4 4L19 7" tam={32} grosor={2.4} color="#ffffff" visto />
          </span>
          <h3>{t.recibimos}</h3>
          <p>{t.recibimosTexto}</p>
          <div className="pn-listo-btns">
            <button
              type="button"
              className="pn-btn pn-borde"
              onClick={() => {
                setF({ empresa: "", persona: "", contacto: "", necesidad: "", acepta: false });
                setListo(false);
              }}
            >
              {t.otra}
            </button>
            <button type="button" className="pn-btn pn-claro" onClick={alCerrar}>
              {t.listo}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** «Tu perfil»: sus datos, teléfono e idioma editables, y dónde se le paga. */
export function Perfil({ idioma, token, perfil, saludo, alCerrar, alSalir, alIdioma, alCambio, alVencer, mirando = false }) {
  const t = T[idioma];
  const [editando, setEditando] = useState(false);
  const [tel, setTel] = useState(perfil.telefono || "");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  async function guardarTel(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    const r = await pedir("PUT", "/panel/perfil", { token, cuerpo: { telefono: tel } });
    setGuardando(false);
    if (r.status === 401) return alVencer();
    if (!r.ok) return setError(idioma === "es" && r.datos?.error ? r.datos.error : t.sinConexion);
    alCambio({ telefono: r.datos.telefono ?? tel });
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2200);
  }

  const cuenta = perfil.cuenta;
  const mensaje = cuenta ? t.mensajeCambio(saludo) : t.mensajeCuenta(saludo);
  const wa = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}` : "";
  const desde = perfil.desde ? `${nombreMes(perfil.desde, idioma)} ${perfil.desde.slice(0, 4)}` : "";

  return (
    <>
      <Cabeza titulo={t.tuPerfil} alCerrar={alCerrar} idioma={idioma} />
      <div className="pn-perfil-cab">
        <span aria-hidden="true" className="pn-perfil-ini">
          {iniciales(saludo || perfil.nombre)}
        </span>
        <span style={{ minWidth: 0 }}>
          <span className="pn-perfil-n">{perfil.nombre}</span>
          <span className="pn-perfil-c">{perfil.correo}</span>
        </span>
      </div>

      <dl className="pn-dl">
        <dt>{t.idioma}</dt>
        <dd>
          <SelectorIdioma idioma={idioma} alCambiar={alIdioma} rotulo={t.idioma} />
        </dd>
        {perfil.categoria && (
          <>
            <dt>{t.categoria}</dt>
            <dd>{perfil.categoria}</dd>
          </>
        )}
        <dt>{t.telefono}</dt>
        <dd>
          {!editando ? (
            <span className="pn-tel">
              <span className="pn-num">{perfil.telefono ? perfil.telefono.replace(/^(\d{4})(\d{4})$/, "$1 $2") : t.sinTelefono}</span>
              {!mirando && (
                <button type="button" className="pn-tel-btn" onClick={() => (setTel(perfil.telefono || ""), setEditando(true))}>
                  {t.cambiar}
                </button>
              )}
            </span>
          ) : null}
        </dd>
        {editando && (
          <form className="pn-tel-form" onSubmit={guardarTel}>
            <input className="pn-campo" type="tel" inputMode="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} aria-label={t.telefono} aria-invalid={error ? "true" : "false"} />
            <button type="submit" className="pn-btn pn-claro" disabled={guardando}>
              {guardando ? <Puntos color="#0a0d0c" /> : t.guardar}
            </button>
            <button type="button" className="pn-btn pn-borde" onClick={() => (setEditando(false), setError(""))}>
              {t.cancelar}
            </button>
            {error && (
              <div role="alert" className="pn-alerta" style={{ flex: "1 1 100%", marginTop: 0 }}>
                {error}
              </div>
            )}
          </form>
        )}
        {desde && (
          <>
            <dt>{t.afiliadoDesde}</dt>
            <dd>{desde}</dd>
          </>
        )}
      </dl>
      {guardado && (
        <div className="pn-guardado" role="status">
          {t.guardado}
        </div>
      )}

      <div className="pn-bloque">
        <div className="pn-bloque-t">{t.dondePagamos}</div>
        {perfil.descuento ? (
          <>
            <div className="pn-cuenta">
              <span aria-hidden="true" className="pn-cuenta-ico">
                <Icono d={ICONOS.banco} tam={19} grosor={2} />
              </span>
              <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                <span className="pn-cuenta-t">{t.descuentoEn(perfil.descuento.empresa)}</span>
              </span>
            </div>
            <p className="pn-cajon-p" style={{ margin: "10px 0 0" }}>
              {t.descuentoTexto}
            </p>
          </>
        ) : cuenta ? (
          <div className="pn-cuenta">
            <span aria-hidden="true" className="pn-cuenta-ico">
              <Icono d={ICONOS.banco} tam={19} grosor={2} />
            </span>
            <span style={{ flex: "1 1 auto", minWidth: 0 }}>
              <span className="pn-cuenta-t">{cuentaEn(cuenta.descripcion, idioma)}</span>
              <span className="pn-cuenta-d">{t.enMoneda[cuenta.moneda] || ""}</span>
            </span>
          </div>
        ) : (
          <p className="pn-cajon-p" style={{ margin: 0 }}>
            {t.sinCuentaTexto}
          </p>
        )}
        {cuenta?.enRevision && (
          <div role="status" className="pn-aviso-azul">
            {t.enRevision(cuentaEn(cuenta.descripcion, idioma))}
          </div>
        )}
        {wa && !mirando && !perfil.descuento && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="pn-btn pn-borde pn-wa">
            <Icono d={ICONOS.whatsapp} grosor={2} />
            {cuenta ? t.pedirCambio : t.pedirCuenta}
          </a>
        )}
      </div>

      {perfil.ingresos?.length > 0 && (
        <div className="pn-bloque">
          <div className="pn-bloque-t">{t.ultimosIngresos}</div>
          {perfil.ingresos.slice(0, 5).map((i) => (
            <div key={i.en} className="pn-ingreso">
              {/* El ERP lo escribe en español («Chrome en Windows»). */}
              <span>{idioma === "en" ? String(i.dispositivo).replace(" en ", " on ").replace(/^Navegador$/, "Browser") : i.dispositivo}</span>
              <span>{i.estaSesion ? t.estaSesion : cuandoIngreso(i.en, idioma)}</span>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={alSalir} className="pn-salir-ancho pn-btn">
        {t.salir}
      </button>
    </>
  );
}
