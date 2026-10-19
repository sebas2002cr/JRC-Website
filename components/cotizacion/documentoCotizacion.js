"use client";

import "./documento.css";
import { Archivo } from "next/font/google";

/**
 * La cotización que el sitio le entrega al cliente, con el papel oficial del
 * ERP (Omar, 19 oct 2026): es una copia de CotizacionDoc
 * (CRM/JRC-CRM-Frontend/app/cotizaciones/_components/CotizacionDoc.js), con el
 * mismo marcado y las mismas clases, limitada a lo que el sitio cotiza: en
 * español, en colones, sin descuento ni exoneración y sin número de
 * consecutivo (el del sitio no es del ERP). Si el original cambia, se copia
 * acá. El ERP dibuja esta misma cotización en la ficha del lead.
 *
 * Los textos del pie y la empresa son los valores de arranque de Cotizaciones
 * (utils/catalogo.js del backend del ERP) y los de configuracionFinanzas: el
 * sitio no lee la configuración del ERP.
 */

// Por next/font y no por un enlace: html2canvas no dibuja una letra que no
// cargó todavía (ver el original).
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-archivo" });

const DIAS_VALIDEZ = 15;
const TEXTOS = {
  validez: `La presente cotización tiene una validez de ${DIAS_VALIDEZ} días naturales. Para más información, contáctanos a info@jrc.cr.`,
  observacion:
    "Observación: Nosotros brindamos acompañamiento, es el factor de diferenciación entre muchos otros contadores o asesores.",
  noIncluye:
    "Es importante destacar que el servicio ofrecido no incluye certificaciones de ingresos, flujos proyectados por CPA, certificaciones literales, personerías jurídicas, ni RTBF (a menos que se especifique lo contrario en esta cotización).",
};
const EMPRESA = {
  nombreComercial: "JRC Consulting Group",
  razonSocial: "Grupo Consultor JSRC",
  cedulaJuridica: "3-101-815282",
  sedes: ["San José, Escazú", "Tamarindo, Guanacaste"],
};

const IVA = 0.13;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** «₡99,500», o con céntimos si los tiene. Como formatearDinero del ERP. */
function plata(valor) {
  const n = Math.round((Number(valor) || 0) * 100) / 100;
  const decimales = Number.isInteger(n) ? 0 : 2;
  return `₡${n.toLocaleString("en-US", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
}

/** «19 oct 2026», en hora de Costa Rica. Como formatearFecha del ERP. */
function fecha(iso) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Costa_Rica", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(iso))
    .split("-")
    .map(Number);
  return `${p[2]} ${MESES[p[1] - 1]} ${p[0]}`;
}

const redondear = (n) => Math.round(n * 100) / 100;
/** El monto sin IVA de un renglón que ya lo trae (los precios del sitio lo incluyen). */
const neto = (monto) => redondear(monto / (1 + IVA));

/**
 * La cotización armada con lo que calculó el sitio. `costos` trae el plan y
 * los tres extras con IVA; `respuestas`, lo que contestó la persona.
 */
export function armarCotizacion({ planNombre, costos, respuestas = {}, alcances = [], cliente, creadaEn }) {
  const r = respuestas;
  const colaboradores = Number.parseInt(r.colaboradores, 10);
  const lineas = [
    { nombre: `Plan ${planNombre}`, monto: costos.plan, tipo: "plan" },
    costos.planilla > 0 && { nombre: Number.isInteger(colaboradores) ? `Planilla (${colaboradores} colaboradores)` : "Planilla", monto: costos.planilla },
    costos.facturas > 0 && { nombre: "Facturación electrónica", monto: costos.facturas },
    costos.transacciones > 0 && { nombre: "Transacciones bancarias adicionales", monto: costos.transacciones },
  ].filter(Boolean);
  const total = redondear(lineas.reduce((a, l) => a + (Number(l.monto) || 0), 0));
  const subtotal = redondear(lineas.reduce((a, l) => a + neto(Number(l.monto) || 0), 0));
  return { lineas, alcances, cliente, creadaEn, totales: { subtotal, iva: redondear(total - subtotal), total } };
}

function Dato({ rotulo, valor }) {
  if (!valor) return null;
  return (
    <div>
      <span className="cot-doc-dato-rotulo">{rotulo}</span>
      <span className="cot-doc-dato-valor">{valor}</span>
    </div>
  );
}

export default function DocumentoCotizacion({ cotizacion }) {
  if (!cotizacion) return null;
  const { lineas, alcances, cliente = {}, totales } = cotizacion;
  const plan = lineas.find((l) => l.tipo === "plan");
  return (
    <div className={archivo.variable}>
      <div className="cot-doc">
        <header className="cot-doc-banda">
          {/* eslint-disable-next-line @next/next/no-img-element -- html2canvas fotografía <img>, no <Image> */}
          <img className="cot-doc-logo" src="/img/JRCLogofull.png" alt={EMPRESA.nombreComercial} crossOrigin="anonymous" />
          <div className="cot-doc-banda-doc">
            <span className="cot-doc-banda-rotulo">Cotización</span>
            <span className="cot-doc-fecha">{fecha(cotizacion.creadaEn)}</span>
          </div>
        </header>

        <div className="cot-doc-cuerpo">
          <div className="cot-doc-titulo-fila">
            <h2 className="cot-doc-titulo">{plan?.nombre || "Cotización"}</h2>
            {cliente.nombreCompleto && (
              <div className="cot-doc-para">
                <span className="cot-doc-para-rotulo">Cliente</span>
                <span className="cot-doc-para-nombre">{cliente.nombreCompleto}</span>
              </div>
            )}
          </div>

          <div className="cot-doc-datos">
            <Dato rotulo="Contacto" valor={cliente.correo} />
            <Dato rotulo="Teléfono" valor={cliente.telefono} />
            <Dato rotulo="Pago" valor="Mensual · Colones" />
          </div>

          {alcances.length > 0 && (
            <>
              <h3 className="cot-doc-seccion">Alcances del servicio</h3>
              <ul className={`cot-doc-alcances${alcances.length > 3 ? " es-doble" : ""}`}>
                {alcances.map((texto, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li className="cot-doc-alcance" key={i}>
                    {texto}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 className="cot-doc-seccion">Detalle</h3>
          <table className="cot-doc-tabla">
            <tbody>
              {lineas.map((l, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  <td>
                    <span className="cot-doc-linea-nombre">{l.nombre}</span>
                  </td>
                  <td>{plata(neto(l.monto))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cot-doc-sumas">
            <div className="cot-doc-suma">
              <span className="cot-doc-suma-rotulo">Subtotal</span>
              <span className="cot-doc-suma-monto">{plata(totales.subtotal)}</span>
            </div>
            <div className="cot-doc-suma">
              <span className="cot-doc-suma-rotulo">IVA 13%</span>
              <span className="cot-doc-suma-monto">{plata(totales.iva)}</span>
            </div>
          </div>
        </div>

        <div className="cot-doc-total">
          <span className="cot-doc-total-rotulo">Total</span>
          <span className="cot-doc-total-monto">{plata(totales.total)}</span>
        </div>

        <footer className="cot-doc-pie">
          <p className="cot-doc-nota">{TEXTOS.validez}</p>
          <p className="cot-doc-nota es-fuerte">{TEXTOS.observacion}</p>
          <p className="cot-doc-nota">{TEXTOS.noIncluye}</p>
          <div className="cot-doc-firma">
            <div className="cot-doc-firma-legal">
              <span className="cot-doc-firma-razon">{EMPRESA.razonSocial}</span>
              <span>Cédula jurídica {EMPRESA.cedulaJuridica}</span>
              <span>
                {" · "}
                {EMPRESA.sedes.join(" · ")}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- html2canvas fotografía <img>, no <Image> */}
            <img className="cot-doc-pyme" src="/pyme.svg" alt="Pyme Costa Rica" crossOrigin="anonymous" />
          </div>
        </footer>
      </div>
    </div>
  );
}
