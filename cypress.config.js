const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationexercise.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      reportDir: 'cypress/reports',
      reportFilename: 'automation-exercise-report',
      json: false,
      html: true,
      timestamp: 'yyyy-mm-dd_HH-MM-ss'
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    }
  }
});
