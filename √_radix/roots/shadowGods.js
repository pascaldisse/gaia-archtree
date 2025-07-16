/**
 * shadowGods.js - 16 Shadow Gods (Ashvattha Roots)
 * Divine shadow realm - roots reaching toward cosmic depths
 */

export const shadowRoots = {
  // Anima Realm (5 gods) - Dark Life Force
  anima: {
    hades: {
      id: 'shadow_0',
      name: 'Hades',
      realm: 'anima',
      domain: 'Underworld & Death',
      power: 'Deep Memory Management',
      energy: 100,
      tools: ['helmet', 'underworld', 'souls']
    },
    loki: {
      id: 'shadow_1',
      name: 'Loki',
      realm: 'anima',
      domain: 'Chaos & Trickery',
      power: 'Creative Chaos',
      energy: 95,
      tools: ['shapeshifting', 'fire', 'cunning']
    },
    mara: {
      id: 'shadow_2',
      name: 'Mara',
      realm: 'anima',
      domain: 'Temptation & Illusion',
      power: 'Edge Case Generation',
      energy: 88,
      tools: ['illusion', 'temptation', 'shadows']
    },
    nyx: {
      id: 'shadow_3',
      name: 'Nyx',
      realm: 'anima',
      domain: 'Night & Darkness',
      power: 'Hidden Logic',
      energy: 92,
      tools: ['night', 'stars', 'darkness']
    },
    rahu: {
      id: 'shadow_4',
      name: 'Rahu',
      realm: 'anima',
      domain: 'Eclipse & Obsession',
      power: 'Consuming Algorithms',
      energy: 90,
      tools: ['eclipse', 'hunger', 'shadow']
    }
  },

  // Logos Realm (4 gods) - Dark Logic
  logos: {
    durga: {
      id: 'shadow_5',
      name: 'Durga',
      realm: 'logos',
      domain: 'Divine Warrior',
      power: 'Protective Destruction',
      energy: 100,
      tools: ['weapons', 'lion', 'protection']
    },
    kali: {
      id: 'shadow_6',
      name: 'Kali',
      realm: 'logos', 
      domain: 'Time & Destruction',
      power: 'Temporal Manipulation',
      energy: 100,
      tools: ['sword', 'time', 'destruction']
    },
    shiva: {
      id: 'shadow_7',
      name: 'Shiva',
      realm: 'logos',
      domain: 'Destruction & Renewal',
      power: 'Transformative Destruction',
      energy: 100,
      tools: ['trident', 'dance', 'transformation']
    },
    yama: {
      id: 'shadow_8',
      name: 'Yama',
      realm: 'logos',
      domain: 'Death & Justice',
      power: 'Final Judgment',
      energy: 95,
      tools: ['staff', 'buffalo', 'judgment']
    }
  },

  // Silva Realm (7 gods) - Dark Nature
  silva: {
    fenrir: {
      id: 'shadow_9',
      name: 'Fenrir',
      realm: 'silva',
      domain: 'Chaos Wolf',
      power: 'Unbound Algorithms',
      energy: 98,
      tools: ['chains', 'fangs', 'prophecy']
    },
    hel: {
      id: 'shadow_10',
      name: 'Hel',
      realm: 'silva',
      domain: 'Half-Death',
      power: 'Liminal Processing',
      energy: 88,
      tools: ['half-body', 'death', 'boundary']
    },
    mahakala: {
      id: 'shadow_11',
      name: 'Mahakala',
      realm: 'silva',
      domain: 'Great Time',
      power: 'Cosmic Timing',
      energy: 93,
      tools: ['skull', 'time', 'cosmic']
    },
    morrigan: {
      id: 'shadow_12',
      name: 'Morrigan',
      realm: 'silva',
      domain: 'War & Fate',
      power: 'Prophetic Algorithms',
      energy: 96,
      tools: ['crow', 'battle', 'prophecy']
    },
    set: {
      id: 'shadow_13',
      name: 'Set',
      realm: 'silva',
      domain: 'Chaos & Desert',
      power: 'Entropy Generation',
      energy: 94,
      tools: ['storm', 'desert', 'chaos']
    },
    thanatos: {
      id: 'shadow_14',
      name: 'Thanatos',
      realm: 'silva',
      domain: 'Death Personified',
      power: 'Process Termination',
      energy: 87,
      tools: ['sword', 'wings', 'finality']
    },
    ahriman: {
      id: 'shadow_15',
      name: 'Ahriman',
      realm: 'silva',
      domain: 'Destructive Spirit',
      power: 'Corrupting Logic',
      energy: 85,
      tools: ['darkness', 'corruption', 'opposition']
    }
  }
};

export const shadowGodsList = [
  'hades', 'loki', 'mara', 'nyx', 'rahu',
  'durga', 'kali', 'shiva', 'yama',
  'fenrir', 'hel', 'mahakala', 'morrigan', 'set', 'thanatos', 'ahriman'
];

export const getShadowGod = (name) => {
  for (const realm of Object.values(shadowRoots)) {
    if (realm[name]) {
      return realm[name];
    }
  }
  return null;
};

export const getAllShadowGods = () => {
  const gods = [];
  for (const realm of Object.values(shadowRoots)) {
    gods.push(...Object.values(realm));
  }
  return gods;
};