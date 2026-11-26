// Copy this file to add an app, e.g. content/apps/my-app.mjs, and put its icon (a square PNG, 512px or more)
// in static/assets/. Files starting with "_" are ignored by the build. Then run: node build.mjs
export default {
  slug: 'my-app',               // the page address: /my-app/ (lower case, hyphens)
  name: 'My App',
  order: 99,                    // position on the home page, smallest first
  icon: 'my-app-icon.png',      // in static/assets/
  status: 'soon',               // 'soon', or 'live' once it's in a store
  platforms: ['iPhone', 'Android'],
  stores: { appStore: '', googlePlay: '' }, // store links, shown once status is 'live'
  summary: 'One or two sentences for the card on the home page.',
  tagline: 'A short line under the name on its own page.',
  description: 'One sentence for search engines.',
  sections: [
    { title: 'How it plays', intro: 'Optional line under the heading.', points: ['A point.', 'Another point.'] },
  ],
  support: [
    ['A common question?', '<p>Its answer.</p>'],
  ],
  privacy: [
    '<strong>No account, no adverts, no analytics.</strong> My App doesn\'t ask who you are and doesn\'t track you.',
  ],
};
