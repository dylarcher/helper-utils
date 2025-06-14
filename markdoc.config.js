export default {
  tags: {},
  nodes: {
    document: {
      render: 'article', // Or any other suitable top-level HTML element
      attributes: {
        class: {
          type: String,
          default: 'document-class' // Example class
        }
      }
    }
  },
  // Add other configurations like variables, functions, or partials if needed later
};
