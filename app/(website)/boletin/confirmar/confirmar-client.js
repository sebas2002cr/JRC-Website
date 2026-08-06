"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pedirAlBoletin, VERDE } from "@/lib/boletin";
import MarcoBoletin, {
  IconoCheck,
  IconoAviso,
  IconoSobre
} from "../marco";

/**
 * Confirma la suscripción apenas se abre la página.
 *
 * ── Por qué la confirmación la dispara JavaScript y no el enlace ───────
 *
 * Los antivirus corporativos y los escáneres de enlaces de Outlook ABREN
 * los enlaces de los correos para revisar que no sean maliciosos. Si el
 * enlace del correo confirmara por sí solo, media lista quedaría confirmada
 * sin que ninguna persona hubiera hecho nada, y eso destruye justamente lo
 * que el doble opt-in existe para tener: la prueba de que alguien consintió.
 *
 * Un escáner descarga la página; no ejecuta JavaScript ni hace el POST. Un
 * navegador de verdad sí. De ahí que el enlace traiga a esta página y la
 * página haga el trabajo.
 */
export default function ConfirmarClient({ token }) {
  const [estado, setEstado] = useState(token ? "confirmando" : "invalido");
  const [mensaje, setMensaje] = useState("");
  const yaLlamado = useRef(false);

  useEffect(() => {
    if (!token || yaLlamado.current) return;
    // En desarrollo React monta dos veces a propósito. Sin esta guarda se
    // harían dos llamadas: la segunda no rompe nada porque el backend
    // responde "ya estabas confirmado", pero es un viaje al pedo.
    yaLlamado.current = true;

    (async () => {
      const { ok, datos } = await pedirAlBoletin("/boletin/confirmar", { token });

      if (ok) {
        setEstado(datos.ya ? "ya" : "listo");
        return;
      }

      setEstado(datos.codigo || "error");
      setMensaje(datos.error || "");
    })();
  }, [token]);

  if (estado === "confirmando") {
    return (
      <MarcoBoletin icono={<IconoSobre />} titulo="Confirmando…">
        <p>Un segundo, estamos activando tu suscripción.</p>
      </MarcoBoletin>
    );
  }

  if (estado === "listo" || estado === "ya") {
    return (
      <MarcoBoletin icono={<IconoCheck />} titulo="Listo, ya estás suscrito">
        <p className="mb-8">
          {estado === "ya"
            ? "Esta suscripción ya estaba confirmada, así que no hay nada más que hacer."
            : "Todos los lunes te llega el resumen de las novedades tributarias, fiscales, legales y financieras de la semana."}
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

  // El enlace venció, no es válido, o esa dirección se había dado de baja.
  // Los tres terminan igual: hay que suscribirse otra vez. Por eso el texto
  // cambia pero la salida es siempre la misma, y es una sola.
  return (
    <MarcoBoletin icono={<IconoAviso />} titulo={TITULOS[estado] || TITULOS.error}>
      <p className="mb-8">{mensaje || "Probá suscribirte de nuevo desde el blog."}</p>
      <Link
        href="/blog"
        className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
        style={{ backgroundColor: VERDE }}>
        Volver al blog
      </Link>
    </MarcoBoletin>
  );
}

const TITULOS = {
  invalido: "Este enlace no sirve",
  vencido: "El enlace venció",
  dadoDeBaja: "Esta dirección se dio de baja",
  error: "No pudimos confirmar"
};
