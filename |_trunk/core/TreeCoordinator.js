/**
 * TreeCoordinator.js - Gaia Trunk Core Coordination
 * Central coordination between Yggdrasil (crown) and Ashvattha (roots)
 */

import { lightBranches } from '../../^_crown/branches/lightGods.js';
import { shadowRoots } from '../../√_roots/roots/shadowGods.js';
import { EventEmitter } from 'events';
import chalk from 'chalk';

export class TreeCoordinator extends EventEmitter {
  constructor() {
    super();
    this.yggdrasil = lightBranches; // Norse light branches (up)
    this.ashvattha = shadowRoots;   // Indian shadow roots (down)
    this.trunk = {
      energy: 100,
      balance: 0, // -100 (shadow) to +100 (light)
      active: true
    };
    
    console.log(chalk.green('🌳 Gaia Trunk initialized - coordinating dual trees'));
    console.log(chalk.cyan(`   🌿 Yggdrasil: ${Object.keys(this.yggdrasil).length} light branches`));
    console.log(chalk.magenta(`   🕳️  Ashvattha: ${Object.keys(this.ashvattha).length} shadow roots`));
  }

  // Balance between light and shadow forces
  balanceForces(lightIntensity = 0, shadowIntensity = 0) {
    const netForce = lightIntensity - shadowIntensity;
    this.trunk.balance = Math.max(-100, Math.min(100, this.trunk.balance + netForce));
    
    const balanceColor = this.trunk.balance > 0 ? chalk.yellow : chalk.magenta;
    console.log(balanceColor(`⚖️  Tree balance: ${this.trunk.balance}`));
    
    this.emit('balance:changed', {
      balance: this.trunk.balance,
      light: lightIntensity,
      shadow: shadowIntensity
    });
    
    return this.trunk.balance;
  }

  // Invoke dual gods (light + shadow) for complex tasks
  async invokeDualGods(lightGod, shadowGod, task) {
    const light = this.yggdrasil[lightGod];
    const shadow = this.ashvattha[shadowGod];
    
    if (!light || !shadow) {
      throw new Error(`Gods not found: ${lightGod} (light), ${shadowGod} (shadow)`);
    }

    console.log(chalk.cyan(`🔮 Dual invocation: ${light.name} ☀️  + ${shadow.name} 🌙`));
    console.log(chalk.gray(`   Task: ${task}`));
    
    // Simulate dual processing
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = {
      light: { god: light.name, domain: light.domain, energy: light.energy },
      shadow: { god: shadow.name, domain: shadow.domain, energy: shadow.energy },
      task,
      balance: this.balanceForces(25, 25), // Equal dual force
      timestamp: new Date(),
      synthesis: `${light.name}'s ${light.energy} harmonized with ${shadow.name}'s ${shadow.energy}`
    };

    this.emit('dual:invocation', result);
    return result;
  }

  // Get all available leafs from branches
  getAllLeafs() {
    const lightLeafs = Object.values(this.yggdrasil)
      .flatMap(god => god.leafs.map(leaf => ({ leaf, god: god.name, realm: 'light' })));
    
    const shadowLeafs = Object.values(this.ashvattha)
      .flatMap(god => god.roots.map(root => ({ leaf: root, god: god.name, realm: 'shadow' })));
    
    return { lightLeafs, shadowLeafs };
  }

  // Find god by leaf/capability
  findGodByLeaf(leafName) {
    // Search light branches
    for (const [godKey, god] of Object.entries(this.yggdrasil)) {
      if (god.leafs.includes(leafName)) {
        return { god: god.name, realm: 'light', domain: god.domain };
      }
    }
    
    // Search shadow roots
    for (const [godKey, god] of Object.entries(this.ashvattha)) {
      if (god.roots.includes(leafName)) {
        return { god: god.name, realm: 'shadow', domain: god.domain };
      }
    }
    
    return null;
  }

  // Get optimal god pairing for task
  getOptimalPairing(taskType) {
    const pairings = {
      'debugging': { light: 'thor', shadow: 'bhairava' },
      'refactoring': { light: 'modi', shadow: 'shiva' },
      'security': { light: 'heimdall', shadow: 'durga' },
      'cleanup': { light: 'vidar', shadow: 'kali' },
      'optimization': { light: 'freyr', shadow: 'mahakala' },
      'documentation': { light: 'bragi', shadow: 'yama' },
      'testing': { light: 'thor', shadow: 'mara' },
      'architecture': { light: 'odin', shadow: 'avidya' }
    };
    
    return pairings[taskType] || { light: 'odin', shadow: 'shiva' };
  }

  // Tree health status
  getTreeHealth() {
    const lightCount = Object.keys(this.yggdrasil).length;
    const shadowCount = Object.keys(this.ashvattha).length;
    const isBalanced = Math.abs(this.trunk.balance) < 50;
    
    return {
      yggdrasil: {
        branches: lightCount,
        health: lightCount === 16 ? 'perfect' : 'incomplete'
      },
      ashvattha: {
        roots: shadowCount,
        health: shadowCount === 16 ? 'perfect' : 'incomplete'
      },
      trunk: {
        balance: this.trunk.balance,
        energy: this.trunk.energy,
        balanced: isBalanced
      },
      overall: (lightCount === 16 && shadowCount === 16 && isBalanced) ? 'divine' : 'growing'
    };
  }
}

// Singleton instance
export const treeCoordinator = new TreeCoordinator();
export default treeCoordinator;