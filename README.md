# Ncya

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Application structure

- `src/app/app.component.*` composes the page from standalone components.
- `src/app/hero/` contains the header and hero component's TypeScript, HTML, and CSS.
- `src/app/community/` contains the community, nights, and events component's TypeScript, HTML, and CSS.
- `src/app/connect/` contains the connection cards, contact form, church section, and footer component's TypeScript, HTML, and CSS. Its TypeScript manages the WhatsApp link and prayer QR code.
- `src/styles.css` contains shared design tokens, resets, and reusable layout and button styles. Feature-specific styles live alongside each component.

Feature styles use `ViewEncapsulation.None` to preserve the existing global selectors, including styles for SVGs rendered by Lucide. Keep feature selectors specific to their section to avoid unintended cross-component effects.

## Development server

Run `npm run start:worker` in one terminal and `npm start` in another. Open `http://localhost:4200/`. Angular proxies `/api/` requests to the local Worker on port 8799. Restart Angular after changing `proxy.conf.json` or `angular.json`. The Worker needs a production build in `dist/ncya/browser`; run `npm run build` first if it does not exist.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy to Cloudflare Workers

Use Node.js 22 or newer for Wrangler. Run `npm run build` first, then run `npx wrangler deploy`. Wrangler serves the production files in `dist/ncya/browser` and falls back to `index.html` for client-side routes.

## Visitor registration and Google Sheets

The home page is the registration screen, so point the QR code to the deployed site's home URL. Visitors enter the site only after their details are saved. A successful registration is remembered for the current browser tab, including refreshes; no visitor details are stored in the browser. The Cloudflare Worker forwards registrations to Google Apps Script; `ng serve` alone does not run the Worker endpoint. Deploy with `wrangler deploy`, not the legacy Pages deployment script, so the endpoint is included.

1. The supplied Apps Script web app URL is configured in `wrangler.jsonc`. Its deployed code specifies the Google Sheet ID. Restrict access to that sheet to the people who need the visitor information.
2. The deployed web app must execute as its owner and be accessible to **Anyone**. Deploy a new version after changing the script.
3. Run `npm run build` and `npx wrangler deploy`. Submit a test registration using a 10-digit Indian mobile number and confirm it appears in the `Registrations` tab. Update the QR code to the deployed home URL.

The repository's `google-apps-script/Code.gs` is an alternative copy that reads the sheet ID from the `SHEET_ID` script property instead of hard-coding it. If deploying that copy, set `SHEET_ID` as well. If `GOOGLE_SCRIPT_URL` was previously added as a Cloudflare secret, remove that old secret before deploying the configured variable.

The form collects personal information. Share an appropriate privacy notice and retain the sheet only as long as needed. The script treats values beginning with spreadsheet formula characters as text. Without a secret, anyone with the Apps Script URL can submit rows directly; consider abuse protection before using this publicly.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
