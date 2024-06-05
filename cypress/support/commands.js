// cypress/support/commands.js

const url = Cypress.env('MONGODB_URL');
const dbName = Cypress.env('MONGODB_NAME');

Cypress.Commands.add('addRecord', (collectionName, record) => {
    return cy.task('addRecord', { url, dbName, collectionName, record });
});

Cypress.Commands.add('clearCollection', (collectionName) => {
    cy.task('clearCollection', {
        url, dbName, collectionName
    });
});

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login'); // Change the URL to match your application's login page
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('apiRequest', ({ method, url, data, headers }) => {
    return cy.task('apiRequest', { method, url, data, headers });
});


Cypress.Commands.add('saveRecordsToData', (filename, startDate, nonReported) => {
    return cy.task('saveRecordsToData', { filename, startDate, nonReported });
});
