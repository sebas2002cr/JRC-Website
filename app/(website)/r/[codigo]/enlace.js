"use client";

import { useEffect, useRef, useState } from "react";
import { enviarAlErp } from "@/lib/crm";
import { recordarCodigo } from "@/lib/enlaceAfiliado";
import { useTiempoEnPantalla } from "@/components/ui/consentimiento";

// El WhatsApp público del sitio, el mismo del blog y del panel.
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "");

const PASOS = ["inicio", "uno", "dos", "tres", "cuatro"];
const OPCIONES = [
  ["contabilidad", "Contabilidad", "una consulta sobre contabilidad"],
  ["impuestos", "Impuestos", "una consulta sobre impuestos"],
  ["empresa", "Abrir una empresa", "una consulta para abrir una empresa"],
  ["otro", "Otro tema", "una consulta"],
];

// Los renglones del panel verde, con el texto pulido de «Pase» (Omar, 21 oct 2026).
const RENGLONES = [
  ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z", "Contabilidad al día, cada mes", "Tus números en orden y un ejecutivo propio que conoce tu negocio."],
  ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5", "Impuestos sin sorpresas", "IVA, renta, IPJ y patentes presentados a tiempo. Nosotros llevamos las fechas."],
  ["M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6", "Tu empresa en regla", "Desde la constitución hasta el RTBF y la inscripción PYME, en un solo lugar."],
];

const VISTO = "M5 12.5l4.5 4.5L19 7.5";
const ESTRELLA = "M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7z";

function Icono({ d, tam = 18, grosor = 2.4, color = "currentColor", visto }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} className={visto ? "en-visto" : undefined} pathLength={visto ? 1 : undefined} />
    </svg>
  );
}

function Logo({ tam, oscuro }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/Logo-blanco.svg" alt="" width={tam} height={tam} className="en-logo" style={{ width: tam, height: tam, filter: oscuro ? "brightness(0)" : "brightness(0) invert(1)" }} />;
}

/**
 * La conversación del enlace personal. `nombre` es el nombre de pila del
 * afiliado y `nombreYApellido` lo que va en el WhatsApp; los dos vienen vacíos
 * si el código no existe o el afiliado está pausado, y la página sale igual,
 * sin nombre (Omar, 20 oct 2026).
 */
export default function Enlace({ codigo, nombre, nombreYApellido, resumenGoogle }) {
  const conNombre = Boolean(nombre);
  const [paso, setPaso] = useState("inicio");
  const [atras, setAtras] = useState(false);
  const [vuelta, setVuelta] = useState(0);
  const [f, setF] = useState({ nombre: "", empresa: "", necesita: "", contacto: "", acepta: false, sitioWeb: "" });
  const [error, setError] = useState("");
  const [falla, setFalla] = useState("");
  const [enviando, setEnviando] = useState(false);
  const msEnPantalla = useTiempoEnPantalla();
  const relojes = useRef([]);
  const cuerpo = useRef(null);

  // El navegador recuerda el código 90 días; gana el primero (lib/enlaceAfiliado.js).
  useEffect(() => {
    recordarCodigo(codigo);
  }, [codigo]);
  useEffect(() => () => relojes.current.forEach(clearTimeout), []);

  const i = PASOS.indexOf(paso);
  const ir = (p) => {
    setAtras(PASOS.indexOf(p) < i);
    setVuelta((v) => v + 1);
    setError("");
    setFalla("");
    setPaso(p);
    relojes.current.push(setTimeout(() => cuerpo.current?.querySelector("input:not([type=checkbox])")?.focus({ preventScroll: true }), 60));
  };
  const poner = (k, v) => {
    setF((x) => ({ ...x, [k]: v }));
    if (error === k) setError("");
  };

  const contacto = f.contacto.trim();
  const esCorreo = contacto.includes("@");
  const validos = {
    nombre: Boolean(f.nombre.trim()),
    necesita: Boolean(f.necesita),
    contacto: esCorreo ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto) : [8, 11].includes(contacto.replace(/\D/g, "").length),
    acepta: f.acepta,
  };
  const exigir = (campos) => {
    const malo = campos.find((c) => !validos[c]);
    setError(malo || "");
    return !malo;
  };

  async function enviar() {
    if (enviando || !exigir(["nombre", "necesita", "contacto", "acepta"])) return;
    setEnviando(true);
    setFalla("");
    const r = await enviarAlErp({
      tipo: "enlace",
      acepta: true,
      sitioWeb: f.sitioWeb,
      msEnPantalla: msEnPantalla(),
      nombre: f.nombre.trim(),
      empresa: f.empresa.trim(),
      necesita: f.necesita,
      contacto,
      afiliado: codigo,
    });
    setEnviando(false);
    if (!r.ok) {
      setFalla(r.error);
      return;
    }
    setAtras(false);
    setVuelta((v) => v + 1);
    setPaso("gracias");
  }

  function seguir(e) {
    e?.preventDefault();
    if (paso === "inicio") return ir("uno");
    if (paso === "uno") return exigir(["nombre"]) && ir("dos");
    if (paso === "dos") return exigir(["necesita"]) && ir("tres");
    if (paso === "tres") return exigir(["contacto"]) && ir("cuatro");
    if (paso === "cuatro") enviar();
  }

  const primer = f.nombre.trim().split(/\s+/)[0] || "";
  const opcion = OPCIONES.find(([id]) => id === f.necesita);
  const quien = f.nombre.trim() + (f.empresa.trim() ? ` · ${f.empresa.trim()}` : "");
  const mensajeWa = [`Hola, soy ${primer || f.nombre.trim()}${f.empresa.trim() ? `, de ${f.empresa.trim()}` : ""}.`, nombreYApellido ? `Me recomendó ${nombreYApellido} y me interesa ${opcion?.[2] || "una consulta"}.` : `Me interesa ${opcion?.[2] || "una consulta"}.`].join(" ");
  const anim = `${atras ? "enVuelve" : "enEntra"} 380ms cubic-bezier(0.22,1,0.36,1) backwards`;
  const titulo = conNombre ? `${nombre} te recomendó a JRC Consulting Group` : "Te recomendaron a JRC Consulting Group";
  const calificacion = resumenGoogle?.calificacion ? Number(resumenGoogle.calificacion).toFixed(1).replace(".", ",") : "";

  const estrellas = calificacion ? (
    <>
      <strong>{calificacion}</strong> en Google · {resumenGoogle.totalOpiniones} opiniones
    </>
  ) : null;

  return (
    <div className="en">
      <div className="en-grid">
        <aside className="en-lado">
          <a href="/" aria-label="JRC Consulting Group, ir a jrc.cr" className="en-marca">
            <Logo tam={40} />
            <span className="en-marca-txt">JRC Consulting Group</span>
          </a>
          <div className="en-sube">
            <p className="en-lado-t">Contabilidad, impuestos y constitución de empresas en Costa Rica.</p>
            <ul className="en-renglones">
              {RENGLONES.map(([d, t, l]) => (
                <li key={t}>
                  <span aria-hidden="true" className="en-renglon-ico">
                    <Icono d={d} tam={19} grosor={2} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="en-renglon-t">{t}</span>
                    <span className="en-renglon-d">{l}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="en-lado-pie">
            {estrellas && (
              <span className="en-estrella">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path fill="#ffffff" d={ESTRELLA} />
                </svg>
                <span>{estrellas}</span>
              </span>
            )}
            <span>Escazú y Tamarindo</span>
          </div>
        </aside>

        <section className="en-main">
          <div className="en-movil en-marca-movil" style={{ alignItems: "center" }}>
            <a href="/" aria-label="JRC Consulting Group, ir a jrc.cr" className="en-marca" style={{ gap: 10, color: "var(--en-tinta)", textDecoration: "none" }}>
              <Logo tam={36} oscuro />
              <span aria-hidden="true" style={{ width: 1, height: 22, background: "#d5dcd8" }} />
              <span className="en-marca-txt" style={{ letterSpacing: "-0.01em" }}>
                JRC Consulting Group
              </span>
            </a>
          </div>

          {i >= 1 && (
            <div className="en-avance">
              <div role="progressbar" aria-label="Avance" aria-valuemin={1} aria-valuemax={4} aria-valuenow={i} className="en-tramos">
                {[1, 2, 3, 4].map((k) => (
                  <span key={k} className={`en-tramo${k <= i ? " es-lleno" : ""}`} />
                ))}
              </div>
              <span className="en-avance-n">{i} de 4</span>
            </div>
          )}

          <div ref={cuerpo} className={`en-cuerpo${paso === "inicio" ? " es-inicio" : ""}${paso === "gracias" ? " es-gracias" : ""}`}>
            {paso === "inicio" && (
              <div className="en-sube">
                <h1 className="en-h1">{titulo}</h1>
                <p className="en-intro">
                  Contestá cuatro preguntas y te contactamos para una <strong>primera consulta gratuita</strong>.
                </p>
                <ul className="en-movil en-lista">
                  <li>
                    <Icono d={VISTO} color="#305832" />
                    Contabilidad, impuestos y constitución
                  </li>
                  {estrellas && (
                    <li>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ margin: "0 1px" }}>
                        <path fill="#305832" d={ESTRELLA} />
                      </svg>
                      <span>{estrellas}</span>
                    </li>
                  )}
                  <li>
                    <Icono d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" color="#305832" grosor={2} />
                    Escazú y Tamarindo
                  </li>
                </ul>
              </div>
            )}

            {paso === "uno" && (
              <form key={`u${vuelta}`} onSubmit={seguir} noValidate className="en-paso" style={{ animation: anim }}>
                <h2 className="en-pregunta">¿Cómo te llamás?</h2>
                <div>
                  <label htmlFor="en-nombre" className="en-rot">
                    Tu nombre
                  </label>
                  <input id="en-nombre" className="en-campo" type="text" autoComplete="name" maxLength={120} value={f.nombre} onChange={(e) => poner("nombre", e.target.value)} aria-invalid={error === "nombre" ? "true" : "false"} />
                  {error === "nombre" && (
                    <span className="en-error" role="alert">
                      Escribí tu nombre.
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="en-empresa" className="en-rot">
                    Empresa o nombre comercial <span className="en-opc">(opcional)</span>
                  </label>
                  <input id="en-empresa" className="en-campo" type="text" autoComplete="organization" maxLength={120} value={f.empresa} onChange={(e) => poner("empresa", e.target.value)} />
                </div>
                <button type="submit" aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: -9999 }} />
              </form>
            )}

            {paso === "dos" && (
              <div key={`d${vuelta}`} className="en-paso" style={{ animation: anim }}>
                <h2 className="en-pregunta">{`Hola, ${primer}. ¿Con qué te ayudamos?`}</h2>
                <div className={`en-opciones${error === "necesita" ? " es-error" : ""}`} role="group" aria-label="Con qué te ayudamos">
                  {OPCIONES.map(([id, txt]) => (
                    <button
                      key={id}
                      type="button"
                      className="en-opcion"
                      aria-pressed={f.necesita === id ? "true" : "false"}
                      onClick={() => {
                        poner("necesita", id);
                        relojes.current.push(setTimeout(() => ir("tres"), 240));
                      }}
                    >
                      {txt}
                      <Icono d="M5 12h14M13 6l6 6-6 6" />
                    </button>
                  ))}
                </div>
                {error === "necesita" && (
                  <span className="en-error" role="alert">
                    Elegí una opción.
                  </span>
                )}
              </div>
            )}

            {paso === "tres" && (
              <form key={`t${vuelta}`} onSubmit={seguir} noValidate className="en-paso" style={{ animation: anim }}>
                <h2 className="en-pregunta">¿A qué WhatsApp o correo te escribimos?</h2>
                <div>
                  <label htmlFor="en-contacto" className="en-rot">
                    WhatsApp o correo
                  </label>
                  <input id="en-contacto" className="en-campo" type="text" autoComplete="tel" placeholder="8888 8888" maxLength={160} value={f.contacto} onChange={(e) => poner("contacto", e.target.value)} aria-invalid={error === "contacto" ? "true" : "false"} />
                  {error === "contacto" && (
                    <span className="en-error" role="alert">
                      Escribí un WhatsApp de 8 dígitos o un correo.
                    </span>
                  )}
                </div>
                <button type="submit" aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: -9999 }} />
              </form>
            )}

            {paso === "cuatro" && (
              <div key={`c${vuelta}`} className="en-paso" style={{ animation: anim, gap: 18 }}>
                <h2 className="en-pregunta">Último paso</h2>
                <dl className="en-resumen">
                  {[
                    ["Quién", quien, "Cambiar nombre", "uno"],
                    ["Con qué", opcion?.[1] || "", "Cambiar con qué te ayudamos", "dos"],
                    ["Contacto", contacto, "Cambiar WhatsApp o correo", "tres"],
                  ].map(([rot, val, aria, p]) => (
                    <div key={rot}>
                      <dt>{rot}</dt>
                      <dd>{val}</dd>
                      <button type="button" className="en-cambiar" aria-label={aria} onClick={() => ir(p)}>
                        Cambiar
                      </button>
                    </div>
                  ))}
                </dl>
                <div>
                  <label className={`en-casilla${error === "acepta" ? " es-error" : ""}`}>
                    <input type="checkbox" checked={f.acepta} onChange={(e) => poner("acepta", e.target.checked)} />
                    <span>
                      Acepto la{" "}
                      <a href="/privacidad" target="_blank" rel="noopener">
                        Política de Privacidad
                      </a>{" "}
                      y los{" "}
                      <a href="/terminos" target="_blank" rel="noopener">
                        Términos y Condiciones
                      </a>
                      , y que JRC me contacte sobre esta solicitud.
                    </span>
                  </label>
                  {error === "acepta" && (
                    <span className="en-error" role="alert">
                      Marcá la casilla para que te podamos contactar.
                    </span>
                  )}
                </div>
                {conNombre && (
                  <p className="en-privado">
                    <Icono d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" color="#305832" grosor={2} />
                    <span>{nombreYApellido || nombre} va a ver que llegaste y cómo avanza. Nunca tus datos de contacto ni montos.</span>
                  </p>
                )}
                <div className="en-trampa" aria-hidden="true">
                  <label htmlFor="en-sitio">Sitio web</label>
                  <input id="en-sitio" type="text" tabIndex={-1} autoComplete="off" value={f.sitioWeb} onChange={(e) => poner("sitioWeb", e.target.value)} />
                </div>
                {falla && (
                  <p role="alert" className="en-falla" style={{ margin: 0 }}>
                    {falla}
                  </p>
                )}
              </div>
            )}

            {paso === "gracias" && (
              <div className="en-gracias en-sube" role="status">
                <span aria-hidden="true" className="en-gracias-circulo" style={{ animation: "enCirculo 480ms cubic-bezier(0.22,1,0.36,1) backwards" }}>
                  <Icono d={VISTO} tam={28} grosor={2.8} color="#ffffff" visto />
                </span>
                <h2>Listo, {primer}</h2>
                <p>{esCorreo ? `Te vamos a escribir a ${contacto} para coordinar tu consulta gratuita.` : `Te vamos a escribir al WhatsApp ${contacto} para coordinar tu consulta gratuita.`}</p>
                {WHATSAPP && (
                  <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensajeWa)}`} target="_blank" rel="noopener noreferrer" className="en-wa en-btn">
                    <Icono d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" grosor={2} />
                    Escribinos por WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          {paso !== "gracias" && (
            <div className="en-pie">
              {i >= 1 && (
                <button type="button" onClick={() => ir(PASOS[Math.max(0, i - 1)])} className="en-atras en-btn" aria-label="Atrás">
                  <Icono d="M19 12H5M11 6l-6 6 6 6" tam={16} />
                  <span className="en-atras-txt">Atrás</span>
                </button>
              )}
              <button type="button" onClick={seguir} className="en-seguir en-btn" aria-busy={enviando ? "true" : "false"}>
                {paso === "inicio" ? "Empezar" : paso === "cuatro" ? "Quiero que me contacten" : "Seguir"}
                {enviando ? <span className="en-gira" aria-hidden="true" /> : <Icono d="M5 12h14M13 6l6 6-6 6" />}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
