const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'v3dpug',
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
