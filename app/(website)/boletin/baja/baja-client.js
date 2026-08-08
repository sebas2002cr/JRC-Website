"use client";

import { useState } from "react";
import Link from "next/link";
import { cx } from "@/utils/all";
import { pedirAlBoletin, VERDE } from "@/lib/boletin";
import MarcoBoletin, { IconoCheck, IconoAviso, IconoSobre, BotonVerde } from "../marco";

/**
 * Baja del boletín.
 *
 * ── Por qué acá SÍ hay que apretar un botón ────────────────────────────
 *
 * La página de confirmar se dispara sola al abrirse. Esta no, y la
 * diferencia es a propósito: darse de baja no se puede deshacer solo (hay
 * que volver a suscribirse y confirmar de nuevo), y los escáneres de enlaces
 * de los correos corporativos abren todo lo que encuentran. Una baja
 * automática al abrir dejaría gente fuera de la lista sin que lo hubieran
 * pedido, y peor: sin que se enteraran.
 *
 * El motivo es opcional para quien se va, y es lo único que nos dice si el
 * boletín está molestando en vez de sirviendo. Por eso se pregunta acá y no
 * después, cuando ya nadie contesta.
 */

const MOTIVOS = [
  "Llega muy seguido",
  "No es lo que esperaba",
  "Ya no me interesa el tema",
  "Nunca me suscribí"
];

export default function BajaClient({ correo, token }) {
  const [estado, setEstado] = useState(correo && token ? "inicial" : "invalido");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  const darDeBaja = async () => {
    setError("");
    setEstado("enviando");

    const { ok, datos } = await pedirAlBoletin("/boletin/baja", {
      c: correo,
      t: token,
      motivo
    });

    if (ok) {
      setEstado("listo");
      return;
    }

    setEstado(datos.codigo === "invalido" ? "invalido" : "inicial");
    setError(datos.error || "No pudimos procesar la baja. Probá de nuevo.");
  };

  if (estado === "invalido") {
    return (
      <MarcoBoletin icono={<IconoAviso />} titulo="Este enlace no sirve">
        <p className="mb-8">
          Puede que se haya cortado al copiarlo. Abrí el enlace &quot;Darme de baja&quot;
          directamente desde el pie de cualquier correo del newsletter, o escribinos y lo
          resolvemos nosotros.
        </p>
        <Link
          href="/contact"
          className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: VERDE }}>
          Escribinos
        </Link>
      </MarcoBoletin>
    );
  }

  // El visto, el mismo de la confirmación, y no una equis: darse de baja no
  // es un error ni algo que salió mal, es algo que la persona pidió y que
  // funcionó. La equis dejaba sensación de advertencia justo en la pantalla
  // donde la despedida tiene que ser amable.
  if (estado === "listo") {
    return (
      <MarcoBoletin icono={<IconoCheck />} titulo="Listo, no te escribimos más">
        <p className="mb-2">Tu dirección quedó fuera de la lista del newsletter.</p>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-500">
          Si algún día cambiás de idea, podés volver a suscribirte desde el blog.
        </p>
        <Link
          href="/blog"
          className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: VERDE }}>
          Ir al blog
        </Link>
      </MarcoBoletin>
    );
  }

  return (
    <MarcoBoletin icono={<IconoSobre />} titulo="¿Querés dejar de recibir el newsletter?">
      <p className="mb-8">
        Al confirmar dejamos de escribirte. No hace falta que hagas nada más.
      </p>

      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Si querés contarnos por qué, nos ayuda a mejorarlo.
      </p>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {MOTIVOS.map(opcion => {
          const activo = motivo === opcion;
          return (
            <button
              key={opcion}
              type="button"
              // Se puede desmarcar: nadie tiene que quedar obligado a dar un
              // motivo por haber tocado uno sin querer.
              onClick={() => setMotivo(activo ? "" : opcion)}
              aria-pressed={activo}
              className={cx(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                activo
                  ? "border-transparent text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
              style={activo ? { backgroundColor: VERDE } : undefined}>
              {opcion}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex flex-col items-center gap-3">
        <BotonVerde onClick={darDeBaja} disabled={estado === "enviando"}>
          {estado === "enviando" ? "Un momento…" : "Confirmar la baja"}
        </BotonVerde>
        <Link
          href="/blog"
          className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">
          Mejor no, seguir recibiéndolo
        </Link>
      </div>
    </MarcoBoletin>
  );
}
