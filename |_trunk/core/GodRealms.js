/**
 * GodRealms.js - Divine Ashvattha Tree Architecture
 * 32-god pantheon with dual-tree structure (16 light + 16 shadow)
 * Inverted tree: roots in heaven, branches on earth
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import { treeCoordinator } from './TreeCoordinator.js';

export class AshvatthaTree extends EventEmitter {
  constructor() {
    super();
    this.lightGods = new Map(); // 16 light gods (branches below)
    this.shadowGods = new Map(); // 16 shadow gods (roots above)
    this.leafs = new Map(); // Individual computation points
    this.branches = new Map(); // Upward connections (light realm)
    this.roots = new Map(); // Downward connections (shadow realm)
    this.trunk = null; // Central divine axis
    
    this.initializePantheon();
  }

  initializePantheon() {
    // 16 Light Gods (Branches - Earth Realm)
    const lightGods = [
      'Surya', 'Agni', 'Vayu', 'Varuna',
      'Prithvi', 'Akasha', 'Soma', 'Marut',
      'Ashwin', 'Rudra', 'Vishnu', 'Brahma',
      'Saraswati', 'Lakshmi', 'Ganga', 'Tulasi'
    ];

    // 16 Shadow Gods (Roots - Cosmic Realm)
    const shadowGods = [
      'Kali', 'Shiva', 'Durga', 'Bhairava',
      'Rahu', 'Ketu', 'Yama', 'Nirrti',
      'Alakshmi', 'Jyestha', 'Mara', 'Apasmara',
      'Mahakala', 'Chandi', 'Tamas', 'Avidya'
    ];

    // Initialize Light Gods (Branches)
    lightGods.forEach((name, index) => {
      this.lightGods.set(name, {
        id: `light_${index}`,
        name,
        realm: 'light',
        type: 'branch',
        position: index,
        leafs: new Set(),
        connections: new Set(),
        active: false,
        energy: 100
      });
    });

    // Initialize Shadow Gods (Roots)
    shadowGods.forEach((name, index) => {
      this.shadowGods.set(name, {
        id: `shadow_${index}`,
        name,
        realm: 'shadow',
        type: 'root',
        position: index,
        leafs: new Set(),
        connections: new Set(),
        active: false,
        energy: 100
      });
    });

    console.log(chalk.cyan('🌳 Ashvattha Tree initialized with 32-god pantheon'));
    console.log(chalk.yellow(`   ☀️  16 Light Gods (Branches): ${lightGods.join(', ')}`));
    console.log(chalk.magenta(`   🌙 16 Shadow Gods (Roots): ${shadowGods.join(', ')}`));
  }

  // Create leaf (computation point)
  createLeaf(id, data = {}) {
    const leaf = {
      id,
      data,
      branches: new Set(), // Connected to light realm
      roots: new Set(), // Connected to shadow realm
      created: new Date(),
      active: true
    };

    this.leafs.set(id, leaf);
    this.emit('leaf:created', leaf);
    return leaf;
  }

  // Create branch connection (light realm)
  createBranch(fromLeaf, toLeaf, godName = null) {
    const branchId = `branch_${fromLeaf}_${toLeaf}`;
    const branch = {
      id: branchId,
      from: fromLeaf,
      to: toLeaf,
      god: godName,
      realm: 'light',
      strength: 1.0,
      created: new Date()
    };

    this.branches.set(branchId, branch);
    
    // Update leaf connections
    const fromLeafObj = this.leafs.get(fromLeaf);
    const toLeafObj = this.leafs.get(toLeaf);
    
    if (fromLeafObj) fromLeafObj.branches.add(branchId);
    if (toLeafObj) toLeafObj.branches.add(branchId);

    this.emit('branch:created', branch);
    return branch;
  }

  // Create root connection (shadow realm)
  createRoot(fromLeaf, toLeaf, godName = null) {
    const rootId = `root_${fromLeaf}_${toLeaf}`;
    const root = {
      id: rootId,
      from: fromLeaf,
      to: toLeaf,
      god: godName,
      realm: 'shadow',
      strength: 1.0,
      created: new Date()
    };

    this.roots.set(rootId, root);
    
    // Update leaf connections
    const fromLeafObj = this.leafs.get(fromLeaf);
    const toLeafObj = this.leafs.get(toLeaf);
    
    if (fromLeafObj) fromLeafObj.roots.add(rootId);
    if (toLeafObj) toLeafObj.roots.add(rootId);

    this.emit('root:created', root);
    return root;
  }

  // Activate god for divine intervention
  activateGod(godName, realm = 'auto') {
    let god = null;
    
    if (realm === 'auto') {
      god = this.lightGods.get(godName) || this.shadowGods.get(godName);
    } else if (realm === 'light') {
      god = this.lightGods.get(godName);
    } else if (realm === 'shadow') {
      god = this.shadowGods.get(godName);
    }

    if (!god) {
      throw new Error(`God ${godName} not found in ${realm} realm`);
    }

    god.active = true;
    console.log(chalk.green(`✨ ${god.realm === 'light' ? '☀️' : '🌙'} ${godName} activated in ${god.realm} realm`));
    
    this.emit('god:activated', god);
    return god;
  }

  // Get tree status
  getTreeStatus() {
    const activeLight = Array.from(this.lightGods.values()).filter(g => g.active);
    const activeShadow = Array.from(this.shadowGods.values()).filter(g => g.active);
    
    return {
      leafs: this.leafs.size,
      branches: this.branches.size,
      roots: this.roots.size,
      lightGods: {
        total: this.lightGods.size,
        active: activeLight.length,
        names: activeLight.map(g => g.name)
      },
      shadowGods: {
        total: this.shadowGods.size,
        active: activeShadow.length,
        names: activeShadow.map(g => g.name)
      }
    };
  }

  // Divine intervention - invoke specific god for task
  async invokeGod(godName, task, context = {}) {
    const god = this.activateGod(godName);
    
    console.log(chalk.cyan(`🔮 Divine intervention: ${godName} processing task`));
    console.log(chalk.gray(`   Task: ${task}`));
    
    // Simulate divine processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = {
      god: godName,
      realm: god.realm,
      task,
      context,
      timestamp: new Date(),
      success: true,
      intervention: `${godName} has ${god.realm === 'light' ? 'illuminated' : 'transformed'} the task`
    };

    this.emit('divine:intervention', result);
    return result;
  }

  // Mirror tree operation (light ↔ shadow)
  mirrorToRealm(sourceRealm, targetRealm) {
    console.log(chalk.magenta(`🪞 Mirroring ${sourceRealm} realm to ${targetRealm} realm`));
    // Implementation for dual-tree synchronization
    this.emit('tree:mirrored', { sourceRealm, targetRealm });
  }
}

// Singleton instance
export const ashvatthaTree = new AshvatthaTree();
export default ashvatthaTree;