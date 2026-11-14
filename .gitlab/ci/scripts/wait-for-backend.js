#!/usr/bin/env node
// Waits until the backend (a service of the job) serves its OpenAPI spec.
//
//   node wait-for-backend.js [file]    optionally saves the spec to <file>
//
// BACKEND_URL            base url of the backend (default: http://localhost:42000)
// BACKEND_START_TIMEOUT  seconds to wait (default: 180)
const fs = require('fs');

const url = `${(process.env.BACKEND_URL || 'http://localhost:42000').replace(/\/$/, '')}/v3/api-docs`;
const timeout = Number(process.env.BACKEND_START_TIMEOUT || 180) * 1000;
const outputFile = process.argv[2];

async function main() {
  const start = Date.now();
  let lastError = '';

  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url, {signal: AbortSignal.timeout(5000)});
      if (response.ok) {
        const spec = await response.json();
        if (outputFile) {
          // The backend derives the server url in the spec from the host it was asked under (here: the alias of
          // the service). It ends up in the generated client, so use the one `npm run gen` sees on a developer
          // machine. (The app sets the real backend url at runtime, the value is never used.)
          spec.servers = [{url: 'http://localhost:42000', description: 'Generated server url'}];
          fs.writeFileSync(outputFile, JSON.stringify(spec));
        }
        console.log(`Backend is up at ${url} (after ${Math.round((Date.now() - start) / 1000)}s)`);
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = String(error.cause || error);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.error(`Backend did not answer at ${url} within ${timeout / 1000}s (${lastError}).`);
  console.error('Is the image of the backend (BACKEND_IMAGE) available, and can the job pull it?');
  process.exit(1);
}

main();
