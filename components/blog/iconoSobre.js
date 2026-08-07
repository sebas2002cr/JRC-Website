/**
 * El sobre del boletín.
 *
 * Vive aparte porque lo usan el botón flotante, el encabezado del panel y la
 * página jrc.cr/boletin. Es el mismo dibujo que el de _legal, pero ese es un
 * componente de servidor de otra sección y no tiene por qué arrastrar el
 * "use client" de acá.
 *
 * No lleva "use client" a propósito: es un SVG sin estado ni eventos, así
 * que sirve tanto en un componente de servidor como dentro de uno de
 * cliente. Marcarlo obligaría a la página a hidratarse solo por un dibujo.
 */
export function IconoSobre({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}
