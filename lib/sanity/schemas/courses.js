export default {
  name: "course",
  title: "Courses",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "Title of the course"
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "Short description of the course"
    },
    {
      name: "price",
      title: "Price (CRC)",
      type: "number",
      description: "Price of the course in Costa Rican colones (CRC)"
    },
    {
      name: "lessons",
      title: "Lessons",
      type: "number",
      description: "Total number of lessons"
    },
    {
      name: "duration",
      title: "Duration",
      type: "string",
      description:
        "Total duration of video content, e.g., '6.5 hours'"
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility."
        }
      ],
      options: {
        hotspot: true
      }
    },
    {
      name: "url",
      title: "Course URL",
      type: "url",
      description: "Link to the course page"
    }
  ],

  preview: {
    select: {
      title: "title",
      media: "mainImage",
      price: "price"
    },
    prepare(selection) {
      const { title, media, price } = selection;
      return {
        title,
        media,
        subtitle: price
          ? `₡${price.toLocaleString()}`
          : "No price specified"
      };
    }
  }
};
