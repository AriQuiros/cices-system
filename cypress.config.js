const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'v3dpug',
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Puedes implementar plugins aquí si luego lo necesitas
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    reportFilename: '[name]-report' // Genera un archivo con el nombre del spec
  },
});
