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

End-to-end tests are written with [Cypress](https://www.cypress.io/) and live in `cypress/`.

| Command                                               | Description                                                                  |
|-------------------------------------------------------|------------------------------------------------------------------------------|
| `npm run e2e` / `ng e2e`                              | Starts the dev server and runs all specs headless.                           |
| `npm run e2e:open`                                    | Starts the dev server and opens the interactive Cypress runner.              |
| `npm run e2e -- --spec cypress/e2e/view-edit.cy.ts`   | Runs a single spec.                                                          |
| `CYPRESS_backendUrl=http://localhost:42000 npm run e2e` | Additionally runs the full-stack specs against a running backend.          |

Structure:

- `cypress/e2e/*.cy.ts` – UI tests. Every backend / desktop-automation request is stubbed with `cy.intercept()` and the fixtures from `cypress/fixtures`, so these tests need nothing but the frontend.
- `cypress/e2e/fullstack/*.cy.ts` – integration tests against a real backend. They are skipped unless `backendUrl` is set. Every run creates new, uniquely named views (`e2e-…`) and an image that are never removed (the backend has no delete endpoint), so point `backendUrl` at a backend with a throwaway database.
- `cypress/support/commands.ts` – custom commands: `cy.stubBackend()`, `cy.visitApp(route, preferences)` and `cy.preference(key)`. After `cy.stubBackend()` a request to the backend or the desktop-automation service without a stub fails the test instead of reaching a real service.

### GitLab CI

`.gitlab-ci.yml` runs all e2e tests and checks the committed API client:

| Job             | Stage   | Description                                                                                                                                                                                                |
|-----------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `e2e`           | test    | Runs the stubbed UI specs. Needs nothing but this repository, so it starts right away and is independent of the backend.                                                                                   |
| `backend`       | prepare | Clones and builds [controlpage-backend](https://gitlab.com/controlpage/controlpage-backend) (`BACKEND_REF`, default `main`), starts it with a MariaDB service and exports `openapi.json` + `backend.jar`. |
| `e2e:fullstack` | test    | Starts `backend.jar` (MariaDB service) and runs the full-stack specs against it. Fails if no test was executed.                                                                                            |
| `api-client`    | test    | Regenerates `src/gen` from the backend's `openapi.json` and compares it with the committed one. If it is outdated, the job provides an `api-client.patch` artifact (`git apply api-client.patch`).        |

Results show up in the job log and in the merge request / pipeline test report (JUnit), screenshots of failed tests and the backend log are kept as job artifacts.

An outdated API client is only a warning in regular pipelines, so a backend change does not block unrelated frontend work.
In scheduled pipelines it fails the pipeline: create a schedule (*Build → Pipeline schedules*, e.g. daily on the default branch) to get notified when the backend API changed.

The backend is cloned from `$CI_PROJECT_NAMESPACE/controlpage-backend` on the same GitLab instance using the job token.
If that project is private, add this project to its *Settings → CI/CD → Job token permissions* allowlist.
To test against another backend branch, run a pipeline with the variable `BACKEND_REF` set.
