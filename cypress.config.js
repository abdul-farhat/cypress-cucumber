// cypress.config.js

const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const mongodbPlugin = require('./cypress/plugins/mongodb');
const axiosPlugin = require('./cypress/plugins/axios');
const dotenv = require('dotenv');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.bbc.com',
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
      const envPath = path.resolve(__dirname, `./env/${envFile}`);
      const envConfig = dotenv.config({ path: envPath }).parsed;

      // Assign the loaded variables to Cypress environment
      if (envConfig) {
        config.env = {
          ...config.env,
          ...envConfig,
        };
      }

      // Update baseUrl if TEST_URL is set in the environment variables
      if (config.env.TEST_URL) {
        config.baseUrl = config.env.TEST_URL;
      }

      // Register tasks
      mongodbPlugin(on);

      axiosPlugin(on);

      return config;
    },
  },
});
