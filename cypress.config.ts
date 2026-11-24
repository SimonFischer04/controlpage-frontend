import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    // overridden by the @cypress/schematic builder with the URL of the started dev server
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1600,
    viewportHeight: 1000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0
    }
  },
  // On CI (e.g. GitLab, which sets CI=true) additionally write one JUnit report per spec for the pipeline's test
  // report. The spec reporter stays enabled, so test names and failure messages still show up in the job log.
  reporter: process.env['CI'] ? 'cypress-multi-reporters' : 'spec',
  reporterOptions: {
    reporterEnabled: 'spec, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/results/junit-[hash].xml'
    }
  },
  expose: {
    // Base url of the backend the tests run against: `npm run e2e:env:up` starts one together with its database.
    // Override with e.g. CYPRESS_backendUrl=http://localhost:42001
    // (since Cypress 16, CYPRESS_* variables no longer reach the specs by themselves: read it here)
    backendUrl: process.env['CYPRESS_backendUrl'] ?? 'http://localhost:42000'
  }
});
