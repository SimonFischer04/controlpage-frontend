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
  // on CI (e.g. GitLab, which sets CI=true) write one JUnit report per spec for the pipeline's test report
  reporter: process.env['CI'] ? 'junit' : 'spec',
  reporterOptions: {
    mochaFile: 'cypress/results/junit-[hash].xml'
  },
  env: {
    // Base URL of a running controlpage-backend. When set, the full-stack specs in
    // cypress/e2e/fullstack run against it, otherwise they are skipped.
    // e.g.: CYPRESS_backendUrl=http://localhost:42000 npm run e2e
    backendUrl: ''
  }
});
