# Cypress-Cucumber with MongoDB Setup

This repository demonstrates how to set up Cypress with Cucumber for end-to-end testing, including integration with MongoDB using Docker Compose.

## Prerequisites

- Node.js (v12 or higher)
- Docker and Docker Compose

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abdul-farhat/cypress-cucumber.git
cd cypress-cucumber`
```

### 2\. Install Dependencies

`npm install`

### 3\. Set Up Environment Variables

Create environment variable files in the `env` directory:

#### `env/.env.local`

`MONGODB_URL=mongodb://root:example@localhost:27017
MONGODB_NAME=test`

#### `env/.env.dev`

`MONGODB_URL=mongodb://devuser:devpassword@devhost:27017
MONGODB_NAME=devdb`

### 4\. Start MongoDB with Docker Compose

`docker-compose up -d`

### 5\. Configure Cypress

Ensure the Cypress configuration file (`cypress.config.js`) is set up to load environment variables and MongoDB tasks.

`// cypress.config.js

const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const mongodbPlugin = require('./cypress/plugins/mongodb');
const dotenv = require('dotenv');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/index.js',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Load environment variables from the specified .env file
      const envFile = `.env.${process.env.CYPRESS_ENV || 'local'}`;
      const envPath = path.resolve(__dirname, `../env/${envFile}`);
      const envConfig = dotenv.config({ path: envPath }).parsed;

      // Assign the loaded variables to Cypress environment
      if (envConfig) {
        config.env = {
          ...config.env,
          ...envConfig,
        };
      }

      // Register MongoDB tasks
      mongodbPlugin(on);

      return config;
    },
  },
});`

### 6\. Define MongoDB Tasks

Create `cypress/plugins/mongodb.js` to define the MongoDB interaction tasks.

`// cypress/plugins/mongodb.js

const { MongoClient } = require('mongodb');

async function addRecord({ url, dbName, collectionName, record }) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(record);

    if (!result || !result.insertedId) {
      throw new Error('Failed to insert record');
    }

    const insertedRecord = await collection.findOne({ _id: result.insertedId });

    return insertedRecord;
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = (on) => {
  on('task', {
    addRecord
  });
};`

### 7\. Add Cypress Custom Commands

Define custom commands in `cypress/support/commands.js`.

`// cypress/support/commands.js

Cypress.Commands.add('addRecord', (collectionName, record) => {
  const url = Cypress.env('MONGODB_URL');
  const dbName = Cypress.env('MONGODB_NAME');

  return cy.task('addRecord', { url, dbName, collectionName, record });
});`

### 8\. Write Cypress Tests

Create your Cypress tests using the defined custom commands.

### 9\. Run Cypress

Run Cypress with the desired environment:

`# For local environment
npm run cypress:open:local

# For dev environment
npm run cypress:open:dev`