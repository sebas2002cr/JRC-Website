"use client";

import { useEffect } from "react";

/**
 * Protege el <link rel="canonical"> de la pagina frente a globalseo.
 *
 * translate.js, al arrancar, hace esto:
 *
 *   var o = document.querySelector('link[rel="canonical"]');
 *   o && o.remove();
 *   // ...y a continuacion inserta un canonical propio
 *
 * El canonical de cada ruta sale de la API de metadata de Next, o sea que es
 * un "hoistable" de React: React lo coloca en el <head> y se guarda la
 * referencia para retirarlo cuando la pagina se desmonta. Si globalseo se lo
 * lleva primero, esa referencia queda huerfana y al navegar React ejecuta
 *
 *   unmountHoistable -> instance.parentNode.removeChild(instance)
 *
 * sin comprobar null. El TypeError cae en plena fase de commit, React tumba
 * el arbol entero y Next pinta "Application error: a client-side exception
 * has occurred". Es decir: pantalla en blanco al salir de la pagina.
 *
 * Aca se hace lo minimo para cortarlo:
 *
 *  1. Se anula el .remove() del canonical servido, y solo en ese nodo: no se
 *     toca Element.prototype. React puede seguir retirandolo cuando toque,
 *     porque para eso usa parentNode.removeChild, no .remove.
 *
 *  2. Se descarta el canonical que globalseo inserta. Dejarlo es peor que no
 *     tener ninguno: no se actualiza al navegar, asi que termina declarando
 *     que el home es una copia de la pagina anterior.
 */
export default function CanonicalGuard() {
  useEffect(() => {
    const servido = document.head.querySelector('link[rel="canonical"]');
    if (!servido) return;

    Object.defineProperty(servido, "remove", {
      configurable: true,
      value: () => {}
    });

    const observer = new MutationObserver(revisar);
    const desconectar = () => observer.disconnect();

    function revisar() {
      // Solo mientras el canonical servido siga en el <head>. Despues de la
      // primera navegacion los canonical los pone React, y esos no se tocan.
      if (!servido.isConnected) return desconectar();

      const sobrantes = [
        ...document.head.querySelectorAll('link[rel="canonical"]')
      ].filter(link => link !== servido);

      if (!sobrantes.length) return;

      sobrantes.forEach(link => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
      // globalseo inserta el suyo una sola vez, al cargar.
      desconectar();
    }

    revisar();
    observer.observe(document.head, { childList: true });
    return desconectar;
  }, []);

  return null;
}
