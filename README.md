# EAV Solutions website

The public website for EAV Solutions Ltd: what the company does, its apps, support, and privacy. Plain HTML and CSS,
built by one small script with no dependencies, and nothing loaded from other companies (fonts are in `static/assets/`),
so it can go on any static host.

## How it's put together
- `content/site.mjs`: company details (name, email, company number, registered office) and the privacy page's date.
- `content/apps/*.mjs`: one file per app. Each holds its card text, page sections, support questions and privacy
  section. The home page, footer, support page and privacy page are all built from these files.
- `static/`: copied into the site as it is. `static/assets/site.css` holds all the styling, with the light and dark
  colours at the top; app icons are in `static/assets/`.
- `build.mjs`: builds everything into `public/`, which is what gets hosted. `public/` isn't committed.

```sh
node build.mjs
python3 -m http.server 4000 --directory public   # then open http://localhost:4000
```

## Adding an app
1. Copy `content/apps/_template.mjs` to `content/apps/<slug>.mjs` and fill it in.
2. Put its icon (a square PNG, 512px or more) in `static/assets/`.
3. Run `node build.mjs`. The app gets its own page at `/<slug>/` and a card on the home page. Its questions are added
   to the support page and its section to the privacy page, at `#<slug>` on each.

When an app is released, set `status: 'live'` and fill in its store links: the "Coming soon" label goes and store
buttons appear. To take an app off the site, delete its file.

## The logo
Building blocks: four rounded tiles, with the top-right one tilted as it's lifted into place. It's drawn in `logo()` in
`build.mjs` and used for both the header and `favicon.svg`.

## Before it goes live: fill in the placeholders
These are all in `content/site.mjs`:
- `[contact email]`: ideally on the website's own domain (Apple checks this).
- `[company number]` and `[registered office address]`: exactly as on Companies House.
- `[England and Wales]`: or Scotland / Northern Ireland, wherever the company is registered.

UK company websites must show the registered name, number, registered office and where it's registered,
which is what the footer is for.

## Hosting
Any static host works. Free options that take a custom domain and HTTPS: Azure Static Web Apps, GitHub Pages,
Cloudflare Pages or Netlify. Set the build command to `node build.mjs` and the output folder to `public`, or run the
build yourself and upload `public/`. `404.html` is picked up automatically by most hosts.

## For Apple's organisation enrolment
- The site must be live on a domain the company owns, and the Apple ID you enrol with should use an email address on
  that domain.
- The company name must match its D-U-N-S record (check or request one through Apple's D-U-N-S lookup), and the
  company must be active on Companies House.
- When submitting each app, use its support and privacy sections as the Support URL and Privacy Policy URL, for
  example `https://<domain>/support.html#quotile` and `https://<domain>/privacy.html#quotile`.

## Keeping it true
Each app's privacy section describes what it does with data. Update it, and `privacyUpdated` in `content/site.mjs`,
before releasing a version that changes that: for example Twenty Paws AI (which will send answers to Claude), adding
analytics, or anything that leaves the phone.
