export default {
  slug: 'quotile',
  name: 'Quotile',
  order: 1,
  icon: 'quotile-icon.png',
  // 'soon' or 'live'. When live, fill in the store links and they appear on the home page and the app's page.
  status: 'soon',
  platforms: ['iPhone', 'Android'],
  stores: { appStore: '', googlePlay: '' },
  summary: 'A daily logic puzzle. Spot the hidden rules in a grid of shapes and pick the missing tile. A new set every day, the same for everyone.',
  tagline: 'A daily logic puzzle.',
  description: 'Quotile is a daily logic puzzle: spot the hidden rules in a grid of shapes and pick the missing tile.',
  sections: [
    {
      title: 'How it plays',
      intro: 'Seven puzzles a day, one try at each. Everyone gets the same set, so scores compare fairly.',
      points: [
        'Each grid of nine tiles follows <strong>hidden rules</strong> along its rows or down its columns: shape, number, shading, size, colour, frames, and lines that combine, turn and move.',
        '<strong>Pick the tile that fits every rule.</strong> Get it right and you climb a level. Miss, and the next puzzle stays at the same level.',
        'Your score is the <strong>highest level you clear</strong>. Only a perfect run reaches the top.',
      ],
    },
    {
      title: 'Quotile Plus',
      intro: 'An optional purchase in the app. Everything else is there for everyone.',
      points: [
        '<strong>Unlimited practice.</strong> Without Plus you get one practice set a day.',
        '<strong>The archive.</strong> Play any past daily puzzle you missed.',
        '<strong>Expert levels 8 to 10.</strong> More rules at once, for when the daily isn\'t enough.',
      ],
    },
  ],
  support: [
    ['When does the new daily puzzle arrive?', '<p>A new set of seven puzzles starts at midnight, using the date on your phone.</p>'],
    ['I bought Quotile Plus. How do I get it on another phone, or after reinstalling?', '<p>Open the Plus screen in Quotile and tap <strong>Restore purchases</strong>. Use the same Apple ID or Google account you bought it with.</p>'],
    ['How do I cancel a Quotile Plus subscription?', '<p>Subscriptions are managed by Apple or Google, not in the game.</p><ul><li><strong>iPhone:</strong> Settings → your name → Subscriptions → Quotile.</li><li><strong>Android:</strong> Google Play → your profile picture → Payments and subscriptions → Subscriptions → Quotile.</li></ul><p>For refunds, contact Apple or Google, who handle payments.</p>'],
    ['My scores and streak have gone.', '<p>Your progress is saved on your phone, not online. Deleting the app, or clearing its data, removes it, and it doesn\'t move to a new phone. A Plus purchase can always be restored (see above).</p>'],
    ['I think a puzzle is wrong.', '<p>Every puzzle is checked to have exactly one answer, but tell us if one seems wrong: email us the date, the level, and a screenshot if you can.</p>'],
  ],
  privacy: [
    '<strong>No account, no adverts, no analytics.</strong> Quotile doesn\'t ask for your name or email, and doesn\'t track you.',
    '<strong>Saved on your phone:</strong> your results, streaks, best level and settings. They stay on your device and are removed if you delete the app. We can\'t see them.',
    '<strong>Purchases (Quotile Plus):</strong> payment is handled by Apple (App Store) or Google (Google Play). We never see your payment details. To know whether you have Plus, the app uses <a href="https://www.revenuecat.com/privacy">RevenueCat</a>, which processes purchase information for us: an anonymous ID created by the app, what you\'ve bought and when, and basic technical details such as the app version, the store and your country.',
    '<strong>Sharing a result</strong> copies a short summary (your level and time) for you to paste wherever you choose. Nothing is sent anywhere unless you send it.',
  ],
};
