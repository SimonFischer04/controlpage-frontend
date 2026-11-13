# ControlPage-Frontend

## Canonical source

I do development on my [personal GitLab instance](https://gitlab.fischerserver.eu/controlpage/controlpage-frontend).

But contributions are welcome on [Gitlab.com](https://gitlab.com/controlpage/controlpage-frontend).

Furthermore, this project is mirrored to [GitHub](https://github.com/SimonFischer04/controlpage-frontend). But don't open any issues or pull requests there!

## Introduction

This is the frontend part of the ControlPage application. For more information see the [Docs](https://gitlab.com/controlpage/controlpage-docs).

## ---WIP---

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## API client

`src/gen` contains the API client generated from the backend's OpenAPI spec. It is committed, so the app builds without a backend, but must not be edited by hand.

After a change of the backend API regenerate it and commit the result:

- `npm run gen` – from a running backend (`http://localhost:42000/v3/api-docs`)
- `npm run gen:file` – from an `openapi.json` in the project root

The `api-client` CI job checks that the committed client still matches the backend (see [GitLab CI](#gitlab-ci)).

## Running end-to-end tests

The end-to-end tests are written with [Cypress](https://www.cypress.io/) and live in `cypress/`.
They drive the frontend in a browser against a **real backend with a real MariaDB database**: nothing of the backend is stubbed.

### Environment

`docker-compose.e2e.yml` provides the environment: a MariaDB and the [backend](https://gitlab.com/controlpage/controlpage-backend), built from source.

| Command                | Description                                                                                         |
|------------------------|-----------------------------------------------------------------------------------------------------|
| `npm run e2e:env:up`   | Builds and starts database + backend, returns when the backend is ready on `http://localhost:42000`. |
| `npm run e2e:env:down` | Stops them.                                                                                         |

- The backend is built from the checkout in `../controlpage-backend`. To build from somewhere else, set `BACKEND_CONTEXT` to a directory or a git url, e.g. `BACKEND_CONTEXT=https://gitlab.com/controlpage/controlpage-backend.git#main npm run e2e:env:up`.
- The database only lives in memory: every `e2e:env:up` starts with an empty database. The tests create the views they need themselves (with unique names) and never rely on an empty database, so they can run repeatedly against the same environment.
- You can also run the tests against any other backend with `CYPRESS_backendUrl=http://host:port npm run e2e`. They leave their views and images behind (the backend has no delete endpoint), so don't point them at a backend with data you care about.

### Running

| Command                                             | Description                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------|
| `npm run e2e` / `ng e2e`                            | Starts the dev server and runs all specs headless.              |
| `npm run e2e:open`                                  | Starts the dev server and opens the interactive Cypress runner. |
| `npm run e2e -- --spec cypress/e2e/view-edit.cy.ts` | Runs a single spec.                                             |

If the environment is not running, the tests fail right away with a message that says so.

### Structure

- `cypress/e2e/*.cy.ts` – the specs. They create their test data through the backend's API, use the app like a user and, where something is saved, read it back from the backend to check what really was stored.
- `cypress/support/commands.ts` – custom commands: `cy.visitApp(route, preferences)`, `cy.createView(name, fields)`, `cy.saveView(view)`, `cy.fetchView(id)`, `cy.uploadImage(fixture)`, `cy.preference(key)`.
- `cypress/support/constants.ts` – constants and types shared by commands and specs.

The only thing that is stubbed is the desktop-automation service (`http://<host>:42069`): it runs on the user's desktop and is not part of this project.
A test that talks to it has to stub it (`cy.stubDesktopAutomationFunctions()`, `cy.intercept()`), any other request to it fails the test instead of triggering something on your desktop.

### GitLab CI

`.gitlab-ci.yml` runs the e2e tests and checks the committed API client:

| Job          | Stage   | Description                                                                                                                                                                                                |
|--------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `backend`    | prepare | Clones and builds [controlpage-backend](https://gitlab.com/controlpage/controlpage-backend) (`BACKEND_REF`, default `main`), starts it with a MariaDB service and exports `openapi.json` + `backend.jar`. |
| `e2e`        | test    | Starts `backend.jar` with a MariaDB service and runs all specs against it.                                                                                                                                 |
| `api-client` | test    | Regenerates `src/gen` from the backend's `openapi.json` and compares it with the committed one. If it is outdated, the job provides an `api-client.patch` artifact (`git apply api-client.patch`).        |

Results show up in the job log and in the merge request / pipeline test report (JUnit), screenshots of failed tests and the backend log are kept as job artifacts.

An outdated API client is only a warning in regular pipelines, so a backend change does not block unrelated frontend work.
In scheduled pipelines it fails the pipeline: create a schedule (*Build → Pipeline schedules*, e.g. daily on the default branch) to get notified when the backend API changed.

The backend is cloned from `$CI_PROJECT_NAMESPACE/controlpage-backend` on the same GitLab instance using the job token.
If that project is private, add this project to its *Settings → CI/CD → Job token permissions* allowlist.
To test against another backend branch, run a pipeline with the variable `BACKEND_REF` set.
