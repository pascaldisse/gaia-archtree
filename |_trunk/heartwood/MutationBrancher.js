/**
 * MutationBrancher.js - Automated Git Branch Per Mutation
 * Creates and manages individual git branches for each evolutionary mutation
 */

import simpleGit from 'simple-git';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import crypto from 'crypto';
import { logger } from '../core/Logger.js';
import { ashvatthaTree } from '../core/GodRealms.js';
import { treeCoordinator } from '../core/TreeCoordinator.js';

export class MutationBrancher extends EventEmitter {
  constructor(repoPath = '.') {
    super();
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.mutationBranches = new Map(); // mutationId -> branch info
    this.branchHistory = [];
    this.activeMutations = new Set();
    this.maxConcurrentMutations = 8; // M1 optimization
    
    logger.info('MutationBrancher initialized for automated branching');
  }

  // Generate unique mutation ID
  generateMutationId(type = 'evolution') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${type}_${timestamp}_${random}`;
  }

  // Create mutation branch with divine guidance
  async createMutationBranch(mutationType, baseBranch = 'main', godName = null) {
    if (this.activeMutations.size >= this.maxConcurrentMutations) {
      throw new Error(`Maximum concurrent mutations (${this.maxConcurrentMutations}) reached`);
    }

    const mutationId = this.generateMutationId(mutationType);
    const branchName = `mutation/${mutationType}/${mutationId}`;
    
    // Auto-select god based on mutation type
    if (!godName) {
      godName = this.selectGodForMutation(mutationType);
    }

    try {
      // Invoke god for mutation guidance
      const divineGuidance = await ashvatthaTree.invokeGod(godName, 
        `Creating mutation branch for ${mutationType}: ${mutationId}`);

      // Ensure we're on the base branch
      await this.git.checkout(baseBranch);
      
      // Create new branch from base
      await this.git.checkoutLocalBranch(branchName);
      
      const mutation = {
        id: mutationId,
        type: mutationType,
        branchName,
        baseBranch,
        god: godName,
        created: new Date(),
        status: 'active',
        commits: [],
        changes: [],
        fitness: 0,
        divineGuidance,
        metadata: {
          realmBalance: treeCoordinator.getTreeHealth().trunk.balance,
          godEnergy: divineGuidance?.god?.energy || 100
        }
      };

      this.mutationBranches.set(mutationId, mutation);
      this.activeMutations.add(mutationId);
      
      console.log(chalk.green(`🧬 Mutation branch created: ${branchName}`));
      console.log(chalk.yellow(`   Type: ${mutationType}`));
      console.log(chalk.yellow(`   God: ${godName}`));
      console.log(chalk.yellow(`   Base: ${baseBranch}`));
      
      this.emit('mutation:created', mutation);
      logger.info('Mutation branch created', { 
        mutationId, 
        type: mutationType, 
        god: godName,
        branchName 
      });
      
      return mutation;
      
    } catch (error) {
      logger.error('Failed to create mutation branch', { 
        mutationId, 
        error: error.message 
      });
      throw error;
    }
  }

  // Select appropriate god for mutation type
  selectGodForMutation(mutationType) {
    const mutationGodMappings = {
      // Code mutations
      'refactor': 'modi',        // Courage for bold changes
      'optimize': 'freyr',       // Growth and optimization
      'debug': 'thor',           // Testing and debugging
      'security': 'heimdall',    // Security and monitoring
      'cleanup': 'vidar',        // Clean code and silence
      'ui': 'baldr',             // Beauty and harmony
      'docs': 'bragi',           // Documentation
      
      // Destructive mutations (shadow realm)
      'breaking': 'shiva',       // Transformation
      'removal': 'kali',         // Destruction and cleanup
      'deprecate': 'yama',       // Death and termination
      'legacy': 'jyestha',       // Ancient problems
      
      // System mutations
      'architecture': 'odin',    // Wisdom and design
      'performance': 'thor',     // Strength and performance
      'testing': 'thor',         // Testing and validation
      'api': 'hermes',           // Communication
      
      // Default evolution
      'evolution': 'brahma'      // Creator god for general evolution
    };

    return mutationGodMappings[mutationType] || 'odin'; // Default to wisdom
  }

  // Apply code changes to mutation branch
  async applyMutationChanges(mutationId, changes, commitMessage) {
    const mutation = this.mutationBranches.get(mutationId);
    if (!mutation) {
      throw new Error(`Mutation ${mutationId} not found`);
    }

    if (mutation.status !== 'active') {
      throw new Error(`Mutation ${mutationId} is not active (status: ${mutation.status})`);
    }

    try {
      // Switch to mutation branch
      await this.git.checkout(mutation.branchName);
      
      console.log(chalk.cyan(`🔄 Applying changes to mutation ${mutationId}`));
      
      // Apply the changes (this would involve actual file modifications)
      await this.applyCodeChanges(mutation, changes);
      
      // Stage all changes
      await this.git.add('.');
      
      // Create commit with divine signature
      const divineCommitMessage = `${commitMessage}

🧬 Mutation: ${mutationId}
🔮 Divine Guidance: ${mutation.god}
⚖️  Tree Balance: ${treeCoordinator.getTreeHealth().trunk.balance}
🌟 Mutation Type: ${mutation.type}

Blessed by ${mutation.god} in the ${mutation.divineGuidance?.realm || 'unknown'} realm`;

      const commit = await this.git.commit(divineCommitMessage);
      
      mutation.commits.push({
        hash: commit.commit,
        message: commitMessage,
        timestamp: new Date(),
        changes: changes.length || 0
      });
      
      mutation.changes.push(...changes);
      mutation.lastModified = new Date();
      
      // Calculate fitness after changes
      mutation.fitness = await this.calculateMutationFitness(mutation);
      
      console.log(chalk.green(`✨ Changes applied | Fitness: ${mutation.fitness.toFixed(2)}`));
      
      this.emit('mutation:changed', mutation);
      logger.info('Mutation changes applied', { 
        mutationId, 
        commits: mutation.commits.length,
        fitness: mutation.fitness 
      });
      
      return mutation;
      
    } catch (error) {
      mutation.status = 'error';
      mutation.error = error.message;
      logger.error('Failed to apply mutation changes', { mutationId, error: error.message });
      throw error;
    }
  }

  // Apply actual code changes (placeholder for real implementation)
  async applyCodeChanges(mutation, changes) {
    // This is where you would apply actual code mutations
    // For now, we'll simulate by creating mutation metadata
    const mutationLog = {
      mutationId: mutation.id,
      type: mutation.type,
      god: mutation.god,
      changes: changes,
      applied: new Date(),
      guidance: mutation.divineGuidance?.intervention || 'Divine transformation applied'
    };
    
    // In a real implementation, this would modify actual source files
    // based on the changes parameter
    logger.debug('Code changes applied', mutationLog);
  }

  // Calculate mutation fitness
  async calculateMutationFitness(mutation) {
    let fitness = 0;
    
    try {
      // Base fitness from commit activity
      fitness += mutation.commits.length * 15;
      
      // Changes count
      fitness += mutation.changes.length * 5;
      
      // God-specific bonuses
      const godFitnessMap = {
        // Light gods
        'odin': 25,      // Wisdom bonus
        'thor': 20,      // Strength bonus  
        'freyr': 18,     // Growth bonus
        'baldr': 15,     // Beauty bonus
        'heimdall': 22,  // Security bonus
        'bragi': 12,     // Documentation bonus
        'modi': 20,      // Courage bonus
        'vidar': 16,     // Purity bonus
        
        // Shadow gods
        'shiva': 30,     // Transformation (highest)
        'kali': 25,      // Destruction bonus
        'durga': 20,     // Protection bonus
        'yama': 18,      // Termination bonus
        'mahakala': 22,  // Time bonus
        'bhairava': 24,  // Terror bonus
        'jyestha': 16,   // Ancient wisdom bonus
        'mara': 14       // Anti-pattern detection
      };
      
      fitness += godFitnessMap[mutation.god] || 10;
      
      // Mutation type multipliers
      const typeBonuses = {
        'breaking': 1.5,     // Breaking changes are high value
        'security': 1.4,     // Security improvements
        'performance': 1.3,  // Performance optimizations
        'refactor': 1.2,     // Refactoring improvements
        'cleanup': 1.1,      // Code cleanup
        'docs': 1.0,         // Documentation
        'ui': 1.1           // UI improvements
      };
      
      fitness *= (typeBonuses[mutation.type] || 1.0);
      
      // Tree balance factor
      const balance = mutation.metadata.realmBalance;
      const balanceFactor = 1 + (Math.abs(balance) / 200); // 0.5 to 1.5 multiplier
      fitness *= balanceFactor;
      
      // Time decay (newer mutations get slight bonus)
      const ageInHours = (Date.now() - mutation.created.getTime()) / (1000 * 60 * 60);
      const timeFactor = Math.max(0.7, 1 - (ageInHours / 48)); // Decay over 48 hours
      fitness *= timeFactor;
      
      return Math.max(0, Math.min(100, fitness)); // Normalize to 0-100
      
    } catch (error) {
      logger.warn('Mutation fitness calculation failed', { 
        mutationId: mutation.id, 
        error: error.message 
      });
      return 40; // Default fitness
    }
  }

  // Merge successful mutation
  async mergeMutation(mutationId, targetBranch = 'main', fitnessThreshold = 60) {
    const mutation = this.mutationBranches.get(mutationId);
    if (!mutation) {
      throw new Error(`Mutation ${mutationId} not found`);
    }

    if (mutation.fitness < fitnessThreshold) {
      console.log(chalk.yellow(`⚠️  Mutation fitness too low (${mutation.fitness.toFixed(2)} < ${fitnessThreshold})`));
      return false;
    }

    try {
      console.log(chalk.green(`🔄 Merging mutation ${mutationId} to ${targetBranch}`));
      
      // Switch to target branch
      await this.git.checkout(targetBranch);
      
      // Merge mutation branch
      await this.git.mergeFromTo(mutation.branchName, targetBranch);
      
      mutation.status = 'merged';
      mutation.mergedAt = new Date();
      mutation.mergedTo = targetBranch;
      
      this.activeMutations.delete(mutationId);
      this.branchHistory.push(mutation);
      
      // Update tree balance after successful merge
      treeCoordinator.balanceForces(
        mutation.divineGuidance?.realm === 'light' ? 10 : 0,
        mutation.divineGuidance?.realm === 'shadow' ? 10 : 0
      );
      
      console.log(chalk.green(`✅ Mutation merged successfully`));
      console.log(chalk.cyan(`   Fitness: ${mutation.fitness.toFixed(2)}`));
      console.log(chalk.cyan(`   Commits: ${mutation.commits.length}`));
      console.log(chalk.cyan(`   God: ${mutation.god}`));
      
      this.emit('mutation:merged', mutation);
      logger.info('Mutation merged', { 
        mutationId, 
        targetBranch, 
        fitness: mutation.fitness 
      });
      
      return true;
      
    } catch (error) {
      mutation.status = 'merge_failed';
      mutation.error = error.message;
      logger.error('Mutation merge failed', { mutationId, error: error.message });
      throw error;
    }
  }

  // Abandon mutation (delete branch)
  async abandonMutation(mutationId, reason = 'Low fitness') {
    const mutation = this.mutationBranches.get(mutationId);
    if (!mutation) {
      throw new Error(`Mutation ${mutationId} not found`);
    }

    try {
      // Switch away from mutation branch
      await this.git.checkout(mutation.baseBranch);
      
      // Delete mutation branch
      await this.git.deleteLocalBranch(mutation.branchName, true);
      
      mutation.status = 'abandoned';
      mutation.abandonedAt = new Date();
      mutation.abandonReason = reason;
      
      this.activeMutations.delete(mutationId);
      this.branchHistory.push(mutation);
      
      console.log(chalk.red(`🗑️  Mutation abandoned: ${mutationId}`));
      console.log(chalk.gray(`   Reason: ${reason}`));
      
      this.emit('mutation:abandoned', mutation);
      logger.info('Mutation abandoned', { mutationId, reason });
      
    } catch (error) {
      logger.error('Failed to abandon mutation', { mutationId, error: error.message });
      throw error;
    }
  }

  // Prune low-fitness mutations
  async pruneLowFitnessMutations(fitnessThreshold = 30) {
    const lowFitnessMutations = Array.from(this.mutationBranches.values())
      .filter(m => m.status === 'active' && m.fitness < fitnessThreshold);

    console.log(chalk.yellow(`🧬 Pruning ${lowFitnessMutations.length} low-fitness mutations`));

    let prunedCount = 0;
    for (const mutation of lowFitnessMutations) {
      try {
        await this.abandonMutation(mutation.id, `Low fitness: ${mutation.fitness.toFixed(2)}`);
        prunedCount++;
      } catch (error) {
        logger.warn('Failed to prune mutation', { 
          mutationId: mutation.id, 
          error: error.message 
        });
      }
    }

    return prunedCount;
  }

  // Get mutation statistics
  getMutationStats() {
    const activeMutations = Array.from(this.mutationBranches.values());
    const mergedMutations = this.branchHistory.filter(m => m.status === 'merged');
    const abandonedMutations = this.branchHistory.filter(m => m.status === 'abandoned');
    
    return {
      active: activeMutations.length,
      merged: mergedMutations.length,
      abandoned: abandonedMutations.length,
      total: activeMutations.length + this.branchHistory.length,
      averageFitness: activeMutations.length > 0 
        ? activeMutations.reduce((sum, m) => sum + m.fitness, 0) / activeMutations.length 
        : 0,
      maxConcurrent: this.maxConcurrentMutations,
      totalCommits: activeMutations.reduce((sum, m) => sum + m.commits.length, 0),
      godDistribution: this.getGodDistribution(activeMutations)
    };
  }

  // Get god distribution for active mutations
  getGodDistribution(mutations) {
    const distribution = {};
    mutations.forEach(m => {
      distribution[m.god] = (distribution[m.god] || 0) + 1;
    });
    return distribution;
  }

  // List active mutations
  listActiveMutations() {
    return Array.from(this.mutationBranches.values())
      .filter(m => m.status === 'active')
      .map(m => ({
        id: m.id,
        type: m.type,
        god: m.god,
        branchName: m.branchName,
        fitness: m.fitness,
        commits: m.commits.length,
        created: m.created
      }));
  }

  // Get specific mutation info
  getMutation(mutationId) {
    return this.mutationBranches.get(mutationId);
  }
}

export default MutationBrancher;