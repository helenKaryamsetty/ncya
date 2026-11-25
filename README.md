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

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy to Cloudflare Pages

This project is configured for a static Cloudflare Pages deployment. The Angular build generates the site in `dist/ncya/browser`; the Express SSR server is not required to host the current site.

For Git-based deployment, create a Cloudflare Pages project connected to this repository. Use `npm run build` as the build command and `dist/ncya/browser` as the build output directory. The `wrangler.jsonc` file records the same Pages output directory, and `public/_redirects` keeps client-side routes working.

To deploy from the command line after building, run:

```sh
npx wrangler pages deploy dist/ncya/browser --project-name ncya
```

Cloudflare will prompt you to authenticate and select or create the Pages project the first time.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
