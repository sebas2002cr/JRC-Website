/**
 * El encabezado de la insignia: la calificacion y cuantas opiniones hay.
 *
 * Es un documento unico. La sincronizacion lo escribe siempre con el mismo
 * `_id` fijo ("resumenGoogle"), de modo que cada corrida lo reemplaza en vez
 * de ir dejando copias. Si algun dia aparecen dos en el Studio, sobra el que
 * no tenga ese id.
 *
 * Va separado de las resenas y no como campo de cada una porque el total que
 * muestra la insignia —32— no es la cantidad de resenas que tenemos
 * guardadas: la API de Google entrega el texto de solo 5, pero sí dice
 * cuantas hay en total. Los dos numeros son distintos a proposito.
 */
export default {
  name: "resumenGoogle",
  title: "Resumen de Google",
  type: "document",
  fields: [
    {
      name: "calificacion",
      title: "Calificación",
      type: "number",
      description: "De 0 a 5. Por ejemplo: 5 o 4.8",
      validation: Rule => Rule.required().min(0).max(5)
    },
    {
      name: "totalOpiniones",
      title: "Total de opiniones",
      type: "number",
      description:
        "Cuántas opiniones tiene la ficha en Google, no cuántas están cargadas acá.",
      validation: Rule => Rule.required().min(0).integer()
    },
    {
      name: "enlacePerfil",
      title: "Enlace a la ficha en Google",
      type: "url",
      description:
        "A dónde lleva el botón 'Ver todas en Google' del panel."
    },
    {
      name: "actualizado",
      title: "Última actualización",
      type: "datetime",
      readOnly: true,
      description:
        "Lo escribe la sincronización. Sirve para saber si el trabajo automático sigue corriendo."
    }
  ],
  preview: {
    select: {
      calificacion: "calificacion",
      totalOpiniones: "totalOpiniones",
      actualizado: "actualizado"
    },
    prepare({ calificacion, totalOpiniones, actualizado }) {
      return {
        title: `${calificacion} ★ · ${totalOpiniones} opiniones`,
        subtitle: actualizado
          ? `Actualizado el ${new Date(actualizado).toLocaleDateString("es-CR")}`
          : "Nunca sincronizado"
      };
    }
  }
};
