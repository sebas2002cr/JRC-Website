/**
 * El campo de la cédula escrito con animación, igual que en
 * consultasituaciontributaria.cr (src/espejo.js y conGuiones de src/util.js de
 * ese sitio). Si allá cambia, se cambia también acá.
 *
 * Un <input> no deja animar cada letra, así que encima va una capa que dibuja
 * lo mismo, letra por letra; el input queda con el texto transparente y sigue
 * siendo el de verdad (cursor, selección, pegar, teclado y lector de
 * pantalla). Cada número nuevo sube apenas y aparece; los guiones se abren; lo
 * que ya estaba se desliza desde donde estaba hasta donde quedó.
 */

const CURVA = "cubic-bezier(.22,1,.36,1)";
const quieto = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const LETRAS = /[^\d\s.\-–—]/;
const sinCero = (d) => (d.length === 10 && d.startsWith("0") ? d.slice(1) : d);

export function crearEspejo(input) {
  const campo = input.parentElement;
  const capa = document.createElement("span");
  const fila = document.createElement("span");
  capa.className = "tq-espejo";
  capa.setAttribute("aria-hidden", "true");
  fila.className = "tq-espejo-fila";
  capa.append(fila);
  input.after(capa);
  campo.classList.add("con-espejo");

  let antes = [];
  let sig = 0;
  function pintar(animar = true) {
    const v = input.value;
    // Qué números siguen siendo los mismos: los del principio y los del final que no cambiaron.
    const dv = antes.filter((x) => /\d/.test(x.c));
    const dn = v.replace(/\D/g, "");
    let i = 0;
    while (i < dv.length && i < dn.length && dv[i].c === dn[i]) i++;
    let j = 0;
    while (j < dv.length - i && j < dn.length - i && dv[dv.length - 1 - j].c === dn[dn.length - 1 - j]) j++;
    const llaves = dn.split("").map((_, n) => (n < i ? dv[n].k : n >= dn.length - j ? dv[dv.length - (dn.length - n)].k : "d" + sig++));
    // Dónde estaba cada letra (con la animación que lleve en curso).
    const donde = new Map(antes.map((x) => { const r = x.el.getBoundingClientRect(); return [x.k, { x: r.left, y: r.top, o: +getComputedStyle(x.el).opacity }]; }));
    let nd = 0;
    let ns = 0;
    const nuevas = [...v].map((c) => {
      const k = /\d/.test(c) ? llaves[nd++] : "s" + ns++;
      const el = document.createElement("span");
      el.className = /\d/.test(c) ? "e-n" : "e-s";
      el.textContent = c;
      return { k, c, el };
    });
    fila.replaceChildren(...nuevas.map((x) => x.el));
    antes = nuevas;
    seguir();
    if (!animar || quieto()) return;
    for (const x of nuevas) {
      const a = donde.get(x.k);
      if (!a) {
        // Entra: el número sube y aparece; el guion se abre.
        x.el.animate(x.el.className === "e-n"
          ? [{ opacity: 0, transform: "translateY(.16em)" }, { opacity: 1, transform: "none" }]
          : [{ opacity: 0, transform: "scaleX(.5)" }, { opacity: 1, transform: "none" }], { duration: 360, easing: CURVA });
        continue;
      }
      const r = x.el.getBoundingClientRect();
      const dx = a.x - r.left;
      const dy = a.y - r.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && a.o > 0.99) continue;
      x.el.animate([{ transform: `translate(${dx}px, ${dy}px)`, opacity: a.o }, { transform: "none", opacity: 1 }], { duration: 380, easing: CURVA });
    }
  }
  // La capa mide lo mismo que el input (no tapa el botón) y, si el texto no
  // cabe y el input se desplaza, lo sigue.
  function seguir() {
    capa.style.width = input.offsetWidth + "px";
    fila.style.transform = input.scrollLeft ? `translateX(${-input.scrollLeft}px)` : "";
  }
  input.addEventListener("scroll", seguir);
  input.addEventListener("select", seguir);
  input.addEventListener("keyup", seguir);
  pintar(false);
  return {
    pintar,
    quitar() {
      capa.remove();
      campo.classList.remove("con-espejo");
      input.removeEventListener("scroll", seguir);
      input.removeEventListener("select", seguir);
      input.removeEventListener("keyup", seguir);
    },
  };
}

// Los guiones se ponen solos mientras escribe. Hasta 9 números se arma como
// física (1-2345-6789); con 10, como jurídica (3-101-123456), y si empieza con
// 310 desde el principio, para que no salte al décimo número. Con 11 o 12
// (DIMEX), sin guiones. Con letras o con el 0 adelante no se toca nada.
function enCurso(d) {
  if (d.length > 10) return d;
  const cortes = d.length === 10 || d.startsWith("310") ? [1, 4] : [1, 5];
  return cortes.reduceRight((t, c) => (d.length > c ? t.slice(0, c) + "-" + t.slice(c) : t), d);
}
// Devuelve el texto con guiones y dónde queda el cursor: después del mismo
// número que antes. `borroGuion`: con la tecla de borrar se llevó solo un
// guion; entonces se borra el número de antes.
export function conGuiones(v, cursor, borroGuion) {
  if (LETRAS.test(v)) return null;
  let d = v.slice(0, cursor).replace(/\D/g, "");
  const resto = v.slice(cursor).replace(/\D/g, "");
  if (borroGuion) d = d.slice(0, -1);
  const todo = d + resto;
  if (!todo || todo.startsWith("0")) return null;
  const t = enCurso(todo);
  let pos = 0;
  for (let n = 0; n < d.length; pos++) if (/\d/.test(t[pos])) n++;
  return { t, pos };
}

// Si pega un texto con la cédula adentro («Cédula: 3-101-123456»), se queda con los números.
export function numerosDe(t) {
  const d = sinCero(String(t).replace(/\D/g, ""));
  return [9, 10, 11, 12].includes(d.length) ? d : null;
}
export const formato = (d) => (d.length === 9 ? `${d[0]}-${d.slice(1, 5)}-${d.slice(5)}` : d.length === 10 ? `${d[0]}-${d.slice(1, 4)}-${d.slice(4)}` : d);
