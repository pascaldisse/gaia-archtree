/**
 * ZodiacPolarity.js - Zodiac-based Polarity System
 * Controls light/shadow tree dominance based on zodiac cycles
 * Implements alternating polarity pattern with seasonal transitions
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';

export class ZodiacPolarity extends EventEmitter {
  constructor() {
    super();
    this.currentZodiac = null;
    this.currentPolarity = null;
    this.dominantTree = null;
    this.manualOverride = false;
    
    this.initializeZodiacSystem();
  }

  initializeZodiacSystem() {
    // Zodiac signs with alternating polarity pattern
    this.zodiacSigns = [
      {
        name: 'Aries',
        symbol: '♈',
        dates: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
        polarity: 'positive',
        element: 'fire',
        season: 'spring',
        treeControl: 'light',
        lightGods: ['Surya', 'Agni', 'Marut', 'Rudra'],
        shadowGods: [],
        description: 'The Ram - Initiator, pioneering energy, light dominance'
      },
      {
        name: 'Taurus',
        symbol: '♉',
        dates: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
        polarity: 'negative',
        element: 'earth',
        season: 'spring',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Durga', 'Bhairava', 'Yama', 'Mahakala'],
        description: 'The Bull - Stabilizer, grounding energy, shadow dominance'
      },
      {
        name: 'Gemini',
        symbol: '♊',
        dates: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
        polarity: 'positive',
        element: 'air',
        season: 'spring',
        treeControl: 'light',
        lightGods: ['Ashwin', 'Saraswati', 'Vayu', 'Marut'],
        shadowGods: [],
        description: 'The Twins - Communicator, intellectual energy, light dominance'
      },
      {
        name: 'Cancer',
        symbol: '♋',
        dates: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
        polarity: 'negative',
        element: 'water',
        season: 'summer',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Kali', 'Shiva', 'Rahu', 'Chandi'],
        description: 'The Crab - Protector, emotional depths, shadow dominance'
      },
      {
        name: 'Leo',
        symbol: '♌',
        dates: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
        polarity: 'positive',
        element: 'fire',
        season: 'summer',
        treeControl: 'light',
        lightGods: ['Surya', 'Agni', 'Vishnu', 'Brahma'],
        shadowGods: [],
        description: 'The Lion - Leader, creative fire, light dominance'
      },
      {
        name: 'Virgo',
        symbol: '♍',
        dates: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
        polarity: 'negative',
        element: 'earth',
        season: 'summer',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Durga', 'Alakshmi', 'Nirrti', 'Avidya'],
        description: 'The Maiden - Perfectionist, analytical depths, shadow dominance'
      },
      {
        name: 'Libra',
        symbol: '♎',
        dates: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
        polarity: 'positive',
        element: 'air',
        season: 'autumn',
        treeControl: 'light',
        lightGods: ['Varuna', 'Soma', 'Lakshmi', 'Ganga'],
        shadowGods: [],
        description: 'The Scales - Harmonizer, balance seeker, light dominance'
      },
      {
        name: 'Scorpio',
        symbol: '♏',
        dates: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
        polarity: 'negative',
        element: 'water',
        season: 'autumn',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Shiva', 'Kali', 'Mahakala', 'Mara'],
        description: 'The Scorpion - Transformer, deep mysteries, shadow dominance'
      },
      {
        name: 'Sagittarius',
        symbol: '♐',
        dates: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
        polarity: 'positive',
        element: 'fire',
        season: 'autumn',
        treeControl: 'light',
        lightGods: ['Rudra', 'Vishnu', 'Marut', 'Ashwin'],
        shadowGods: [],
        description: 'The Archer - Seeker, expansive fire, light dominance'
      },
      {
        name: 'Capricorn',
        symbol: '♑',
        dates: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
        polarity: 'negative',
        element: 'earth',
        season: 'winter',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Yama', 'Bhairava', 'Mahakala', 'Tamas'],
        description: 'The Goat - Builder, structural depths, shadow dominance'
      },
      {
        name: 'Aquarius',
        symbol: '♒',
        dates: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
        polarity: 'positive',
        element: 'air',
        season: 'winter',
        treeControl: 'light',
        lightGods: ['Vayu', 'Akasha', 'Saraswati', 'Vishnu'],
        shadowGods: [],
        description: 'The Water Bearer - Innovator, humanitarian light, light dominance'
      },
      {
        name: 'Pisces',
        symbol: '♓',
        dates: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
        polarity: 'negative',
        element: 'water',
        season: 'winter',
        treeControl: 'shadow',
        lightGods: [],
        shadowGods: ['Rahu', 'Ketu', 'Jyestha', 'Apasmara'],
        description: 'The Fish - Mystic, oceanic depths, shadow dominance'
      }
    ];

    // Seasonal transition points
    this.seasonalTransitions = {
      'spring_equinox': { month: 3, day: 21, zodiac: 'Aries' },
      'summer_solstice': { month: 6, day: 21, zodiac: 'Cancer' },
      'autumn_equinox': { month: 9, day: 23, zodiac: 'Libra' },
      'winter_solstice': { month: 12, day: 22, zodiac: 'Capricorn' }
    };

    this.updateCurrentZodiac();
    console.log(chalk.cyan('🌟 Zodiac Polarity System initialized'));
  }

  // Calculate current zodiac sign based on date
  calculateZodiacSign(date = new Date()) {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    for (const sign of this.zodiacSigns) {
      const { start, end } = sign.dates;
      
      // Handle year-crossing signs (like Capricorn)
      if (start.month > end.month) {
        if ((month === start.month && day >= start.day) || 
            (month === end.month && day <= end.day) ||
            (month > start.month || month < end.month)) {
          return sign;
        }
      } else {
        if ((month === start.month && day >= start.day) || 
            (month === end.month && day <= end.day) ||
            (month > start.month && month < end.month)) {
          return sign;
        }
      }
    }

    // Fallback to Aries if no match found
    return this.zodiacSigns[0];
  }

  // Update current zodiac and polarity
  updateCurrentZodiac(date = new Date()) {
    if (this.manualOverride) {
      return; // Don't update if manual override is active
    }

    const previousZodiac = this.currentZodiac;
    const zodiacSign = this.calculateZodiacSign(date);
    
    this.currentZodiac = zodiacSign;
    this.currentPolarity = zodiacSign.polarity;
    this.dominantTree = zodiacSign.treeControl;

    // Emit polarity change event if zodiac changed
    if (previousZodiac && previousZodiac.name !== zodiacSign.name) {
      this.emit('polarity:changed', {
        from: previousZodiac,
        to: zodiacSign,
        newPolarity: this.currentPolarity,
        newDominantTree: this.dominantTree
      });
    }

    this.emit('zodiac:updated', zodiacSign);
  }

  // Manually set zodiac for testing
  setZodiacManually(zodiacName) {
    const zodiacSign = this.zodiacSigns.find(sign => 
      sign.name.toLowerCase() === zodiacName.toLowerCase()
    );

    if (!zodiacSign) {
      throw new Error(`Zodiac sign ${zodiacName} not found`);
    }

    this.manualOverride = true;
    this.currentZodiac = zodiacSign;
    this.currentPolarity = zodiacSign.polarity;
    this.dominantTree = zodiacSign.treeControl;

    console.log(chalk.yellow(`🎯 Manual zodiac override: ${zodiacSign.name}`));
    
    this.emit('zodiac:override', zodiacSign);
    return zodiacSign;
  }

  // Clear manual override and return to automatic
  clearManualOverride() {
    this.manualOverride = false;
    this.updateCurrentZodiac();
    console.log(chalk.green('🔄 Returned to automatic zodiac tracking'));
  }

  // Get current zodiac status
  getCurrentStatus() {
    return {
      zodiac: this.currentZodiac,
      polarity: this.currentPolarity,
      dominantTree: this.dominantTree,
      manualOverride: this.manualOverride,
      timestamp: new Date()
    };
  }

  // Get preferred gods based on current zodiac
  getPreferredGods() {
    if (!this.currentZodiac) return { light: [], shadow: [] };

    return {
      light: this.currentZodiac.lightGods,
      shadow: this.currentZodiac.shadowGods,
      dominant: this.dominantTree === 'light' ? 
        this.currentZodiac.lightGods : 
        this.currentZodiac.shadowGods
    };
  }

  // Check if we're in a seasonal transition period
  isSeasonalTransition(date = new Date()) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const [transitionName, transition] of Object.entries(this.seasonalTransitions)) {
      if (month === transition.month && Math.abs(day - transition.day) <= 1) {
        return {
          isTransition: true,
          transitionName,
          zodiacSign: transition.zodiac
        };
      }
    }

    return { isTransition: false };
  }

  // Get seasonal information
  getSeasonalInfo() {
    const transition = this.isSeasonalTransition();
    return {
      currentSeason: this.currentZodiac?.season,
      zodiacSign: this.currentZodiac?.name,
      polarity: this.currentPolarity,
      treeControl: this.dominantTree,
      transition,
      nextTransition: this.getNextSeasonalTransition()
    };
  }

  // Calculate next seasonal transition
  getNextSeasonalTransition() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const transitions = Object.entries(this.seasonalTransitions);

    for (const [name, transition] of transitions) {
      const transitionDate = new Date(currentYear, transition.month - 1, transition.day);
      if (transitionDate > now) {
        return {
          name,
          date: transitionDate,
          zodiac: transition.zodiac,
          daysUntil: Math.ceil((transitionDate - now) / (1000 * 60 * 60 * 24))
        };
      }
    }

    // Next transition is in next year
    const firstTransition = transitions[0];
    const nextYearDate = new Date(currentYear + 1, firstTransition[1].month - 1, firstTransition[1].day);
    
    return {
      name: firstTransition[0],
      date: nextYearDate,
      zodiac: firstTransition[1].zodiac,
      daysUntil: Math.ceil((nextYearDate - now) / (1000 * 60 * 60 * 24))
    };
  }

  // Display zodiac information
  displayZodiacInfo() {
    const status = this.getCurrentStatus();
    const seasonal = this.getSeasonalInfo();
    const gods = this.getPreferredGods();

    console.log(chalk.cyan('\n🌟 ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'));
    console.log(chalk.cyan('🌟                                                ZODIAC POLARITY SYSTEM STATUS                                                 🌟'));
    console.log(chalk.cyan('🌟 ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'));

    // Current zodiac info
    console.log(chalk.yellow(`\n🔮 Current Zodiac: ${status.zodiac.symbol} ${status.zodiac.name}`));
    console.log(chalk.gray(`   ${status.zodiac.description}`));
    console.log(chalk.gray(`   Element: ${status.zodiac.element} | Season: ${status.zodiac.season}`));
    
    // Polarity info
    const polarityColor = status.polarity === 'positive' ? chalk.yellow : chalk.magenta;
    const treeColor = status.dominantTree === 'light' ? chalk.yellow : chalk.magenta;
    
    console.log(polarityColor(`\n⚡ Polarity: ${status.polarity.toUpperCase()}`));
    console.log(treeColor(`🌳 Tree Control: ${status.dominantTree.toUpperCase()} REALM`));

    // Preferred gods
    console.log(chalk.cyan('\n👑 Preferred Gods:'));
    if (gods.dominant.length > 0) {
      console.log(treeColor(`   ${status.dominantTree === 'light' ? '☀️' : '🌙'} Dominant: ${gods.dominant.join(', ')}`));
    }
    if (gods.light.length > 0) {
      console.log(chalk.yellow(`   ☀️  Light: ${gods.light.join(', ')}`));
    }
    if (gods.shadow.length > 0) {
      console.log(chalk.magenta(`   🌙 Shadow: ${gods.shadow.join(', ')}`));
    }

    // Seasonal info
    console.log(chalk.cyan('\n🌍 Seasonal Information:'));
    console.log(`   Current Season: ${seasonal.currentSeason}`);
    if (seasonal.transition.isTransition) {
      console.log(chalk.red(`   🔄 SEASONAL TRANSITION: ${seasonal.transition.transitionName}`));
    }
    console.log(`   Next Transition: ${seasonal.nextTransition.name} in ${seasonal.nextTransition.daysUntil} days`);

    // Manual override status
    if (status.manualOverride) {
      console.log(chalk.red('\n🎯 MANUAL OVERRIDE ACTIVE'));
    }

    console.log(chalk.cyan('\n🌟 ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'));
  }
}

// Singleton instance
export const zodiacPolarity = new ZodiacPolarity();
export default zodiacPolarity;