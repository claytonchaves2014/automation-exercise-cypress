require('cypress-mochawesome-reporter/register');

Cypress.on('uncaught:exception', () => false);
