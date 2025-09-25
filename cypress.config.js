const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'v3dpug',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
