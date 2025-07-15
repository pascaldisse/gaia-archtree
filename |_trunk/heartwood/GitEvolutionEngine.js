/**
 * GitEvolutionEngine.js - M1-Optimized Evolutionary Algorithms
 * Automated git branch evolution with Ashvattha tree integration
 */

import simpleGit from 'simple-git';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import { ashvatthaTree } from '../core/GodRealms.js';
import { treeCoordinator } from '../core/TreeCoordinator.js';

export class GitEvolutionEngine extends EventEmitter {
  constructor(repoPath = '.') {
    super();
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.mutationBranches = new Map(); // Track mutation branches
    this.evolutionHistory = [];
    this.isM1Optimized = process.arch === 'arm64'; // Apple Silicon detection
    
    console.log(chalk.cyan(`🧬 Git Evolution Engine initialized ${this.isM1Optimized ? '(M1 Optimized)' : ''}`));
  }

  // Create mutation branch with divine intervention
  async createMutationBranch(mutationId, godName = 'Brahma') {
    try {
      const baseBranch = await this.getCurrentBranch();
      const branchName = `mutation/${mutationId}_${Date.now()}`;
      
      // Invoke god for divine guidance
      await ashvatthaTree.invokeGod(godName, `Creating mutation branch: ${branchName}`);
      
      // Create and checkout new branch
      await this.git.checkoutLocalBranch(branchName);
      
      const mutation = {
        id: mutationId,
        branchName,
        baseBranch,
        god: godName,
        created: new Date(),
        status: 'active',
        fitness: 0,
        commits: []
      };

      this.mutationBranches.set(mutationId, mutation);
      
      // Create leaf in Ashvattha tree
      ashvatthaTree.createLeaf(mutationId, {
        type: 'mutation',
        branchName,
        god: godName
      });

      console.log(chalk.green(`🌿 Mutation branch created: ${branchName}`));
      console.log(chalk.yellow(`   Base: ${baseBranch} | God: ${godName}`));
      
      this.emit('mutation:created', mutation);
      return mutation;
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create mutation branch: ${error.message}`));
      throw error;
    }
  }

  // Evolve code through automated commits
  async evolveMutation(mutationId, changes, commitMessage) {
    const mutation = this.mutationBranches.get(mutationId);
    if (!mutation) {
      throw new Error(`Mutation ${mutationId} not found`);
    }

    try {
      // Switch to mutation branch
      await this.git.checkout(mutation.branchName);
      
      // Apply changes (this would be implemented based on specific change types)
      console.log(chalk.cyan(`🔄 Evolving mutation ${mutationId}`));
      
      // Stage and commit changes
      await this.git.add('.');
      const commit = await this.git.commit(`${commitMessage}\n\n🧬 Mutation: ${mutationId}\n🔮 God: ${mutation.god}`);
      
      mutation.commits.push({
        hash: commit.commit,
        message: commitMessage,
        timestamp: new Date()
      });

      // Calculate fitness based on M1 optimization
      const fitness = await this.calculateFitness(mutation);
      mutation.fitness = fitness;

      console.log(chalk.green(`✨ Mutation evolved | Fitness: ${fitness.toFixed(2)}`));
      
      this.emit('mutation:evolved', mutation);
      return mutation;
      
    } catch (error) {
      console.error(chalk.red(`❌ Evolution failed: ${error.message}`));
      throw error;
    }
  }

  // Calculate fitness with M1 optimization considerations
  async calculateFitness(mutation) {
    let fitness = 0;
    
    try {
      // Base fitness from commit count and recency
      fitness += mutation.commits.length * 10;
      
      // M1 optimization bonus
      if (this.isM1Optimized) {
        fitness *= 1.2; // 20% bonus for M1 systems
      }
      
      // Divine intervention bonus based on god type
      const god = ashvatthaTree.lightGods.get(mutation.god) || 
                  ashvatthaTree.shadowGods.get(mutation.god);
      
      if (god) {
        fitness += god.realm === 'light' ? 15 : 25; // Shadow gods give higher fitness
      }
      
      // Code complexity and quality factors (simplified)
      fitness += Math.random() * 50; // Placeholder for actual code analysis
      
      return Math.max(0, Math.min(100, fitness)); // Normalize to 0-100
      
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Fitness calculation failed: ${error.message}`));
      return 50; // Default fitness
    }
  }

  // Merge successful mutations back to main
  async mergeMutation(mutationId, targetBranch = 'main') {
    const mutation = this.mutationBranches.get(mutationId);
    if (!mutation) {
      throw new Error(`Mutation ${mutationId} not found`);
    }

    try {
      // Check fitness threshold
      if (mutation.fitness < 60) {
        console.log(chalk.yellow(`⚠️  Mutation fitness too low (${mutation.fitness.toFixed(2)}), skipping merge`));
        return false;
      }

      // Invoke shadow god for merge decision
      const mergeDecision = await ashvatthaTree.invokeGod('Shiva', 
        `Evaluating merge for mutation ${mutationId} (fitness: ${mutation.fitness.toFixed(2)})`);

      // Switch to target branch
      await this.git.checkout(targetBranch);
      
      // Merge mutation branch
      await this.git.mergeFromTo(mutation.branchName, targetBranch);
      
      mutation.status = 'merged';
      mutation.mergedAt = new Date();

      // Create branch connection in Ashvattha tree
      const mainLeafId = `main_${Date.now()}`;
      ashvatthaTree.createLeaf(mainLeafId, { type: 'main', branch: targetBranch });
      ashvatthaTree.createBranch(mutationId, mainLeafId, mutation.god);

      console.log(chalk.green(`🔄 Mutation ${mutationId} merged to ${targetBranch}`));
      console.log(chalk.cyan(`   Fitness: ${mutation.fitness.toFixed(2)} | God: ${mutation.god}`));
      
      this.evolutionHistory.push({
        ...mutation,
        mergedTo: targetBranch,
        mergedAt: new Date()
      });

      this.emit('mutation:merged', mutation);
      return true;
      
    } catch (error) {
      console.error(chalk.red(`❌ Merge failed: ${error.message}`));
      mutation.status = 'failed';
      throw error;
    }
  }

  // Prune failed mutations
  async pruneFailedMutations(fitnessThreshold = 30) {
    const failedMutations = Array.from(this.mutationBranches.values())
      .filter(m => m.status === 'active' && m.fitness < fitnessThreshold);

    for (const mutation of failedMutations) {
      try {
        // Invoke Kali for destruction of failed branches
        await ashvatthaTree.invokeGod('Kali', `Pruning failed mutation ${mutation.id}`);
        
        // Delete branch
        await this.git.deleteLocalBranch(mutation.branchName, true);
        
        mutation.status = 'pruned';
        mutation.prunedAt = new Date();
        
        console.log(chalk.red(`🗑️  Pruned failed mutation: ${mutation.branchName}`));
        
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Failed to prune ${mutation.branchName}: ${error.message}`));
      }
    }

    this.emit('mutations:pruned', failedMutations);
    return failedMutations.length;
  }

  // Get current branch
  async getCurrentBranch() {
    const status = await this.git.status();
    return status.current;
  }

  // Get evolution statistics
  getEvolutionStats() {
    const activeMutations = Array.from(this.mutationBranches.values())
      .filter(m => m.status === 'active');
    
    const mergedMutations = this.evolutionHistory.filter(m => m.status === 'merged');
    
    const avgFitness = activeMutations.length > 0 
      ? activeMutations.reduce((sum, m) => sum + m.fitness, 0) / activeMutations.length 
      : 0;

    return {
      activeMutations: activeMutations.length,
      mergedMutations: mergedMutations.length,
      totalMutations: this.mutationBranches.size,
      averageFitness: avgFitness,
      isM1Optimized: this.isM1Optimized,
      treeStatus: ashvatthaTree.getTreeStatus()
    };
  }
}

export default GitEvolutionEngine;