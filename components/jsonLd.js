/**
 * Inserta un bloque de datos estructurados schema.org.
 *
 * No renderiza nada visible: solo un <script type="application/ld+json">
 * que leen los buscadores.
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // El "<" se escapa para que un valor con HTML no pueda cerrar el
      // <script> antes de tiempo.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}
