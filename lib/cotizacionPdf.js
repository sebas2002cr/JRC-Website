/**
 * El PDF de la cotización, con html2pdf: COPIA de lo que hace el ERP en
 * CRM/JRC-CRM-Frontend/app/cotizaciones/_lib/documento.js, con las mismas
 * opciones, para que el documento salga igual que el oficial y en UNA sola
 * hoja continua. Las trampas (el nodo tiene que estar montado y visible, el
 * ancho se impone en el clon, las imágenes se esperan, el alto de la página se
 * calcula contra el lienzo) están explicadas en el original.
 */

/** Tiene que coincidir con `.cot-doc { width }` en components/cotizacion/documento.css. */
const ANCHO_PX = 820;
const ANCHO_PT = Math.round(ANCHO_PX * (72 / 96));
const ALTO_PROVISIONAL = 1100;

function altoDePagina(lienzo) {
  const cabe = alto => Math.floor(lienzo.width * (alto / ANCHO_PT)) >= lienzo.height;
  let alto = Math.max(Math.ceil((lienzo.height * ANCHO_PT) / lienzo.width), 200);
  while (!cabe(alto)) alto += 1;
  return alto;
}

async function esperarImagenes(nodo) {
  const imgs = Array.from(nodo.querySelectorAll("img"));
  await Promise.all(
    imgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(listo => {
            img.onload = listo;
            img.onerror = listo;
          })
    )
  );
  // La letra también: sin ella, el PDF sale con la de respaldo.
  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise(r => setTimeout(r, 60));
}

const pagina = alto => ({ unit: "pt", format: [ANCHO_PT, alto], orientation: "portrait" });

function opciones(alto) {
  return {
    margin: 0,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      onclone: doc => {
        const clon = doc.querySelector(".html2pdf__container .cot-doc");
        if (clon) {
          clon.style.width = `${ANCHO_PX}px`;
          clon.style.maxWidth = "none";
        }
      }
    },
    jsPDF: pagina(alto)
  };
}

/** El PDF de `nodo` (el `.cot-doc` montado) como Blob. */
export async function pdfDeCotizacion(nodo) {
  const html2pdf = (await import("html2pdf.js")).default;
  await esperarImagenes(nodo);
  const trabajo = html2pdf().set(opciones(ALTO_PROVISIONAL)).from(nodo).toCanvas();
  const lienzo = await trabajo.get("canvas");
  return trabajo.set({ jsPDF: pagina(altoDePagina(lienzo)) }).output("blob");
}
