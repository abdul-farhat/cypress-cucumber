const { Given, When, Then, Before } = require('@badeball/cypress-cucumber-preprocessor');

Before(() => {
  const record = { name: 'John Doe', age: 30, occupation: 'Engineer' };

  cy.addRecord('users', record).then((insertedRecord) => {
    expect(insertedRecord).to.have.property('_id');
    expect(insertedRecord.name).to.equal('John Doe');
    expect(insertedRecord.age).to.equal(30);
    expect(insertedRecord.occupation).to.equal('Engineer');
  });
});


Given('the user is on the homepage', () => {
  cy.visit('https://www.google.com');
});

When('the user clicks the "Learn More" button', () => {
  cy.get('button').contains('Learn More').click();
});

Then('the user should see the "About Us" page', () => {
  cy.url().should('include', '/about');
});

