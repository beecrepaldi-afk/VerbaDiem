import { DailyWord } from './types';

// A small, curated deck of words to be used as a fallback when the API is unavailable.
// This ensures the app remains functional offline.
export const offlineDeck: DailyWord[] = [
  {
    word: "Ephemeral",
    pronunciation: "uh-FEM-er-uhl",
    translation: "Efêmero",
    etymology: "Originating from the Greek 'ephemeros', meaning 'lasting only one day'. It perfectly captures things that are fleeting and transient, like a mayfly's life or a beautiful sunset.",
    example: "The beauty of the cherry blossoms is ephemeral.",
    exampleTranslation: "A beleza das flores de cerejeira é efêmera."
  },
  {
    word: "Serendipity",
    pronunciation: "ser-en-DIP-i-tee",
    translation: "Serendipidade",
    etymology: "Coined by Horace Walpole in 1754, from the Persian fairy tale 'The Three Princes of Serendip', whose heroes were always making discoveries by accident and sagacity of things they were not in quest of.",
    example: "Finding a ten-dollar bill in an old coat was a moment of serendipity.",
    exampleTranslation: "Encontrar uma nota de dez dólares em um casaco velho foi um momento de serendipidade."
  },
  {
    word: "Lethargy",
    pronunciation: "LETH-er-jee",
    translation: "Letargia",
    etymology: "From Greek 'lēthargos' (forgetful, drowsy), which itself comes from 'lēthē', the name of a river in the underworld of Greek mythology. Drinking from the River Lethe caused forgetfulness.",
    example: "A feeling of lethargy washed over him after the big meal.",
    exampleTranslation: "Uma sensação de letargia tomou conta dele após a grande refeição."
  },
   {
    word: "Mellifluous",
    pronunciation: "muh-LIF-loo-us",
    translation: "Melífluo",
    etymology: "From the Latin words 'mel' (honey) and 'fluere' (to flow). It literally means 'flowing with honey' and is used to describe a voice or sound that is sweet and smooth.",
    example: "She had a mellifluous voice that was perfect for radio.",
    exampleTranslation: "Ela tinha uma voz melíflua que era perfeita para rádio."
  },
];
