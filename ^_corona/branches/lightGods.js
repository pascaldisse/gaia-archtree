/**
 * lightGods.js - 16 Light Gods (Yggdrasil Branches)
 * Divine light realm - branches reaching toward earth
 */

export const lightBranches = {
  // Anima Realm (5 gods) - Soul and Life Force
  anima: {
    artemis: {
      id: 'light_0',
      name: 'Artemis',
      realm: 'anima',
      domain: 'Nature & Hunt',
      power: 'Wild Code Generation',
      energy: 100,
      tools: ['arrows', 'bow', 'moonlight']
    },
    freyr: {
      id: 'light_1', 
      name: 'Freyr',
      realm: 'anima',
      domain: 'Prosperity & Fertility',
      power: 'Abundant Solutions',
      energy: 95,
      tools: ['harvest', 'abundance', 'growth']
    },
    heimdall: {
      id: 'light_2',
      name: 'Heimdall',
      realm: 'anima', 
      domain: 'Guardian & Watcher',
      power: 'Code Surveillance',
      energy: 98,
      tools: ['bifrost', 'horn', 'sight']
    },
    hermes: {
      id: 'light_3',
      name: 'Hermes',
      realm: 'anima',
      domain: 'Communication & Speed',
      power: 'Rapid Execution',
      energy: 92,
      tools: ['caduceus', 'wings', 'messages']
    },
    tyr: {
      id: 'light_4',
      name: 'Tyr',
      realm: 'anima',
      domain: 'Justice & Courage',
      power: 'Righteous Code',
      energy: 90,
      tools: ['sword', 'justice', 'sacrifice']
    }
  },

  // Logos Realm (4 gods) - Logic and Wisdom
  logos: {
    athena: {
      id: 'light_5',
      name: 'Athena',
      realm: 'logos',
      domain: 'Wisdom & Strategy',
      power: 'Strategic Planning',
      energy: 100,
      tools: ['owl', 'shield', 'strategy']
    },
    odin: {
      id: 'light_6',
      name: 'Odin',
      realm: 'logos',
      domain: 'Knowledge & Magic',
      power: 'Deep Understanding',
      energy: 100,
      tools: ['gungnir', 'ravens', 'runes']
    },
    thor: {
      id: 'light_7',
      name: 'Thor',
      realm: 'logos',
      domain: 'Strength & Protection',
      power: 'Powerful Execution',
      energy: 95,
      tools: ['mjolnir', 'thunder', 'strength']
    },
    zeus: {
      id: 'light_8',
      name: 'Zeus',
      realm: 'logos',
      domain: 'Authority & Sky',
      power: 'Divine Command',
      energy: 100,
      tools: ['lightning', 'eagle', 'authority']
    }
  },

  // Silva Realm (7 gods) - Nature and Growth  
  silva: {
    baldr: {
      id: 'light_9',
      name: 'Baldr',
      realm: 'silva',
      domain: 'Light & Purity',
      power: 'Pure Code',
      energy: 98,
      tools: ['light', 'purity', 'peace']
    },
    bragi: {
      id: 'light_10',
      name: 'Bragi',
      realm: 'silva', 
      domain: 'Poetry & Eloquence',
      power: 'Elegant Code',
      energy: 88,
      tools: ['harp', 'poetry', 'eloquence']
    },
    demeter: {
      id: 'light_11',
      name: 'Demeter',
      realm: 'silva',
      domain: 'Harvest & Agriculture',
      power: 'Cultivated Growth',
      energy: 93,
      tools: ['wheat', 'seasons', 'fertility']
    },
    hephaestus: {
      id: 'light_12',
      name: 'Hephaestus',
      realm: 'silva',
      domain: 'Forge & Craftsmanship',
      power: 'Code Crafting',
      energy: 96,
      tools: ['hammer', 'forge', 'craft']
    },
    poseidon: {
      id: 'light_13',
      name: 'Poseidon',
      realm: 'silva',
      domain: 'Ocean & Earthquakes',
      power: 'Fluid Dynamics',
      energy: 94,
      tools: ['trident', 'waves', 'horses']
    },
    vidar: {
      id: 'light_14',
      name: 'Vidar',
      realm: 'silva',
      domain: 'Silence & Vengeance',
      power: 'Silent Execution',
      energy: 87,
      tools: ['boot', 'silence', 'strength']
    },
    apollo: {
      id: 'light_15',
      name: 'Apollo',
      realm: 'silva',
      domain: 'Sun & Arts',
      power: 'Illuminated Code',
      energy: 100,
      tools: ['lyre', 'sun', 'prophecy']
    }
  }
};

export const lightGodsList = [
  'artemis', 'freyr', 'heimdall', 'hermes', 'tyr',
  'athena', 'odin', 'thor', 'zeus', 
  'baldr', 'bragi', 'demeter', 'hephaestus', 'poseidon', 'vidar', 'apollo'
];

export const getLightGod = (name) => {
  for (const realm of Object.values(lightBranches)) {
    if (realm[name]) {
      return realm[name];
    }
  }
  return null;
};

export const getAllLightGods = () => {
  const gods = [];
  for (const realm of Object.values(lightBranches)) {
    gods.push(...Object.values(realm));
  }
  return gods;
};