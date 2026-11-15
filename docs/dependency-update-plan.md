# Dependency-Update-Plan: Angular 16.2 → 22.2

Arbeitsanweisung für einen Implementierungs-Agent. Stand der Recherche: 2026-11-15.
Diese Datei ist temporär und wird im letzten Schritt wieder gelöscht.

## 1. Ziel und Scope

Alle Dependencies aus `package.json` auf den neuesten **untereinander kompatiblen** Stand bringen.
Das Verhalten der App bleibt gleich. Nicht Teil des Auftrags: Umbau auf Standalone-Komponenten,
Signals, `inject()`, Zoneless, OnPush, Material 3, neuer OpenAPI-Generator (siehe Abschnitt 9).

## 2. Ausgangslage (geprüft)

- Angular-App mit einem `AppModule`, 16 NgModule-Komponenten, rund 2.000 Zeilen Code, keine Tests, kein CI.
- Installiert laut `package-lock.json`: Angular/CLI/Material/CDK **16.2.0**, TypeScript 5.1.6, zone.js 0.13.1,
  eslint 8.47.0, `@typescript-eslint/*` 5.62.0, `@angular-eslint/*` 16.1.0.
- `ng lint` läuft auf dem Ausgangsstand fehlerfrei durch.
- `ng build` scheitert auf einem frischen Checkout, weil `src/gen` fehlt (`TS2307: Cannot find module '../../../gen'`).
  `src/gen` ist in `.gitignore` und wird mit `npm run gen` aus dem laufenden Backend
  (`http://localhost:42000/v3/api-docs`) erzeugt. Siehe Abschnitt 4.
- `ngx-indexed-db` wird im Code nirgends importiert.
- Node 22.23.4 führt die Angular-16-CLI aus (offiziell unterstützt v16 nur Node 16/18).

Stellen im Code, die von Breaking Changes getroffen werden:

| Stelle | Problem | Ab |
|---|---|---|
| `src/polyfills.ts`: `import 'zone.js/dist/zone'` | Deep-Import nicht mehr erlaubt | zone.js 0.14 / Angular 17 |
| `angular.json`: `browserTarget` (serve, extract-i18n) | Option entfernt, heißt `buildTarget` | CLI 19 (Migration in 17) |
| `angular.json`: Builder `@angular-devkit/build-angular:browser` | Webpack-Builder deprecated | CLI 22 |
| `app.module.ts`: `HttpClientModule` | deprecated, Migration ersetzt es | 18 |
| alle Komponenten ohne `standalone` | Standalone ist Default | 19 |
| Templates mit `*ngIf` (24×), `*ngFor` (9×) | deprecated, Migration auf `@if`/`@for` | 20 / 21 |
| `main.ts`: `platformBrowserDynamic` | Paket deprecated | 20 |
| `app.module.ts`: `BrowserAnimationsModule` | `@angular/animations` deprecated | 20.2 |
| `AppModule` ohne `provideZoneChangeDetection()` | Zone-Scheduler nicht mehr implizit | 21 |
| alle Komponenten ohne `changeDetection` | Default wird OnPush | 22 |
| `tsconfig.json`: `strict` nicht gesetzt | TS 6.0 setzt Default auf `true` | TS 6.0 / Angular 22 |
| `tsconfig.json`: `baseUrl`, `downlevelIteration`, `moduleResolution: node` | in TS 6.0 deprecated (Fehler) | TS 6.0 / Angular 22 |
| `.eslintrc.json` | eslintrc-Format und ESLint 8 nicht mehr unterstützt | angular-eslint 22 |
| Konstruktor-Injection in 18 Dateien | Regel `prefer-inject` in `recommended` | angular-eslint 20 |
| `deep-equal` (CommonJS) | Warnung im esbuild-Builder | Application-Builder |
| `Dockerfile`: `COPY dist/controlpage-frontend` | Application-Builder schreibt nach `…/browser` | Application-Builder |

## 3. Zielversionen

| Paket | Jetzt | Ziel | Hinweis |
|---|---|---|---|
| `@angular/*` (core, common, compiler, forms, router, platform-browser, compiler-cli, language-service) | 16.2.0 | 22.2.6 | |
| `@angular/cli` | 16.2.0 | 22.2.7 | |
| `@angular/material`, `@angular/cdk` | 16.2.0 | 22.2.7 | |
| `@angular-devkit/build-angular` | 16.2.0 | entfällt | ersetzt durch `@angular/build` 22.2.7 |
| `@angular/platform-browser-dynamic` | 16.2.0 | entfällt | deprecated, `platformBrowser()` verwenden |
| `@angular/animations` | 16.2.0 | entfällt (wenn möglich) | deprecated, siehe Phase 8 |
| `typescript` | 5.1.6 | 6.0.3 | **nicht** 7.0.2: Angular 22 verlangt `>=6.0 <6.1` |
| `zone.js` | 0.13.1 | 0.16.3 | |
| `rxjs` | 7.5.7 | 7.8.2 | |
| `tslib` | 2.6.1 | 2.9.1 | |
| `ngx-mat-select-search` | 7.0.2 | 9.0.0 | |
| `ngx-indexed-db` | 11.0.2 | entfällt | unbenutzt; 22.0.0 hat zudem Peer `@angular/core < 22` |
| `deep-equal` / `@types/deep-equal` | 2.2.2 / 1.0.1 | 2.2.3 / 1.0.4 | |
| `screenfull` | 6.0.2 | 6.0.2 | bereits aktuell |
| `eslint` | 8.47.0 | 10.15.0 | Flat Config Pflicht |
| `@angular-eslint/*` (5 Pakete) | 16.1.0 | entfallen | ersetzt durch `angular-eslint` 22.6.0 |
| `@typescript-eslint/*` (2 Pakete) | 5.62.0 | entfallen | ersetzt durch `typescript-eslint` 8.72.2 |
| `@eslint/js` | – | 10.x | neu, passend zur ESLint-Major |
| `@types/node` | 18.17.5 | 22.x | an die Node-Laufzeit koppeln, nicht 26.x |
| `openapi-typescript-codegen` | 0.25.0 | 0.31.0 | nur wenn `src/gen` neu erzeugt werden kann |

Node: Angular 22 verlangt `^22.22.3 || ^24.15.0 || >=26.0.0`. Die gesamte Kette lässt sich mit Node 22.22.3+ fahren.

## 4. Voraussetzung: `src/gen`

Ohne `src/gen` gibt es kein Build und damit keine belastbare Prüfung. Vor Phase 0 klären:

1. Backend unter `http://localhost:42000` erreichbar → `npm run gen`.
2. Sonst: OpenAPI-Spec als Datei besorgen (aus `controlpage-backend`) und
   `npx openapi --input <datei> --output src/gen --client angular --useOptions` ausführen.
3. Beides nicht möglich → **stoppen und beim User nachfragen**. Keinen Client von Hand nachbauen oder stubben.

`src/gen` bleibt uncommitted. Den Generator (`openapi-typescript-codegen`) erst in Phase 8 anheben.

## 5. Arbeitsregeln

- Branch: `claude/dependencies-update-plan-ng8534`. Kein PR, außer der User verlangt ihn.
- **Ein Major pro Schritt, ein Commit pro Schritt.** `ng update` verlangt einen sauberen Working Tree.
- Migrationen von `ng update` immer laufen lassen und den Diff lesen, nicht blind übernehmen.
- Kein `--force` und kein `--legacy-peer-deps` als Dauerlösung. Wenn ein Peer-Konflikt nur so lösbar ist,
  Grund im Commit festhalten und im nächsten Schritt auflösen.
- Gate nach jedem Schritt (alle drei müssen grün sein, bevor es weitergeht):
  ```sh
  npx ng build                              # Default-Konfiguration ist production
  npx ng build --configuration development
  npx ng lint
  ```
- Nach jedem Schritt prüfen, ob `typescript` und `zone.js` im Fenster der Tabelle in Abschnitt 6 liegen
  (`npm ls typescript zone.js`); falls `ng update` sie nicht angehoben hat, von Hand setzen.
- Neue Lint-Regeln, die bestehenden Code bemängeln: Kleinigkeiten fixen, Architektur-Regeln abschalten (Abschnitt 7, Phase 6). Kein Refactoring, um Lint grün zu bekommen.
- Stop-Bedingung: Lässt sich ein Schritt nicht grün bekommen, beim letzten grünen Commit stehen bleiben und berichten.

## 6. Versionsfenster pro Schritt

| Schritt | core / cli | TypeScript | zone.js | `@angular-eslint/*` | ngx-mat-select-search |
|---|---|---|---|---|---|
| 17 | 17.3.12 / 17.3.17 | `>=5.2 <5.5` | `~0.14.0` | 17.5.3 | 7.0.10 |
| 18 | 18.2.14 / 18.2.21 | `>=5.4 <5.6` | `~0.14.10` | 18.4.3 | 7.0.10 |
| 19 | 19.2.25 / 19.2.27 | `>=5.5 <5.9` | `~0.15.0` | 19.8.1 | 8.0.6 |
| 20 | 20.3.35 / 20.3.43 | `>=5.8 <6.0` | `~0.15.0` | 20.7.0 | 8.0.6 |
| 21 | 21.2.26 / 21.2.30 | `>=5.9 <6.1` (bei 5.9 bleiben) | `~0.15.0 \|\| ~0.16.0` | 21.4.0 | 8.0.6 |
| 22 | 22.2.6 / 22.2.7 | `>=6.0 <6.1` | `~0.15.0 \|\| ~0.16.0` | `angular-eslint` 22.6.0 | 9.0.0 |

Peer-Ranges von `ngx-mat-select-search`: 7.0.10 → Material 15–19, 8.0.6 → 16–22, 9.0.0 → 17–22.
Material N erlaubt jeweils core N und N+1, daher zuerst core/cli, dann Material (oder alles in einem Befehl).

## 7. Phasen

### Phase 0 – Baseline und Vorbereitung (noch auf Angular 16)

1. `npm ci`, `src/gen` erzeugen (Abschnitt 4), Gate laufen lassen. Ergebnis notieren (Bundle-Größe, Warnungen).
2. `ngx-indexed-db` entfernen: `npm uninstall ngx-indexed-db`.
3. `ngx-mat-select-search` auf 7.0.10 anheben.
4. zone.js-Import umstellen (funktioniert schon in v16):
   - `angular.json` → `build.options.polyfills`: `["zone.js"]`
   - `src/polyfills.ts` löschen, Eintrag aus `tsconfig.app.json` → `files` entfernen.
5. Gate, Commit.

### Phase 1 – Angular 17

```sh
npx ng update @angular/core@17 @angular/cli@17 @angular-eslint/schematics@17
npx ng update @angular/material@17
```

- Migration `update-workspace-config` ersetzt `browserTarget` durch `buildTarget`. Prüfen, sonst von Hand.
- angular-eslint 17 migriert auf typescript-eslint v6. Falls `@typescript-eslint/*` auf 5.62.0 bleibt: auf `^6.21.0` setzen.
- Relevante Breaking Changes: zone.js-Deep-Imports (in Phase 0 erledigt), `NgSwitch` nutzt `===` (im Projekt kein `ngSwitch`),
  Material: Sass-`@import` der Theming-API entfällt (Projekt nutzt nur Prebuilt-CSS, nicht betroffen).
- Gate, Commit.

### Phase 2 – Angular 18

```sh
npx ng update @angular/core@18 @angular/cli@18 @angular-eslint/schematics@18
npx ng update @angular/material@18
```

- Migration `migration-http-providers` ersetzt `HttpClientModule` durch `provideHttpClient(withInterceptorsFromDi())`.
  Prüfen, dass `HTTP_INTERCEPTORS` → `RestService` weiter greift.
- `@typescript-eslint/*` auf `^8` setzen (Peer von angular-eslint 18: `^7.11.0 || ^8.0.0`), `eslint` auf `^8.57.1`.
- Die optionale Migration `use-application-builder` hier **nicht** ausführen (kommt in Phase 7).
- Gate, Commit.

### Phase 3 – Angular 19

```sh
npx ng update @angular/core@19 @angular/cli@19 @angular-eslint/schematics@19
npx ng update @angular/material@19
npm install ngx-mat-select-search@8.0.6
```

- Migration `explicit-standalone-flag` setzt `standalone: false` in allen 16 Komponenten. So lassen.
- Optionale Migration `provide-initializer`: nicht nötig (kein `APP_INITIALIZER` im Projekt).
- Lint: `@angular-eslint/prefer-standalone` ist jetzt in `recommended` → in `.eslintrc.json` auf `"off"`.
- Material 19: Token-Styles werden an Ort und Stelle statt gehoisted ausgegeben, Overlay-/Ripple-Styles laden später.
  Eigene Overrides in den `*.scss` können an Spezifität verlieren → Optik prüfen.
- Gate, Commit.

### Phase 4 – Angular 20

```sh
npx ng update @angular/core@20 @angular/cli@20 @angular-eslint/schematics@20
npx ng update @angular/material@20
```

- Migration `update-module-resolution` setzt `moduleResolution: "bundler"`.
- Optionale Migration `control-flow-migration` hier noch **nicht** ausführen (läuft in 21 automatisch).
- Lint: `@angular-eslint/prefer-inject` ist jetzt in `recommended` → auf `"off"`.
  `component-class-suffix`/`directive-class-suffix` sind aus `recommended` entfernt. Der Template-Parser unterdrückt Parse-Fehler nicht mehr.
- Material 20: `[attr.tabindex]` auf Material-Buttons funktioniert evtl. nicht mehr (im Projekt nicht verwendet).
- Gate, Commit.

### Phase 5 – Angular 21

```sh
npx ng update @angular/core@21 @angular/cli@21 @angular-eslint/schematics@21
npx ng update @angular/material@21
```

- Migration `control-flow-migration` schreibt alle Templates auf `@if`/`@for` um. Diff vollständig lesen,
  besonders die `track`-Ausdrücke der `@for`-Blöcke und die beiden `<img *ngIf>` in `background-image-renderer.component.html`.
- Migration `bootstrap-options-migration` muss `provideZoneChangeDetection()` ergänzen.
  **Prüfen**, dass es in den `providers` von `AppModule` steht. Fehlt es, von Hand ergänzen – sonst läuft keine Change Detection.
- Migration `update-typescript-lib` hebt `lib` auf `es2022`.
- TypeScript bei 5.9.x belassen (6.0 erst mit Phase 6b).
- `typeCheckHostBindings` kann bisher verdeckte Typfehler in Host-Bindings zeigen (`@HostListener` in `view-renderer`, `field-edit-section`).
- Gate, Commit.

### Phase 6 – Vorbereitung für 22 (noch auf Angular 21)

**6a – ESLint Flat Config.** angular-eslint 22 unterstützt weder ESLint 8 noch `.eslintrc`. Eine automatische Migration gibt es nicht.

```sh
npm uninstall @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template \
  @angular-eslint/schematics @angular-eslint/template-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint@^10 @eslint/js@^10 typescript-eslint@^8 angular-eslint@21
```

`.eslintrc.json` löschen, `eslint.config.js` anlegen (entspricht dem Template von `angular-eslint` 22, CommonJS, da `package.json` kein `"type": "module"` hat):

```js
// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": ["error", { type: "attribute", prefix: "app", style: "camelCase" }],
      "@angular-eslint/component-selector": ["error", { type: "element", prefix: "app", style: "kebab-case" }],
      // Architektur-Regeln: bewusst aus, Umbau ist nicht Teil des Dependency-Updates
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/prefer-inject": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
```

- `angular.json`: Builder bleibt `@angular-eslint/builder:lint`; `cli.schematicCollections` auf `["angular-eslint"]`.
- Die alte Ignore-Regel `projects/**/*` entfällt (Verzeichnis existiert nicht). Falls `src/gen` gelintet wird: `{ ignores: ["src/gen/**"] }` als ersten Eintrag ergänzen.
- typescript-eslint 8 `recommended` ist strenger als 5.62 (u. a. `no-explicit-any` als Fehler, `no-unused-expressions`, `no-empty-object-type`).
  Echte Kleinigkeiten fixen; sonst Regel gezielt mit Kommentar herabstufen.
- Gate, Commit.

**6b – tsconfig für TypeScript 6.0.** Noch mit TS 5.9 umsetzen, damit der Effekt isoliert sichtbar ist:

- `"strict": false` **explizit** setzen (TS 6.0 ändert den Default auf `true`; der Code ist nicht strict-fähig,
  z. B. `parseInt(localStorage.getItem(…))` in `user-preferences.service.ts`).
- `"baseUrl"` entfernen (keine `paths` vorhanden, keine nicht-relativen Projekt-Imports).
- `"downlevelIteration"` entfernen (in 6.0 ein Fehler, auch bei `false`; `target` ist ES2022).
- `"moduleResolution"` muss `"bundler"` sein (Phase 4).
- `tsconfig.app.json` hat bereits `"types": []` (neuer Default in 6.0).
- Nicht mit `"ignoreDeprecations": "6.0"` übertünchen – TS 7.0 entfernt die Optionen ganz.
- Gate, Commit.

### Phase 7 – Angular 22

```sh
npx ng update @angular/core@22 @angular/cli@22 angular-eslint@22
npx ng update @angular/material@22
npm install ngx-mat-select-search@9.0.0
```

Migrationen und was zu prüfen ist:

- `change-detection-eager`: setzt `changeDetection: ChangeDetectionStrategy.Eager` in allen Komponenten.
  **Muss in allen 16 Komponenten stehen** – ohne den Eintrag sind sie ab 22 OnPush, und die App
  (Getter in Templates, mutierter State, `DoCheck`) aktualisiert sich nicht mehr.
- `strict-templates-default`: setzt `strictTemplates: false`. Falls der Compiler `fullTemplateTypeCheck` ablehnt, den Eintrag entfernen.
- `strict-safe-navigation-narrow`, `safe-optional-chaining`: Diff in den Templates prüfen.
- TypeScript muss danach 6.0.x sein (nicht 7.x).
- `HttpClient` nutzt ab 22 standardmäßig `fetch`. `http-xhr-backend` ergänzt `withXhr` nur, wenn `HttpXhrBackend` direkt verwendet wird.
  Bild-Upload (`RestService.saveFile`, FormData) und die Fehlermeldung des Interceptors (`error.message`) gezielt testen.
  Bei Abweichungen `provideHttpClient(withInterceptorsFromDi(), withXhr())` setzen.
- Weitere 22er-Änderungen: `data-*`-Attribute binden keine Inputs/Outputs mehr, Elemente mit mehreren passenden Komponenten-Selektoren
  sind ein Compile-Fehler, `ComponentFactoryResolver` ist entfernt (im Projekt nicht verwendet).
- Gate, Commit.

Danach **Application-Builder** (eigener Commit):

```sh
npx ng update @angular/cli --name use-application-builder
```

- Builder werden zu `@angular/build:application` / `:dev-server` / `:extract-i18n`, `main` → `browser`,
  `buildOptimizer`/`vendorChunk` entfallen, `@angular-devkit/build-angular` wird durch `@angular/build` ersetzt.
- Ausgabe läge neu in `dist/controlpage-frontend/browser`. Damit `Dockerfile` und `scripts/build.sh` unverändert bleiben:
  `"outputPath": { "base": "dist/controlpage-frontend", "browser": "" }`.
- `"allowedCommonJsDependencies": ["deep-equal"]` in `build.options` ergänzen.
- `styles.scss`: `@import "myStyles"` → `@use "myStyles"` (Sass-`@import` ist deprecated). Der CSS-Import des Prebuilt-Themes bleibt.
- Prüfen: `ng serve` startet, Production-Build liegt direkt in `dist/controlpage-frontend/` mit `index.html`.
- Gate, Commit.

### Phase 8 – Aufräumen (auf Angular 22, je ein Commit)

1. `main.ts`: `platformBrowserDynamic` → `platformBrowser` aus `@angular/platform-browser`; `@angular/platform-browser-dynamic` deinstallieren.
2. `@angular/animations`: Material 22 hat keine Peer-Abhängigkeit mehr darauf, im Projekt gibt es keine eigenen Animationen.
   Vorher `grep -r "@angular/animations" node_modules/ngx-mat-select-search` – ist dort nichts, `BrowserAnimationsModule`
   aus `AppModule` entfernen und das Paket deinstallieren. Select-Panel, Tooltip und Button-Toggle danach prüfen. Bei Problemen diesen Schritt zurücknehmen.
3. Restliche Pakete: `rxjs@^7.8.2`, `tslib@^2.9.1`, `zone.js@~0.16.3`, `deep-equal@^2.2.3`, `@types/deep-equal@^1.0.4`, `@types/node@^22`.
4. `openapi-typescript-codegen@^0.31.0`, danach `npm run gen` und Gate. Nur wenn die Spec verfügbar ist, sonst Version belassen und im Bericht nennen.
5. `.browserslistrc` löschen (Angular-Default verwenden), falls der Build nicht unterstützte Browser meldet.
6. `README.md`: Abschnitte zu Karma/Protractor und „Angular CLI version 10.1.3" korrigieren oder entfernen; Skripte `test` und `e2e`
   in `package.json` haben kein Target in `angular.json` – entfernen.
7. `npm outdated` und `npm audit` ausführen, Rest im Bericht auflisten.
8. Diese Plan-Datei löschen.

## 8. Abnahme

Automatisch: Gate aus Abschnitt 5 grün, `npm ls` ohne `invalid`/`UNMET PEER`, keine Deprecation-Warnung beim `npm install` für direkte Dependencies.

Manuell bzw. per Headless-Browser gegen `dist/` (mit laufendem Backend, sonst so weit wie möglich):

- `#/home`, `#/settings`, `#/view` laden ohne Fehler in der Konsole.
- View-Liste lädt, View öffnen, Feld-Aktion ausführen, Vollbild (`screenfull`).
- View bearbeiten: Feld ändern, Zeile/Spalte anlegen, speichern; „ungespeicherte Änderungen" (`deep-equal`) erkennt Änderungen.
- Funktionsauswahl mit Suche (`ngx-mat-select-search`), Tastaturnavigation in der Liste.
- Bild-Upload und Anzeige (`ngSrc`), Fehler-Alert bei nicht erreichbarem Backend.
- Einstellungen ändern → UI aktualisiert sich sofort (Indikator für Change Detection).
- Fenstergröße ändern → Raster passt sich an (`@HostListener('window:resize')`).
- Optik: Toolbar, Form-Fields, Select, Checkbox, Button-Toggle, Tooltip, Card im Vergleich zum Ausgangsstand.

## 9. Bewusst nicht Teil dieses Updates

- Wechsel auf `@hey-api/openapi-ts` (`openapi-typescript-codegen` ist unmaintained; der Wechsel ändert die generierte API).
- Standalone-Komponenten, `inject()`, Signals, OnPush, Zoneless.
- Material 3 Theme. Hinweis: aktuell werden zwei Prebuilt-Themes geladen (`indigo-pink.css` in `angular.json`, `deeppurple-amber.css` in `styles.scss`).
- Tests (Vitest ist ab 21 der Default-Runner).
- TypeScript 7 (erst mit einer Angular-Version, die es unterstützt).
- `Dockerfile`: `nginx:latest` pinnen.

## 10. Quellen

- Angular: https://github.com/angular/angular/blob/main/CHANGELOG.md
- Angular CLI: https://github.com/angular/angular-cli/blob/main/CHANGELOG.md
- Material/CDK: https://github.com/angular/components/blob/main/CHANGELOG.md
- Update-Guide: https://angular.dev/update-guide?v=16.0-22.0&l=1
- angular-eslint: https://github.com/angular-eslint/angular-eslint/blob/main/CHANGELOG.md
- TypeScript 6.0: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- ngx-mat-select-search: https://github.com/bithost-gmbh/ngx-mat-select-search/blob/master/CHANGELOG.md
