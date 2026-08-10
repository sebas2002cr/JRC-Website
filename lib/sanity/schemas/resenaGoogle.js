/**
 * Una resena de Google Maps.
 *
 * Es un tipo aparte del `review` que ya existe, y no un campo mas dentro de
 * aquel, a proposito: el carrusel del home consulta `*[_type == "review"]`
 * sin filtrar nada, asi que cualquier documento que cayera ahi apareceria
 * tambien en el carrusel. Separandolos, cada seccion muestra lo suyo.
 *
 * El campo que hace toda la gracia es `origen`. Las que trae la
 * sincronizacion quedan marcadas como "google" y se reescriben en cada
 * corrida; las que se cargan a mano quedan como "manual" y la
 * sincronizacion ni las mira. Esa es la salida al tope de la API, que
 * devuelve solo 5 resenas de las 32.
 */
export default {
  name: "resenaGoogle",
  title: "Reseña de Google",
  type: "document",
  fields: [
    {
      name: "autor",
      title: "Nombre de quien la escribió",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "texto",
      title: "Texto de la reseña",
      type: "text",
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      name: "estrellas",
      title: "Estrellas",
      type: "number",
      initialValue: 5,
      validation: Rule => Rule.required().min(1).max(5).integer()
    },
    {
      name: "fecha",
      title: "Fecha",
      type: "datetime",
      description:
        "Cuando se publicó en Google. Ordena la lista cuando dos reseñas no tienen orden manual."
    },
    {
      name: "origen",
      title: "Origen",
      type: "string",
      initialValue: "manual",
      options: {
        list: [
          { title: "Cargada a mano", value: "manual" },
          { title: "Traída de Google", value: "google" }
        ],
        layout: "radio"
      },
      description:
        "Dejalo en 'Cargada a mano'. Las de Google las marca la sincronización sola, y las que lleven esa marca se sobrescriben en cada corrida.",
      validation: Rule => Rule.required()
    },
    {
      name: "idGoogle",
      title: "Identificador en Google",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => document?.origen !== "google",
      description:
        "Lo escribe la sincronización para reconocer la misma reseña entre una corrida y otra. No se toca a mano."
    },
    {
      name: "orden",
      title: "Orden",
      type: "number",
      description:
        "Opcional. Un número más bajo la sube en la lista. Sin número, va después de las que sí lo tienen y se ordena por fecha."
    },
    {
      name: "oculta",
      title: "Ocultar del sitio",
      type: "boolean",
      initialValue: false,
      description:
        "Para sacarla de la insignia sin borrarla. Si es una reseña de Google, la sincronización respeta esta casilla."
    }
  ],
  preview: {
    select: {
      title: "autor",
      estrellas: "estrellas",
      texto: "texto",
      oculta: "oculta"
    },
    prepare({ title, estrellas, texto, oculta }) {
      return {
        title: `${"★".repeat(estrellas || 0)} ${title}`,
        subtitle: oculta ? "(oculta) " + (texto || "") : texto
      };
    }
  },
  orderings: [
    {
      title: "Orden en el sitio",
      name: "ordenSitio",
      by: [
        { field: "orden", direction: "asc" },
        { field: "fecha", direction: "desc" }
      ]
    }
  ]
};
