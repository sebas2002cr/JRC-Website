"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { T } from "./textos";
import { cargarTodo, guardarIdioma, guardarToken, idiomaGuardado, pedir, tokenGuardado } from "./api";
import { Logo, quieto } from "./comun";
import Login from "./Login";
import Tablero from "./Tablero";
import { Cajon, Perfil, Recomendar } from "./Cajones";

const CURVA = "cubic-bezier(.22,1,.36,1)";
const SALE = [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-4px)" }];
const ENTRA = [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }];

/**
 * Los textos visibles de la pantalla: los elementos que tienen texto propio.
 * Al cambiar de idioma salen y entran como en la consulta tributaria
 * (cst/consulta-situacion-tributaria/src/main.js, cambiarIdioma).
 */
function textosVisibles(raiz) {
  if (!raiz) return [];
  const salida = [];
  for (const el of raiz.querySelectorAll("h1, h2, h3, p, span, a, button, label, dt, dd, div")) {
    if (salida.length >= 90) break;
    if (el.closest(".pn-velo, .pn-idioma, .pn-cifra")) continue;
    const propio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!propio || !el.getClientRects().length) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) continue;
    salida.push(el);
  }
  return salida;
}

/**
 * El panel de los afiliados. Tres vistas: cargando (hay un token guardado y se
 * piden los datos), entrar (el login) y el tablero, más el velo que cubre los
 * cambios de una a otra y el cajón de la derecha.
 *
 * `legales` son los enlaces del pie que están publicados (los decide el
 * servidor con las mismas banderas que el resto del sitio).
 */
export default function Panel({ legales }) {
  const [idioma, setIdioma] = useState("es");
  const [vista, setVista] = useState("inicio");
  const [token, setToken] = useState("");
  const [datos, setDatos] = useState(null);
  const [falla, setFalla] = useState("");
  const [aviso, setAviso] = useState("");
  const [velo, setVelo] = useState(null);
  const [cajon, setCajon] = useState(null);
  const [cerrando, setCerrando] = useState(false);
  const [tab, setTab] = useState({ id: "rec", atras: false, vez: 0 });
  const [filtro, setFiltro] = useState({ id: "todos", vez: 0 });
  const [vueltaLogin, setVueltaLogin] = useState(0);
  const raiz = useRef(null);
  const relojes = useRef([]);
  const idiomaTocado = useRef(false);
  const cambiando = useRef(false);
  const despues = (ms, fn) => relojes.current.push(setTimeout(fn, ms));
  useEffect(() => () => relojes.current.forEach(clearTimeout), []);

  // Al abrir: el idioma de este navegador y, si quedó una sesión en la pestaña, el panel.
  useEffect(() => {
    setIdioma(idiomaGuardado());
    const guardado = tokenGuardado();
    if (!guardado) {
      setVista("entrar");
      return;
    }
    setToken(guardado);
    setVista("cargando");
    cargarTodo(guardado).then((r) => {
      if (r.vencida) {
        guardarToken("");
        setVista("entrar");
        return;
      }
      if (r.error) {
        setFalla(r.error);
        return;
      }
      setIdioma(r.yo.afiliado.idioma || "es");
      setDatos(r);
      setVista("panel");
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma === "en" ? "en" : "es-CR";
  }, [idioma]);

  const t = T[idioma];

  /** El idioma con la animación de la consulta tributaria: los textos salen, se cambian y entran. */
  const ponerIdioma = useCallback(
    async (l, { guardar = false } = {}) => {
      if (l === idioma || cambiando.current) return;
      cambiando.current = true;
      guardarIdioma(l);
      const animar = !quieto();
      let salidas = [];
      if (animar) {
        salidas = textosVisibles(raiz.current).map((el) => el.animate(SALE, { duration: 170, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }));
        await Promise.all(salidas.map((a) => a.finished.catch(() => {})));
      }
      flushSync(() => setIdioma(l));
      if (animar) {
        textosVisibles(raiz.current).forEach((el, i) => el.animate(ENTRA, { duration: 460, delay: 40 + Math.min(i * 24, 340), easing: CURVA, fill: "backwards" }));
        salidas.forEach((a) => a.cancel());
      }
      cambiando.current = false;
      if (guardar && token) {
        const r = await pedir("PUT", "/panel/perfil", { token, cuerpo: { idioma: l } });
        if (r.ok) setDatos((d) => (d ? { ...d, yo: { ...d.yo, afiliado: { ...d.yo.afiliado, idioma: l } }, perfil: { ...d.perfil, idioma: l } } : d));
      }
    },
    [idioma, token]
  );

  /** El velo: crece desde `desde` (o cubre la pantalla), cambia la vista y se va. */
  function conVelo(desde, texto, cambiar) {
    const r = desde?.getBoundingClientRect();
    const rad = desde ? parseFloat(getComputedStyle(desde).borderTopLeftRadius) || 26 : 0;
    const marco = r ? { t: r.top, l: r.left, d: window.innerWidth - r.right, b: window.innerHeight - r.bottom, rad } : null;
    setVelo({ fase: marco ? "crece" : "cubre", texto, marco });
    return new Promise((listo) => {
      despues(marco ? 1050 : 820, async () => {
        await cambiar();
        setVelo((v) => (v ? { ...v, fase: "sale" } : v));
        despues(460, () => setVelo(null));
        listo();
      });
    });
  }

  async function alEntrar({ token: nuevo, desde }) {
    guardarToken(nuevo);
    setToken(nuevo);
    const carga = cargarTodo(nuevo);
    await conVelo(desde, T[idioma].panelNombre, async () => {
      const r = await carga;
      if (r.vencida || r.error) {
        setFalla(r.error || "sinConexion");
        return;
      }
      // Si eligió el idioma en el login, queda en su ficha; si no, manda el de la ficha.
      let l = r.yo.afiliado.idioma || "es";
      if (idiomaTocado.current && idioma !== l) {
        l = idioma;
        pedir("PUT", "/panel/perfil", { token: nuevo, cuerpo: { idioma: l } });
      }
      guardarIdioma(l);
      setIdioma(l);
      setTab({ id: "rec", atras: false, vez: 0 });
      setFiltro({ id: "todos", vez: 0 });
      setDatos(r);
      setVista("panel");
      setAviso("");
    });
  }

  const vencer = useCallback(() => {
    guardarToken("");
    setToken("");
    setCajon(null);
    setDatos(null);
    setAviso(T[idioma].sesionVencida);
    setVueltaLogin((v) => v + 1);
    setVista("entrar");
  }, [idioma]);

  async function salir() {
    const nombre = datos?.yo?.afiliado?.primerNombre || "";
    const viejo = token;
    setCajon(null);
    if (viejo) pedir("POST", "/panel/salir", { token: viejo });
    guardarToken("");
    await conVelo(null, T[idioma].hastaPronto(nombre), async () => {
      setToken("");
      setDatos(null);
      setAviso("");
      setVueltaLogin((v) => v + 1);
      setVista("entrar");
    });
  }

  const cerrarCajon = useCallback(() => {
    if (quieto()) {
      setCajon(null);
      return;
    }
    setCerrando(true);
    despues(250, () => {
      setCajon(null);
      setCerrando(false);
    });
  }, []);

  async function refrescarRecomendados() {
    const r = await pedir("GET", "/panel/recomendados", { token });
    if (r.ok) {
      setDatos((d) => ({ ...d, recomendados: r.datos }));
      setTab((x) => (x.id === "rec" ? x : { id: "rec", atras: false, vez: x.vez + 1 }));
      setFiltro((f) => ({ id: "todos", vez: f.vez + 1 }));
    }
  }

  return (
    <div ref={raiz} className="pn">
      {falla && (
        <div className="pn-falla">
          <div>
            <Logo tam={56} />
            <p style={{ marginTop: 18 }} role="alert">
              {falla === "tarda" ? t.tarda : t.sinConexion}
            </p>
            <button type="button" className="pn-btn pn-claro" onClick={() => window.location.reload()}>
              {t.reintentar}
            </button>
          </div>
        </div>
      )}

      {!falla && vista === "cargando" && (
        <div className="pn-tablero" aria-busy="true">
          <span className="pn-oculto">{t.cargando}</span>
        </div>
      )}

      {!falla && vista === "entrar" && (
        <Login
          key={vueltaLogin}
          idioma={idioma}
          alIdioma={(l) => {
            idiomaTocado.current = true;
            ponerIdioma(l);
          }}
          alEntrar={alEntrar}
          legales={legales}
          mensaje={aviso}
        />
      )}

      {!falla && vista === "panel" && datos && (
        <Tablero
          datos={datos}
          idioma={idioma}
          alSalir={salir}
          alPerfil={() => setCajon("perfil")}
          alRecomendar={() => setCajon("recomendar")}
          tab={tab}
          alTab={setTab}
          filtro={filtro}
          alFiltro={setFiltro}
        />
      )}

      {cajon && datos && (
        <Cajon titulo={cajon === "perfil" ? t.tuPerfil : t.recomendarTitulo} alCerrar={cerrarCajon} cerrando={cerrando}>
          {cajon === "recomendar" ? (
            <Recomendar idioma={idioma} token={token} alCerrar={cerrarCajon} alRecomendo={refrescarRecomendados} alVencer={vencer} />
          ) : (
            <Perfil
              idioma={idioma}
              token={token}
              perfil={datos.perfil}
              saludo={datos.yo.afiliado.saludo}
              alCerrar={cerrarCajon}
              alSalir={salir}
              alIdioma={(l) => ponerIdioma(l, { guardar: true })}
              alCambio={(c) => setDatos((d) => ({ ...d, perfil: { ...d.perfil, ...c } }))}
              alVencer={vencer}
            />
          )}
        </Cajon>
      )}

      {velo && (
        <div
          aria-hidden="true"
          className={`pn-velo es-${velo.fase}`}
          style={velo.marco ? { "--t": `${velo.marco.t}px`, "--l": `${velo.marco.l}px`, "--d": `${velo.marco.d}px`, "--b": `${velo.marco.b}px`, "--rad": `${velo.marco.rad}px` } : undefined}
        >
          <div className="pn-velo-in">
            <span className="pn-logo-entra">
              <Logo tam={104} />
            </span>
            <span className="pn-velo-linea pn-linea" />
            <span className="pn-velo-txt pn-logo-entra">{velo.texto}</span>
          </div>
        </div>
      )}
    </div>
  );
}
