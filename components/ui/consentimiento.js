"use client";

import { useEffect, useRef } from "react";

/**
 * Las piezas que comparten los formularios que llegan al ERP como lead: el
 * cotizador, Contacto y las dos compras en línea.
 */

/**
 * La casilla de consentimiento. Sin marcar por defecto: la Ley 8968 pide
 * consentimiento expreso, y una casilla ya marcada no lo es. Es la misma
 * redacción del boletín (components/blog/formularioBoletin.js).
 */
export function CasillaContacto({ id, acepta, alCambiar, registro, className = "" }) {
  // Con react-hook-form (Contacto) llega `registro`; los demás usan estado.
  const control = registro ? registro : { checked: acepta, onChange: e => alCambiar(e.target.checked) };
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 text-sm text-gray-600 ${className}`}>
      <input id={id} type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#305832]" {...control} />
      <span>
        Acepto la{" "}
        <a href="/privacidad" target="_blank" rel="noopener" className="font-medium text-[#305832] underline">
          Política de Privacidad
        </a>{" "}
        y los{" "}
        <a href="/terminos" target="_blank" rel="noopener" className="font-medium text-[#305832] underline">
          Términos y Condiciones
        </a>
        , y que JRC me contacte sobre esta solicitud.
      </span>
    </label>
  );
}

/**
 * El campo trampa: invisible para una persona, irresistible para un bot. Igual
 * que el del boletín: fuera de la pantalla, sin tabulador ni autocompletado.
 */
export function CampoTrampa({ id, valor, alCambiar, registro }) {
  const control = registro ? registro : { value: valor, onChange: e => alCambiar(e.target.value) };
  return (
    <div className="absolute left-[-9999px]" aria-hidden="true">
      <label htmlFor={id}>Sitio web</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" {...control} />
    </div>
  );
}

/**
 * Cuánto lleva la persona con el formulario delante, en milisegundos. Se mide
 * el tiempo transcurrido y no la hora, para no depender del reloj del equipo.
 */
export function useTiempoEnPantalla() {
  const desde = useRef(0);
  useEffect(() => {
    desde.current = Date.now();
  }, []);
  return () => (desde.current ? Date.now() - desde.current : 0);
}
