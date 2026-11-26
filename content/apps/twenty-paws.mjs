export default {
  slug: 'twenty-paws',
  name: 'Twenty Paws',
  order: 2,
  icon: 'twenty-paws-icon.png',
  status: 'soon',
  platforms: ['iPhone', 'Android'],
  stores: { appStore: '', googlePlay: '' },
  summary: 'Which animal is it? Ask up to twenty yes-or-no questions to work out the day\'s animal.',
  tagline: 'Which animal is it?',
  description: 'Twenty Paws is an animal guessing game: ask up to twenty yes-or-no questions to work out the day\'s animal.',
  sections: [
    {
      title: 'How it plays',
      intro: 'A new animal every day, and practice animals whenever you like.',
      points: [
        '<strong>Pick yes-or-no questions</strong> to narrow it down, one at a time.',
        'You have <strong>twenty questions</strong> to work it out, and every guess uses one.',
        'Played today\'s animal? <strong>Come back tomorrow</strong> for a new one, or keep going with a practice animal.',
      ],
    },
    {
      title: 'Turning it round',
      intro: 'In development alongside it.',
      points: [
        '<strong>Twenty Paws AI</strong> swaps sides: you think of any animal at all, and the game asks the questions and tries to guess it in twenty.',
      ],
    },
  ],
  support: [
    ['It says I\'ve played today\'s animal.', '<p>There\'s one daily animal. Come back tomorrow for a new one, or play a practice animal in the meantime.</p>'],
    ['My results have gone.', '<p>Results are saved on your phone, not online. Deleting the app, or clearing its data, removes them.</p>'],
  ],
  privacy: [
    '<strong>No account, no adverts, no analytics.</strong> Twenty Paws doesn\'t ask who you are and doesn\'t track you.',
    '<strong>Saved on your phone:</strong> your results and settings. They stay on your device and are removed if you delete the app.',
    'Twenty Paws doesn\'t send anything to us or to anyone else.',
    // Replace this before Twenty Paws AI is released: say what it sends, to whom (Anthropic's Claude, via our server), and what's kept.
    '<strong>Twenty Paws AI</strong>, the version where the game does the guessing, is still in development. Before it\'s released we\'ll add how it handles your answers here.',
  ],
};
