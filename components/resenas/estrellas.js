/**
 * Las cinco estrellas de una calificacion.
 *
 * Dibuja siempre las cinco en gris y encima pone las mismas cinco en dorado
 * dentro de una caja recortada al porcentaje que corresponda. Es la unica
 * forma sencilla de mostrar media estrella: JRC hoy tiene 5,0 y las cinco
 * salen enteras, pero si manana baja a 4,7 esto sigue siendo cierto sin
 * tocar nada.
 *
 * No lleva "use client": es solo marcado, no tiene estado ni escucha nada,
 * asi que puede renderizarse en el servidor.
 */
export function Estrellas({ valor = 5, className = "h-4 w-4" }) {
  // Se acota entre 0 y 5 antes de convertirlo a porcentaje. Un dato raro en
  // Sanity no puede terminar en un width de 240% desbordando la insignia.
  const porcentaje = (Math.min(Math.max(valor, 0), 5) / 5) * 100;

  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${valor} de 5 estrellas`}>
      <span className="flex" aria-hidden="true">
        <Fila className={className} color="#dadce0" />
      </span>
      {/* overflow-hidden es lo que recorta; el ancho en % es el relleno.
          El interior tiene que medir siempre lo mismo que la fila gris de
          abajo, por eso las estrellas doradas van con flex-none: si se
          encogieran al achicarse la caja, se recortarian todas un poco en
          vez de recortarse las ultimas. */}
      <span
        className="absolute inset-y-0 left-0 flex overflow-hidden"
        style={{ width: `${porcentaje}%` }}
        aria-hidden="true">
        <Fila className={className} color="#fbbc04" />
      </span>
    </span>
  );
}

function Fila({ className, color }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map(i => (
        <svg
          key={i}
          className={`${className} flex-none`}
          viewBox="0 0 24 24"
          fill={color}
          aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </>
  );
}
