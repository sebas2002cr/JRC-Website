"use client";

import { useMemo, useRef, useState } from "react";
import { T, nombreMes, diaCorto, diaConNombre, diaDe, monto, pct, iniciales, cuentaEn } from "./textos";
import { Icono, ICONOS, Logo, Tarjeta, useCuenta } from "./comun";

const TINTA = { recomendado: "#c3ccc8", enConversacion: "#a9c4ff", yaEsCliente: "#bfeccd", teGeneroComision: "#6fe0a6", noSeDio: "#eba79e" };
const DE_A = 5;
// La tarjeta se da vuelta sola: a los 5 s muestra lo ganado en total, se queda
// 6 s y vuelve al mes; después repite cada 14 s (Tarjeta en comun.js).
const GIRO_SOLO = { espera: 5000, frente: 14000, atras: 6000 };
// Tres filtros por lo que el afiliado quiere saber (22 oct 2026, Omar): quién le
// genera plata (Clientes, de fábrica), qué está avanzando (En proceso) y qué no
// salió. No se pisan y entre los tres cubren todo; cada fila dice su estado exacto.
const FILTROS = [
  ["clientes", new Set(["yaEsCliente", "teGeneroComision"]), "teGeneroComision"],
  ["enProceso", new Set(["recomendado", "enConversacion"]), "enConversacion"],
  ["noSeDio", new Set(["noSeDio"]), "noSeDio"],
];

/** «Primeros días de Noviembre» o «El último día de Octubre», de la fecha del cierre. */
function cuandoSePaga(cierre, t, l) {
  const d = String(cierre || "");
  if (!d) return "";
  const dia = Number(d.slice(8, 10));
  return dia >= 28 ? t.elUltimoDia(nombreMes(d.slice(0, 7), l)) : t.primerosDias(nombreMes(d.slice(0, 7), l));
}

/** La nota corta de cada recomendado, sin nada de lo que Comercial anotó. */
function notaDe(r, t, l) {
  if (r.estado === "recomendado") return r.nota === "revisando" ? t.notas.revisando : r.porTuEnlace ? t.notas.porTuEnlace : t.notas.porContactar;
  if (r.estado === "enConversacion") return r.reunion ? t.notas.reunion(diaConNombre(r.reunion, l)) : t.notas.conversando;
  // Ligado a mano: ya era cliente antes del programa, no «falta su primer pago».
  if (r.estado === "yaEsCliente") return r.nota === "clienteDesde" && r.clienteDesde ? t.notas.clienteDesde(nombreMes(r.clienteDesde.slice(0, 7), l)) : t.notas.faltaPago;
  if (r.estado === "teGeneroComision") return r.clienteDesde ? t.notas.clienteDesde(nombreMes(r.clienteDesde.slice(0, 7), l)) : "";
  if (r.nota === "yaEnContacto") return t.notas.yaEnContacto;
  return r.nota === "yaEraCliente" ? t.notas.yaEraCliente : t.notas.noSiguio;
}

export default function Tablero({ datos, idioma, alSalir, alPerfil, alRecomendar, mirando = false, tab, alTab, filtro, alFiltro }) {
  const t = T[idioma];
  const { yo, recomendados, pagos, perfil } = datos;
  const a = yo.afiliado;
  const moneda = a.moneda;
  const lista = recomendados.recomendados || [];
  const nuevo = lista.length === 0;
  const mesHoy = yo.esteMes.mes;
  const total = useCuenta(Number(yo.esteMes.total) || 0);
  // El reverso muestra todo lo ganado (9 nov 2026). Sin comisiones todavía, o
  // con un backend que aún no lo manda, el reverso queda como era y no gira solo.
  const ganado = Number(yo.ganado?.total) || 0;
  const [copiado, setCopiado] = useState(false);
  const relojCopia = useRef(0);

  const copiar = async () => {
    const url = a.enlace?.url || "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const campo = document.createElement("textarea");
      campo.value = url;
      document.body.appendChild(campo);
      campo.select();
      try {
        document.execCommand("copy");
      } catch {
        /* sin portapapeles: el enlace se ve en la tarjeta */
      }
      campo.remove();
    }
    setCopiado(true);
    clearTimeout(relojCopia.current);
    relojCopia.current = setTimeout(() => setCopiado(false), 1800);
  };

  const reglas = a.reglas;
  const TABS = [
    ["rec", t.tabs.rec],
    ["mes", t.tabs.mes],
    ["pag", t.tabs.pag],
  ];
  const iTab = Math.max(0, TABS.findIndex(([id]) => id === tab.id));

  return (
    <div className="pn-tablero">
      <header className="pn-barra pn-aparece">
        <div className="pn-barra-in">
          <button type="button" onClick={alSalir} aria-label={t.salirDelPanel} className="pn-salir pn-btn">
            <Icono d={ICONOS.atras} />
            <span className="pn-txt">{t.salir}</span>
          </button>
          <span aria-hidden="true" className="pn-sep" />
          <Logo tam={34} alt="JRC Consulting Group" />
          <span className="pn-txt" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--pn-claro)" }}>
            {t.panelNombre}
          </span>
          <span className="pn-hola-barra pn-txt">{t.hola(a.saludo)}</span>
          <button type="button" onClick={alPerfil} aria-label={t.tuPerfil} className="pn-avatar pn-btn">
            {iniciales(a.saludo || a.nombre)}
          </button>
        </div>
        {/* «Ver su panel» (H10): lo ve solo quien entró desde el ERP, siempre en español. */}
        {mirando && (
          <div className="pn-vista" role="status">
            <span className="pn-vista-in">
              <strong>Vista de JRC · solo lectura.</strong> {a.saludo} no se entera de que entraste.
            </span>
          </div>
        )}
      </header>

      <main className="pn-main">
        <div className="pn-cuerpo">
          <div className="pn-izq">
            <Tarjeta
              className="pn-sube"
              rotulo={ganado > 0 ? `${t.tarjetaGirar}. ${t.ganadoTotal}: ${monto(ganado, moneda, idioma)}` : t.tarjetaGirar}
              solo={ganado > 0 ? GIRO_SOLO : null}
              reverso={
                <>
                  <span aria-hidden="true" className="pn-banda" />
                  {ganado > 0 ? (
                    <div className="pn-rev-medio">
                      <div className="pn-rev-total">
                        <div className="pn-rev-rot">{t.ganadoTotal}</div>
                        <div className="pn-cifra">{monto(ganado, moneda, idioma)}</div>
                      </div>
                      <span aria-hidden="true" className="pn-holo" />
                    </div>
                  ) : (
                    <div className="pn-rev-medio">
                      <span className="pn-firma">{a.saludo}</span>
                      <span aria-hidden="true" className="pn-holo" />
                    </div>
                  )}
                  <div className="pn-rev-pie">
                    {a.categoria ? <span className="pn-chip-cat">{a.categoria}</span> : <span />}
                    {a.desde && <span>{`${t.afiliadoDesde} ${nombreMes(a.desde, idioma)} ${a.desde.slice(0, 4)}`}</span>}
                  </div>
                </>
              }
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Logo tam={38} />
                {a.categoria && <span className="pn-chip-cat">{a.categoria}</span>}
              </div>
              <div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)" }}>{t.llevasEn(nombreMes(mesHoy, idioma))}</div>
                <div className="pn-cifra">{monto(total, moneda, idioma)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10, fontSize: 13.5 }}>
                <span style={{ fontWeight: 600 }}>{a.saludo}</span>
                <span style={{ color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{(a.enlace?.url || "").replace(/^https?:\/\//, "")}</span>
              </div>
            </Tarjeta>

            <div className={`pn-dos pn-sube${alRecomendar ? "" : " es-uno"}`}>
              <button type="button" onClick={copiar} className="pn-btn pn-copiar" aria-live="polite">
                {copiado ? (
                  <>
                    <Icono d={ICONOS.visto} color="#6fe0a6" grosor={2.6} visto />
                    <span style={{ color: "#6fe0a6" }}>{t.copiado}</span>
                  </>
                ) : (
                  <>
                    <Icono d={ICONOS.enlace} />
                    {t.copiar}
                  </>
                )}
              </button>
              {alRecomendar && (
                <button type="button" onClick={alRecomendar} className="pn-btn pn-claro">
                  <Icono d={ICONOS.mas} grosor={2.4} />
                  {t.recomendar}
                </button>
              )}
            </div>

            <div className="pn-info pn-sube">
              {nuevo ? (
                <>
                  <div className="pn-info-t">{t.comoGanas}</div>
                  {reglas?.mensualidad && (
                    <div className="pn-regla">
                      <span>{t.mensualidades}</span>
                      <span>{pct(reglas.mensualidad.pct, idioma)}</span>
                    </div>
                  )}
                  {/* Con los dos porcentajes iguales el límite no cambia nada: un solo renglón. */}
                  {reglas?.adicionales && Number(reglas.adicionales.pctHasta) === Number(reglas.adicionales.pctArriba) && (
                    <div className="pn-regla">
                      <span>{t.serviciosTodos}</span>
                      <span>{pct(reglas.adicionales.pctHasta, idioma)}</span>
                    </div>
                  )}
                  {reglas?.adicionales && Number(reglas.adicionales.pctHasta) !== Number(reglas.adicionales.pctArriba) && (
                    <>
                      <div className="pn-regla">
                        <span>{t.serviciosHasta(monto(reglas.adicionales.limiteUsd, "USD", idioma).replace(/[.,]00$/, ""))}</span>
                        <span>{pct(reglas.adicionales.pctHasta, idioma)}</span>
                      </div>
                      <div className="pn-regla">
                        <span>{t.serviciosDeMas}</span>
                        <span>{pct(reglas.adicionales.pctArriba, idioma)}</span>
                      </div>
                    </>
                  )}
                  {reglas?.duracion && <div className="pn-regla-d">{t.duracion(reglas.duracion)}</div>}
                </>
              ) : (
                <>
                  <div className="pn-info-fila">
                    <span>{t.proximoPago}</span>
                    <span>{cuandoSePaga(yo.esteMes.cierre, t, idioma)}</span>
                  </div>
                  <div className="pn-info-fila">
                    <span>{perfil.descuento ? t.tePagamosCon : t.seDeposita}</span>
                    <span>{perfil.descuento ? t.descuentoFactura : perfil.cuenta ? cuentaEn(perfil.cuenta.descripcion, idioma) : t.sinCuenta}</span>
                  </div>
                  <div className="pn-info-fila">
                    <span>{t.recibidoEn(pagos.anio)}</span>
                    <span className="pn-num pn-verde">{monto(pagos.pagadoEnAnio, moneda, idioma)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            {nuevo ? (
              <section className="pn-nuevo pn-sube">
                <h1>{t.bienvenida(a.primerNombre || a.saludo)}</h1>
                <p>{t.bienvenidaTexto}</p>
                <ol className="pn-pasos">
                  {[
                    [t.paso1, t.paso1d],
                    [t.paso2, t.paso2d],
                    [t.paso3, t.paso3d],
                  ].map(([titulo, d], i) => (
                    <li key={titulo}>
                      <span className="pn-paso-n">{i + 1}</span>
                      <span>
                        <span className="pn-paso-t">{titulo}</span>
                        <span className="pn-paso-d">{d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : (
              <>
                <div className="pn-tabs pn-sube" role="tablist" aria-label={t.panelNombre}>
                  <span aria-hidden="true" className="pn-tabs-ind" style={{ transform: `translateX(${iTab * 100}%)` }} />
                  {TABS.map(([id, nombre], i) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      id={`pn-tab-${id}`}
                      aria-selected={tab.id === id ? "true" : "false"}
                      aria-controls="pn-tab-cuerpo"
                      onClick={() => tab.id !== id && alTab({ id, atras: i < iTab, vez: tab.vez + 1 })}
                    >
                      {nombre}
                    </button>
                  ))}
                </div>
                <div
                  key={`${tab.id}-${tab.vez}`}
                  id="pn-tab-cuerpo"
                  role="tabpanel"
                  aria-labelledby={`pn-tab-${tab.id}`}
                  style={{ animation: `${tab.atras ? "pnVuelve" : "pnPaso"}${tab.vez % 2 ? "A" : "B"} 380ms cubic-bezier(0.22,1,0.36,1) backwards` }}
                >
                  {tab.id === "mes" && <Historial yo={yo} idioma={idioma} />}
                  {tab.id === "rec" && <Recomendados lista={lista} idioma={idioma} moneda={moneda} filtro={filtro} alFiltro={alFiltro} />}
                  {tab.id === "pag" && <Pagos yo={yo} pagos={pagos} idioma={idioma} />}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/** «2026-09» de «2026-10» y -1. */
function moverMes(mes, n) {
  const [a, m] = String(mes).split("-").map(Number);
  const t = a * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

const MESES_DE_A = 6;

/** Las comisiones de un mes, una por fila, con su total abajo. */
function LineasDelMes({ lineas, moneda, idioma, total, rotuloTotal, desde = 0 }) {
  const t = T[idioma];
  return (
    <>
      {lineas.map((l, i) => (
        <div key={l.id} className="pn-suma pn-sube" style={{ animationDelay: `${desde + Math.min(i, 8) * 60}ms` }}>
          <span aria-hidden="true" className="pn-suma-ico">
            <Icono d={l.tipo === "mensualidad" ? ICONOS.mensualidad : ICONOS.adicional} tam={17} grosor={2} />
          </span>
          <span style={{ flex: "1 1 auto", minWidth: 0 }}>
            <span className="pn-suma-c">{l.cliente}</span>
            <span className="pn-suma-q">
              {l.reversa ? t.reversa : t.servicio[l.tipo === "mensualidad" ? "mensualidad" : "adicional"]}
              {l.pcts?.length ? ` · ${l.pcts.map((p) => pct(p, idioma)).join(" y ")}` : ""}
              {l.dia ? ` · ${diaCorto(l.dia, idioma)}` : ""}
            </span>
          </span>
          <span>
            <span className={`pn-suma-m${l.monto < 0 ? " es-menos" : ""}`}>{monto(l.monto, moneda, idioma)}</span>
            {l.cambio && <span className="pn-suma-cambio">{t.alCambio(monto(l.cambio.monto, l.cambio.moneda, idioma))}</span>}
          </span>
        </div>
      ))}
      {rotuloTotal && (
        <div className="pn-total">
          <span>{rotuloTotal}</span>
          <span className="pn-num pn-verde">{monto(total, moneda, idioma)}</span>
        </div>
      )}
    </>
  );
}

/**
 * Historial (9 nov 2026, antes «Este mes»): lo ganado mes a mes, con Este mes,
 * Mes pasado y Todo, como los filtros de Referidos. «Todo» es un mes por fila
 * con una barra de lo que dejó, para ver cómo se portó cada uno; tocarlo abre
 * sus comisiones. Sin `historial` (un backend viejo) queda solo este mes.
 */
function Historial({ yo, idioma }) {
  const t = T[idioma];
  const moneda = yo.afiliado.moneda;
  const mesHoy = yo.esteMes.mes;
  const meses = Array.isArray(yo.historial) ? yo.historial : yo.esteMes.lineas?.length ? [{ mes: mesHoy, total: yo.esteMes.total, lineas: yo.esteMes.lineas }] : [];
  const deMes = (m) => meses.find((x) => x.mes === m) || { mes: m, total: 0, lineas: [] };
  const este = deMes(mesHoy);
  const pasado = deMes(moverMes(mesHoy, -1));
  const conteo = { este: este.lineas.length, pasado: pasado.lineas.length, todo: meses.reduce((s, x) => s + x.lineas.length, 0) };
  // Sin nada este mes pero con historia, arranca en «Todo» para no abrir vacío.
  const [periodo, setPeriodo] = useState({ id: !conteo.este && conteo.todo ? "todo" : "este", vez: 0 });
  const [abierto, setAbierto] = useState("");
  const [cuantos, setCuantos] = useState(MESES_DE_A);
  const elegir = (id) => id !== periodo.id && setPeriodo((p) => ({ id, vez: p.vez + 1 }));
  const nombreConAnio = (m) => `${nombreMes(m, idioma)} ${m.slice(0, 4)}`;
  const tope = Math.max(...meses.map((x) => x.total), 0);
  const ganado = Number(yo.ganado?.total ?? meses.reduce((s, x) => s + x.total, 0)) || 0;

  return (
    <>
      <div className="pn-chips" role="group" aria-label={t.tabs.mes}>
        {["este", "pasado", "todo"].map((id) => (
          <button key={id} type="button" aria-pressed={periodo.id === id ? "true" : "false"} onClick={() => elegir(id)} className="pn-chip">
            {t.periodos[id]}
            <span className="pn-chip-n">{conteo[id]}</span>
          </button>
        ))}
      </div>
      <div key={`p${periodo.vez}`} className="pn-caja-lista" style={{ animation: `${periodo.vez % 2 ? "pnPasoA" : "pnPasoB"} 340ms cubic-bezier(0.22,1,0.36,1) backwards` }}>
        {periodo.id !== "todo" &&
          (() => {
            const m = periodo.id === "este" ? este : pasado;
            if (!m.lineas.length) return <div className="pn-vacio">{t.mesSinComisiones(nombreMes(m.mes, idioma))}</div>;
            return <LineasDelMes lineas={m.lineas} moneda={moneda} idioma={idioma} total={m.total} rotuloTotal={t.totalDe(nombreMes(m.mes, idioma))} desde={120} />;
          })()}
        {periodo.id === "todo" && !meses.length && <div className="pn-vacio">{t.sinHistorial}</div>}
        {periodo.id === "todo" && meses.length > 0 && (
          <>
            {meses.slice(0, cuantos).map((x, i) => {
              const on = abierto === x.mes;
              const ancho = tope > 0 && x.total > 0 ? Math.max(2, (x.total / tope) * 100) : 0;
              return (
                <div key={x.mes} className="pn-hmes pn-sube" style={{ animationDelay: `${60 + (i % MESES_DE_A) * 45}ms` }}>
                  <button type="button" className="pn-hmes-btn" aria-expanded={on ? "true" : "false"} onClick={() => setAbierto(on ? "" : x.mes)}>
                    <span className="pn-hmes-txt">
                      <span className="pn-hmes-n">{nombreConAnio(x.mes)}</span>
                      <span className="pn-hmes-c">{t.nComisiones(x.lineas.length)}</span>
                    </span>
                    <span className="pn-hmes-barra" aria-hidden="true">
                      <span className="pn-hmes-relleno" style={{ width: `${ancho}%` }} />
                    </span>
                    <span className={`pn-hmes-m pn-num${x.total < 0 ? " es-menos" : ""}`}>{monto(x.total, moneda, idioma)}</span>
                    <span className="pn-hmes-flecha" aria-hidden="true">
                      <Icono d={ICONOS.abajo} tam={16} grosor={2.4} />
                    </span>
                  </button>
                  {on && (
                    <div className="pn-hmes-lineas">
                      <LineasDelMes lineas={x.lineas} moneda={moneda} idioma={idioma} desde={0} />
                    </div>
                  )}
                </div>
              );
            })}
            {meses.length > cuantos && (
              <button type="button" onClick={() => setCuantos((c) => c + MESES_DE_A)} className="pn-mas">
                {t.cargarMas}
                <Icono d={ICONOS.abajo} grosor={2.3} />
              </button>
            )}
            <div className="pn-total">
              <span>{t.totalTodo}</span>
              <span className="pn-num pn-verde">{monto(ganado, moneda, idioma)}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Recomendados({ lista, idioma, moneda, filtro, alFiltro }) {
  const t = T[idioma];
  const [cuantos, setCuantos] = useState(DE_A);
  const conteo = useMemo(() => Object.fromEntries(FILTROS.map(([id, estados]) => [id, lista.filter((r) => estados.has(r.estado)).length])), [lista]);
  // Sin clientes todavía, arranca en «En proceso» para no mostrar una lista vacía.
  const elegido = filtro.id === "clientes" && !conteo.clientes && conteo.enProceso ? "enProceso" : FILTROS.some(([id]) => id === filtro.id) ? filtro.id : "clientes";
  const estados = FILTROS.find(([id]) => id === elegido)[1];
  const filtrados = lista.filter((r) => estados.has(r.estado));
  // Los clientes, de los que más comisión dan a los que menos.
  if (elegido === "clientes") filtrados.sort((x, y) => (y.comision || 0) - (x.comision || 0));
  const visibles = filtrados.slice(0, cuantos);
  const elegir = (id) => {
    if (id === elegido) return;
    setCuantos(DE_A);
    alFiltro({ id, vez: filtro.vez + 1 });
  };

  return (
    <>
      <div className="pn-chips">
        {FILTROS.map(([id, , tinta]) => (
          <button key={id} type="button" aria-pressed={elegido === id ? "true" : "false"} onClick={() => elegir(id)} className="pn-chip">
            {t.filtros[id]}
            <span className="pn-chip-n" style={{ color: TINTA[tinta] }}>
              {conteo[id]}
            </span>
          </button>
        ))}
      </div>
      <div key={`f${filtro.vez}`} className="pn-caja-lista" style={{ animation: `${filtro.vez % 2 ? "pnPasoA" : "pnPasoB"} 340ms cubic-bezier(0.22,1,0.36,1) backwards` }}>
        {visibles.map((r, i) => {
          const com = r.estado === "teGeneroComision";
          const cli = com || r.estado === "yaEsCliente";
          return (
            <div key={r.id} className="pn-rec pn-fila pn-sube" style={{ animationDelay: `${60 + (i % DE_A) * 45}ms` }}>
              <span aria-hidden="true" className={`pn-ini${com ? " es-com" : cli ? " es-cli" : ""}`}>
                {iniciales(r.nombre)}
              </span>
              <span className="pn-rec-txt">
                <span className="pn-rec-n">{r.nombre}</span>
                <span className="pn-rec-e">
                  <span className={`pn-rec-estado${com ? " es-com" : cli ? " es-cli" : ""}`} style={cli ? undefined : { color: TINTA[r.estado] }}>
                    <span aria-hidden="true" className="pn-rec-punto" />
                    {t.estados[r.estado]}
                  </span>
                  <span className="pn-rec-nota">· {notaDe(r, t, idioma)}</span>
                  {r.compartidoCon && <span className="pn-rec-comp">{t.compartidoCon(r.compartidoCon)}</span>}
                </span>
              </span>
              {r.comision > 0 && <span className="pn-rec-m">{monto(r.comision, moneda, idioma)}</span>}
            </div>
          );
        })}
        {!filtrados.length && <div className="pn-vacio">{t.listaVacia}</div>}
        {filtrados.length > cuantos && (
          <button type="button" onClick={() => setCuantos((c) => c + DE_A)} className="pn-mas">
            {t.cargarMas}
            <Icono d={ICONOS.abajo} grosor={2.3} />
          </button>
        )}
      </div>
    </>
  );
}

function Pagos({ yo, pagos, idioma }) {
  const t = T[idioma];
  const [abierto, setAbierto] = useState("");
  const moneda = yo.afiliado.moneda;
  const { mes, total, cierre } = yo.esteMes;
  const pendiente = yo.pendiente?.total > 0 ? yo.pendiente : null;
  const cierreDia = Number(String(cierre || "").slice(8, 10));
  const sePaga = cierreDia >= 28 ? t.sePagaUltimo(nombreMes(String(cierre).slice(0, 7), idioma)) : t.sePagaEn(nombreMes(String(cierre).slice(0, 7), idioma));
  const lista = pagos.pagos || [];

  const detalle = (p) => {
    if (p.estado === "pagado") return { txt: p.descuento != null ? t.descontado(diaCorto(diaDe(p.pagadoEn), idioma)) : t.transferido(diaCorto(diaDe(p.pagadoEn), idioma), cuentaEn(p.cuenta, idioma)), clase: "" };
    if (p.estado === "reversado") return { txt: t.reversado, clase: " es-reversa" };
    return { txt: t.enProceso, clase: " es-curso" };
  };

  return (
    <div className="pn-caja-lista">
      <div className="pn-pago-curso">
        <span style={{ flex: "1 1 auto" }}>
          <span className="pn-pago-m">{nombreMes(mes, idioma)}</span>
          <span className="pn-pago-d es-curso">{sePaga}</span>
        </span>
        <span className="pn-num" style={{ fontSize: 15.5, fontWeight: 600 }}>
          {monto(total, moneda, idioma)}
        </span>
      </div>
      {pendiente && pendiente.hasta !== mes && (
        <div className="pn-pago-curso" style={{ background: "transparent" }}>
          <span style={{ flex: "1 1 auto" }}>
            <span className="pn-pago-m">{nombreMes(pendiente.hasta, idioma)}</span>
            <span className="pn-pago-d es-curso">{t.preparando}</span>
          </span>
          <span className="pn-num" style={{ fontSize: 15.5, fontWeight: 600 }}>
            {monto(pendiente.total, moneda, idioma)}
          </span>
        </div>
      )}
      {lista.map((p) => {
        const id = `${p.mes}-${p.estado}`;
        const on = abierto === id;
        const d = detalle(p);
        return (
          <div key={id} className="pn-pago" data-abierto={on ? "true" : "false"}>
            <button type="button" onClick={() => setAbierto(on ? "" : id)} aria-expanded={on ? "true" : "false"} className="pn-pago-btn pn-fila">
              <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                <span className="pn-pago-m">{nombreMes(p.mes, idioma)}</span>
                <span className={`pn-pago-d${d.clase}`}>{d.txt}</span>
              </span>
              <span className="pn-num" style={{ fontSize: 15.5, fontWeight: 600 }}>
                {monto(p.total, p.moneda, idioma)}
              </span>
              <Icono d={ICONOS.abajo} color="#8f9c96" grosor={2.3} className="pn-flecha" />
            </button>
            <div className="pn-pago-lineas">
              <div>
                {(p.clientes || []).map((c) => (
                  <div key={c.cliente || "ajuste"} className="pn-pago-linea">
                    <span>{c.cliente || t.ajuste}</span>
                    <span>{monto(c.monto, p.moneda, idioma)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      {!lista.length && !pendiente && <div className="pn-nota-chica">{t.sinPagos}</div>}
    </div>
  );
}
