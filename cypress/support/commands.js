// cypress/support/commands.js

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login'); // Change the URL to match your application's login page
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});


Cypress.Commands.add('addRecord', (collectionName, record) => {
    const url = Cypress.env('MONGODB_URL');
    const dbName = Cypress.env('MONGODB_NAME');

    return cy.task('addRecord', { url, dbName, collectionName, record });
});