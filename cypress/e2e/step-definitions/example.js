const dayjs = require('dayjs');
const testpage = require('../page-objects/test');
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

Given('a clean database', () => {
  cy.clearCollection('users').then((result) => {
    expect(result).to.have.property('deletedCount');
    cy.log(`Deleted ${result.deletedCount} records`);
  });
});

Given('the user is on the homepage', () => {
  cy.visit('/');
});

When('the user clicks the {string} button', (button) => {
  cy.get('button').contains(button).click();
  testpage.getSpecificFeelingOption("I'm Feeling Lucky").click();
});

Then('the user should see the "About Us" page', () => {
 testpage.getHeaderName().then((headerName) => {
    expect(headerName).to.equal('About Us');
  });
});

Given('I make a GET request to {string}', (url) => {
  cy.apiRequest({
    method: 'GET',
    url: url
  }).as('apiResponse');
});

Then('the response should be:', (dataTable) => {
  const expectedData = dataTable.hashes().map(row => ({
    id: parseInt(row.id, 10),
    name: row.name
  }));

  cy.get('@apiResponse').then((response) => {
    cy.log('Response:', response);
    cy.log('Expected Data:', expectedData);
    expect(response).to.deep.equal(expectedData);
  });
});

Given('{string} were created {int} day ago', (file, days) => {
  const filename = `${file}.json`;
  const start = dayjs().subtract(days, 'day').format('YYYY-MM-DD');
  cy.saveRecordsToData(filename, start);
});