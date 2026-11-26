// Builds the EAV Solutions website into public/. No dependencies: run with `node build.mjs`.
// Content lives in content/: site.mjs for company details, and one file per app in content/apps/.
// Files in static/ are copied into public/ as they are.
import { writeFileSync, mkdirSync, readdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');
const site = (await import(pathToFileURL(join(ROOT, 'content/site.mjs')))).default;

const appDir = join(ROOT, 'content/apps');
const apps = (await Promise.all(readdirSync(appDir)
  .filter(f => f.endsWith('.mjs') && !f.startsWith('_'))
  .map(async f => (await import(pathToFileURL(join(appDir, f)))).default)))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

for (const a of apps) {
  if (!existsSync(join(ROOT, 'static/assets', a.icon))) throw new Error(`${a.name}: icon static/assets/${a.icon} is missing`);
}

const EMAIL = site.email;
const YEAR = new Date().getFullYear();

// ---------- the logo ----------
// Building blocks: four rounded tiles, with the top-right one being lifted into place.
function logo(bg, ink) {
  return `<rect width="32" height="32" rx="7.5" fill="${bg}"/>`
    + `<g fill="${ink}">`
    + `<rect x="6.5" y="16.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="16.5" y="16.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="6.5" y="6.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="17.2" y="5.2" width="9" height="9" rx="2.2" transform="rotate(14 21.7 9.7)" opacity=".75"/>`
    + `</g>`;
}
const mark = `<svg viewBox="0 0 32 32" aria-hidden="true">${logo('var(--accent)', 'var(--accent-ink)')}</svg>`;

// ---------- shared bits ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs.at(-1);
const platformTag = a => (a.status === 'live' ? '' : 'Coming soon · ') + andList(a.platforms);
const storeLinks = a => a.status !== 'live' ? '' : [
  a.stores?.appStore && `<a class="btn btn-primary" href="${a.stores.appStore}">Download on the App Store</a>`,
  a.stores?.googlePlay && `<a class="btn btn-ghost" href="${a.stores.googlePlay}">Get it on Google Play</a>`,
].filter(Boolean).join('\n        ');

function page({ path, title, description, nav, body }) {
  const up = '../'.repeat(path.split('/').length - 1);
  const link = (href, text, key) => `<a href="${up}${href}"${nav === key ? ' aria-current="page"' : ''}>${text}</a>`;
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${up}assets/fonts.css">
<link rel="stylesheet" href="${up}assets/site.css">
</head>
<body>
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="${up}./">${mark}<span>${site.name}</span></a>
    <nav class="site-nav" aria-label="Main">
      ${link('./#apps', 'Apps', 'apps')}
      ${link('./#about', 'About', 'about')}
      ${link('support.html', 'Support', 'support')}
      ${link('./#contact', 'Contact', 'contact')}
    </nav>
  </div>
</header>
<main>
${body.trim()}
</main>
<footer class="site-foot">
  <div class="wrap">
    <nav class="foot-links" aria-label="Footer">
      <a href="${up}./">Home</a>
      ${apps.map(a => `<a href="${up}${a.slug}/">${a.name}</a>`).join('\n      ')}
      <a href="${up}support.html">Support</a>
      <a href="${up}privacy.html">Privacy</a>
    </nav>
    <p class="legal">${site.legalName} is a private limited company registered in ${site.registeredIn}, company number ${site.companyNumber}. Registered office: ${site.registeredOffice}.</p>
    <p class="legal">© ${YEAR} ${site.legalName}. App Store is a service mark of Apple Inc. Google Play is a trademark of Google LLC.</p>
  </div>
</footer>
</body>
</html>
`;
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const contactBlock = `<div class="contact">
  <p class="eyebrow">Email</p>
  <p class="email"><a href="mailto:${EMAIL}">${EMAIL}</a></p>
  <p class="muted" style="margin:0">For help with one of our apps, say which app and which phone you're using. We'll get back to you as soon as we can.</p>
</div>`;

// The home page picture: the apps' own icons, with one open space for whatever comes next.
const shown = apps.slice(0, 8);
const cols = shown.length + 1 <= 4 ? 2 : 3;
const iconGrid = `<div class="icon-grid" style="--cols:${cols}" role="img" aria-label="App icons for ${esc(andList(shown.map(a => a.name)))}">
${shown.map(a => `  <img src="assets/${a.icon}" alt="" width="120" height="120">`).join('\n')}
  <span class="next" aria-hidden="true">+</span>
</div>`;

// ---------- clean and copy ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'static'), OUT, { recursive: true });
writeFileSync(join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${logo('#2347C5', '#FFFFFF')}</svg>\n`);

// ---------- home ----------
const soon = apps.filter(a => a.status !== 'live');
const live = apps.filter(a => a.status === 'live');
const word = n => ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n);
const cap = s => s[0].toUpperCase() + s.slice(1);
const appsIntro = live.length
  ? `${cap(word(live.length))} ${live.length === 1 ? 'app is' : 'apps are'} out now${soon.length ? `, and ${word(soon.length)} more ${soon.length === 1 ? 'is' : 'are'} on the way` : ''}.`
  : `${cap(word(soon.length))} ${soon.length === 1 ? 'app is' : 'apps are'} on the way, coming first to the App Store.`;

page({
  path: 'index.html', nav: 'home',
  title: `${site.name} · Games and apps`,
  description: `${site.name} is a UK company designing and building games and apps for iPhone, Android and the web.`,
  body: `
<section class="hero">
  <div class="wrap">
    <div>
      <span class="eyebrow">Games and apps · United Kingdom</span>
      <h1>Small apps, made with care.</h1>
      <p class="lead">${site.name} designs and builds games and apps for iPhone, Android and the web: easy to pick up, fair to play, and kind to your privacy.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#apps">See our apps</a>
        <a class="btn btn-ghost" href="#contact">Get in touch</a>
      </div>
    </div>
    <div class="hero-art">
${iconGrid}
    </div>
  </div>
</section>

<section id="apps">
  <div class="wrap">
    <span class="eyebrow">${live.length ? 'Our apps' : 'In development'}</span>
    <h2>What we're making</h2>
    <p class="muted narrow">${appsIntro}</p>
    <div class="cards">
${apps.map(a => `      <article class="card">
        <img class="icon" src="assets/${a.icon}" alt="" width="72" height="72">
        <span class="tag">${platformTag(a)}</span>
        <h3>${a.name}</h3>
        <p>${a.summary}</p>
        <a class="more" href="${a.slug}/">About ${a.name} →</a>
      </article>`).join('\n')}
    </div>
  </div>
</section>

<section>
  <div class="wrap split">
    <div>
      <span class="eyebrow">How we make them</span>
      <h2>Quick to pick up, fair to play</h2>
    </div>
    <ul class="points">
      <li><strong>No adverts and no tracking.</strong> Our apps don't follow you around or sell your data, and you don't need an account to play.</li>
      <li><strong>Your progress stays on your phone.</strong> Scores, streaks and saved games are kept on your device, not on our servers.</li>
      <li><strong>Clear about anything you buy.</strong> Optional extras are sold through the App Store or Google Play, with the price shown up front.</li>
    </ul>
  </div>
</section>

<section id="about">
  <div class="wrap split">
    <div>
      <span class="eyebrow">About</span>
      <h2>About ${site.name}</h2>
    </div>
    <div>
      <p>${site.legalName} was set up to provide software development and technical consultancy, building software for clients.</p>
      <p>Today the company makes its own products: games and apps for phones and the web, designed, built and published in-house in the United Kingdom.</p>
    </div>
  </div>
</section>

<section id="contact">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Contact</span>
      <h2>Get in touch</h2>
      <p class="muted">Questions, feedback, or help with one of our apps. The <a href="support.html">support page</a> answers the common questions.</p>
    </div>
    ${contactBlock}
  </div>
</section>`,
});

// ---------- one page per app ----------
for (const a of apps) {
  const stores = storeLinks(a);
  page({
    path: a.slug + '/index.html', nav: 'apps',
    title: `${a.name} · ${site.name}`, description: a.description,
    body: `
<section class="hero">
  <div class="wrap" style="display:block">
    <div class="app-head">
      <img src="../assets/${a.icon}" alt="${esc(a.name)} app icon" width="120" height="120">
      <div>
        <span class="tag">${platformTag(a)}</span>
        <h1 style="margin-top:12px">${a.name}</h1>
        <p>${a.tagline}</p>
      </div>
    </div>${stores ? `
    <div class="btn-row">
        ${stores}
    </div>` : ''}
  </div>
</section>
${a.sections.map(s => `
<section>
  <div class="wrap split">
    <div>
      <h2>${s.title}</h2>
      ${s.intro ? `<p class="muted">${s.intro}</p>` : ''}
    </div>
    <ul class="points">
      ${s.points.map(p => `<li>${p}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`).join('')}
<section>
  <div class="wrap split">
    <div>
      <h2>Help and privacy</h2>
      <p class="muted">Questions about ${a.name}, or how it handles your information.</p>
    </div>
    <div>
      <div class="btn-row" style="margin-top:0">
        <a class="btn btn-primary" href="../support.html#${a.slug}">${a.name} support</a>
        <a class="btn btn-ghost" href="../privacy.html#${a.slug}">${a.name} privacy</a>
      </div>
    </div>
  </div>
</section>`,
  });
}

// ---------- support ----------
const faq = list => list.map(([q, ans]) => `<details>
  <summary>${q}</summary>
  ${ans}
</details>`).join('\n');
const toc = items => `<ul class="toc">
${items.map(([id, text]) => `      <li><a href="#${id}">${text}</a></li>`).join('\n')}
    </ul>`;

page({
  path: 'support.html', nav: 'support',
  title: `Support · ${site.name}`,
  description: `Help with ${andList(apps.map(a => a.name))}, and how to contact ${site.name}.`,
  body: `
<section>
  <div class="wrap narrow prose">
    <span class="eyebrow">Support</span>
    <h1>How can we help?</h1>
    <p class="muted">Answers to common questions about our apps. If yours isn't here, email <a href="mailto:${EMAIL}">${EMAIL}</a> and tell us which app, which phone, and what happened.</p>
    ${toc([...apps.map(a => [a.slug, a.name]), ['contact', 'Contact']])}
${apps.map(a => `
    <h2 id="${a.slug}">${a.name}</h2>
${faq(a.support)}`).join('\n')}

    <h2 id="contact">Contact</h2>
    ${contactBlock}
  </div>
</section>`,
});

// ---------- privacy ----------
page({
  path: 'privacy.html', nav: 'privacy',
  title: `Privacy · ${site.name}`,
  description: `How ${site.name}, its website and its apps handle your information.`,
  body: `
<section>
  <div class="wrap narrow prose">
    <span class="eyebrow">Privacy</span>
    <h1>Privacy</h1>
    <p class="muted">Last updated ${site.privacyUpdated}.</p>
    <div class="summary">
      <p><strong>In short:</strong> our apps don't ask who you are, don't show adverts and don't track you. Your progress is saved on your own phone. If you buy something, Apple or Google take the payment, and each app's section below says which other services, if any, are involved.</p>
    </div>
    ${toc([['who', 'Who we are'], ['website', 'This website'], ...apps.map(a => [a.slug, a.name]), ['rights', 'Your rights']])}

    <h2 id="who">Who we are</h2>
    <p>This website and the apps described here are made by ${site.legalName}, a company registered in ${site.registeredIn} (company number ${site.companyNumber}), registered office ${site.registeredOffice}. For anything about privacy, email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>

    <h2 id="website">This website</h2>
    <p>This website doesn't use cookies, analytics or tracking, and it doesn't load anything from other companies: its fonts are hosted here too. Like any website, our hosting provider may keep short-lived technical logs (such as IP addresses and the pages requested) to keep the site running and secure.</p>
    <p>If you email us, we use your email address and what you tell us only to reply, and we keep the conversation only as long as we need it.</p>
${apps.map(a => `
    <h2 id="${a.slug}">${a.name}</h2>
    <ul>
      ${a.privacy.map(p => `<li>${p}</li>`).join('\n      ')}
    </ul>`).join('\n')}

    <h2 id="children">Children</h2>
    <p>Our apps are made to be enjoyed by all ages, and some are designed for children to play with a grown-up. Because the apps don't collect personal information, they don't collect it from children either.</p>

    <h2 id="rights">Your rights</h2>
    <p>Under UK data protection law you can ask what personal information we hold about you, and ask us to correct or delete it. Because our apps keep your information on your own phone, deleting the app removes it. For anything else, email <a href="mailto:${EMAIL}">${EMAIL}</a>. If you're unhappy with how we've handled your information, you can complain to the <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner's Office</a>.</p>

    <h2 id="changes">Changes</h2>
    <p>If an app starts handling information differently, we'll update this page before that version is released, and change the date at the top.</p>
  </div>
</section>`,
});

// ---------- 404 ----------
page({
  path: '404.html', nav: '',
  title: `Page not found · ${site.name}`,
  description: 'This page could not be found.',
  body: `
<section class="hero">
  <div class="wrap narrow">
    <span class="eyebrow">404</span>
    <h1>That page isn't here.</h1>
    <p class="lead muted">It may have moved, or the link may be wrong.</p>
    <div class="btn-row"><a class="btn btn-primary" href="/">Go to the home page</a></div>
  </div>
</section>`,
});

console.log(`Built ${apps.length} apps into public/: ${apps.map(a => a.name).join(', ')}`);
