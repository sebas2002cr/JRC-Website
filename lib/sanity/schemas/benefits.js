export default {
    name: 'benefits',
    title: 'Benefits',
    type: 'document',
    fields: [
      {
        name: 'company',
        title: 'Company',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'reward',
        title: 'Reward Description',
        type: 'string',
      },
      {
        name: 'tag',
        title: 'Tag',
        type: 'string',
      },
    ],
    preview: {
      select: {
        title: 'company',
        media: 'image',
      },
    },
  }
  