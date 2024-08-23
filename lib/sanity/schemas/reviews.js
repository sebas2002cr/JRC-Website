export default {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        {
        name: 'name',
        title: 'Reviewer Name',
        type: 'string',
        description: 'Nombre del cliente que dejó la reseña',
      },
      {
        name: 'review',
        title: 'Review Text',
        type: 'text',
        description: 'Texto de la reseña proporcionada por el cliente',
      },
      {
        name: 'position',
        title: 'Reviewer Position',
        type: 'string',
        description: 'Posición o cargo del cliente',
      },
      {
        name: 'company',
        title: 'Company',
        type: 'string',
        description: 'Nombre de la empresa del cliente, si es aplicable',
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'position',
        media: 'image',
      },
    },
  }
  