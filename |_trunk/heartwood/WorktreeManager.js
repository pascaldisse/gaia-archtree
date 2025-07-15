/**
 * WorktreeManager.js - Parallel Evolution Worktrees Management
 * Manages multiple git worktrees for parallel evolutionary development
 */

import simpleGit from 'simple-git';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../core/Logger.js';
import { ashvatthaTree } from '../core/GodRealms.js';

export class WorktreeManager extends EventEmitter {
  constructor(repoPath = '.') {
    super();
    this.git = simpleGit(repoPath);
    this.repoPath = path.resolve(repoPath);
    this.worktrees = new Map(); // worktreeId -> worktree info
    this.worktreeDir = path.join(this.repoPath, '.gaia-worktrees');
    this.maxWorktrees = 10; // M1 optimized for 10 parallel cores
    
    this.initializeWorktreeSystem();
    logger.info('WorktreeManager initialized', { repoPath: this.repoPath });
  }

  async initializeWorktreeSystem() {
    try {
      // Ensure worktree directory exists
      await fs.ensureDir(this.worktreeDir);
      
      // Check git worktree support
      const gitVersion = await this.git.raw(['--version']);
      logger.debug('Git version check', { gitVersion });
      
      console.log(chalk.cyan('🌿 WorktreeManager: Parallel evolution system ready'));
      
    } catch (error) {
      logger.error('WorktreeManager initialization failed', { error: error.message });
      throw error;
    }
  }

  // Create a new worktree for evolution
  async createEvolutionWorktree(evolutionId, baseBranch = 'main', godName = 'Brahma') {
    if (this.worktrees.size >= this.maxWorktrees) {
      throw new Error(`Maximum worktrees (${this.maxWorktrees}) reached. Clean up before creating new ones.`);
    }

    const worktreeId = `evolution_${evolutionId}_${Date.now()}`;
    const branchName = `evolution/${evolutionId}`;
    const worktreePath = path.join(this.worktreeDir, worktreeId);

    try {
      // Invoke god for divine guidance on worktree creation
      await ashvatthaTree.invokeGod(godName, `Creating evolution worktree: ${worktreeId}`);

      // Create new branch for evolution
      await this.git.checkoutLocalBranch(branchName);
      await this.git.checkout(baseBranch);

      // Create worktree
      await this.git.raw(['worktree', 'add', worktreePath, branchName]);
      
      const worktree = {
        id: worktreeId,
        evolutionId,
        path: worktreePath,
        branchName,
        baseBranch,
        god: godName,
        created: new Date(),
        status: 'active',
        commits: [],
        mutations: 0,
        fitness: 0,
        git: simpleGit(worktreePath) // Separate git instance for this worktree
      };

      this.worktrees.set(worktreeId, worktree);
      
      console.log(chalk.green(`🌿 Evolution worktree created: ${worktreeId}`));
      console.log(chalk.yellow(`   Path: ${worktreePath}`));
      console.log(chalk.yellow(`   Branch: ${branchName}`));
      console.log(chalk.yellow(`   God: ${godName}`));
      
      this.emit('worktree:created', worktree);
      logger.info('Evolution worktree created', { worktreeId, evolutionId, god: godName });
      
      return worktree;
      
    } catch (error) {
      logger.error('Failed to create evolution worktree', { 
        worktreeId, 
        error: error.message 
      });
      throw error;
    }
  }

  // Apply mutation to a specific worktree
  async applyMutation(worktreeId, mutation, commitMessage) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) {
      throw new Error(`Worktree ${worktreeId} not found`);
    }

    try {
      console.log(chalk.cyan(`🧬 Applying mutation to ${worktreeId}`));
      
      // Apply the mutation (this would contain actual code changes)
      await this.applyMutationChanges(worktree, mutation);
      
      // Stage and commit changes in the worktree
      await worktree.git.add('.');
      const commit = await worktree.git.commit(`${commitMessage}\n\n🧬 Mutation: ${mutation.id}\n🔮 God: ${worktree.god}`);
      
      worktree.commits.push({
        hash: commit.commit,
        message: commitMessage,
        mutation: mutation.id,
        timestamp: new Date()
      });
      
      worktree.mutations++;
      worktree.fitness = await this.calculateWorktreeFitness(worktree);
      
      console.log(chalk.green(`✨ Mutation applied | Fitness: ${worktree.fitness.toFixed(2)}`));
      
      this.emit('mutation:applied', { worktree, mutation, commit });
      logger.info('Mutation applied to worktree', { 
        worktreeId, 
        mutationId: mutation.id, 
        fitness: worktree.fitness 
      });
      
      return worktree;
      
    } catch (error) {
      logger.error('Failed to apply mutation', { worktreeId, error: error.message });
      throw error;
    }
  }

  // Apply actual mutation changes (placeholder for real implementation)
  async applyMutationChanges(worktree, mutation) {
    // This is where you would apply actual code mutations
    // For now, we'll create a simple mutation marker file
    const mutationFile = path.join(worktree.path, '.gaia-mutations', `${mutation.id}.json`);
    await fs.ensureDir(path.dirname(mutationFile));
    await fs.writeJson(mutationFile, {
      id: mutation.id,
      type: mutation.type,
      applied: new Date(),
      god: worktree.god,
      description: mutation.description || 'Divine mutation applied'
    });
  }

  // Calculate fitness for a worktree
  async calculateWorktreeFitness(worktree) {
    let fitness = 0;
    
    try {
      // Base fitness from commit activity
      fitness += worktree.commits.length * 10;
      
      // Mutation count bonus
      fitness += worktree.mutations * 5;
      
      // God-specific bonuses
      const godBonuses = {
        'Brahma': 20,    // Creator bonus
        'Vishnu': 15,    // Preserver bonus
        'Shiva': 25,     // Transformer bonus (highest)
        'Saraswati': 18, // Wisdom bonus
        'Lakshmi': 12,   // Prosperity bonus
        'Kali': 22,      // Destruction bonus
        'Durga': 16      // Protection bonus
      };
      
      fitness += godBonuses[worktree.god] || 10;
      
      // Time factor (newer mutations get slight bonus)
      const ageInHours = (Date.now() - worktree.created.getTime()) / (1000 * 60 * 60);
      const timeFactor = Math.max(0.5, 1 - (ageInHours / 24)); // Decay over 24 hours
      fitness *= timeFactor;
      
      // Check if worktree has any actual code (file count bonus)
      const stats = await this.getWorktreeStats(worktree);
      fitness += stats.fileCount * 2;
      
      return Math.max(0, Math.min(100, fitness)); // Normalize to 0-100
      
    } catch (error) {
      logger.warn('Fitness calculation failed', { worktreeId: worktree.id, error: error.message });
      return 50; // Default fitness
    }
  }

  // Get worktree statistics
  async getWorktreeStats(worktree) {
    try {
      const status = await worktree.git.status();
      const log = await worktree.git.log(['--oneline', '-10']);
      
      // Count files in worktree (excluding .git)
      const files = await this.countFiles(worktree.path);
      
      return {
        fileCount: files,
        commits: log.all.length,
        ahead: status.ahead,
        behind: status.behind,
        modified: status.modified.length,
        created: status.created.length,
        deleted: status.deleted.length
      };
    } catch (error) {
      logger.warn('Failed to get worktree stats', { worktreeId: worktree.id });
      return { fileCount: 0, commits: 0 };
    }
  }

  // Count files in directory (excluding .git)
  async countFiles(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      let count = 0;
      
      for (const file of files) {
        if (file === '.git') continue;
        
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          count += await this.countFiles(filePath);
        } else {
          count++;
        }
      }
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  // Merge successful evolution back to main
  async mergeEvolution(worktreeId, targetBranch = 'main', fitnessThreshold = 70) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) {
      throw new Error(`Worktree ${worktreeId} not found`);
    }

    if (worktree.fitness < fitnessThreshold) {
      console.log(chalk.yellow(`⚠️  Evolution fitness too low (${worktree.fitness.toFixed(2)} < ${fitnessThreshold})`));
      return false;
    }

    try {
      console.log(chalk.green(`🔄 Merging evolution ${worktreeId} to ${targetBranch}`));
      
      // Switch to target branch in main repo
      await this.git.checkout(targetBranch);
      
      // Merge the evolution branch
      await this.git.mergeFromTo(worktree.branchName, targetBranch);
      
      worktree.status = 'merged';
      worktree.mergedAt = new Date();
      worktree.mergedTo = targetBranch;
      
      console.log(chalk.green(`✅ Evolution merged successfully`));
      console.log(chalk.cyan(`   Fitness: ${worktree.fitness.toFixed(2)}`));
      console.log(chalk.cyan(`   Mutations: ${worktree.mutations}`));
      console.log(chalk.cyan(`   Commits: ${worktree.commits.length}`));
      
      this.emit('evolution:merged', worktree);
      logger.info('Evolution merged', { 
        worktreeId, 
        targetBranch, 
        fitness: worktree.fitness 
      });
      
      return true;
      
    } catch (error) {
      worktree.status = 'merge_failed';
      worktree.error = error.message;
      logger.error('Evolution merge failed', { worktreeId, error: error.message });
      throw error;
    }
  }

  // Cleanup worktree (remove from filesystem)
  async cleanupWorktree(worktreeId) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) {
      throw new Error(`Worktree ${worktreeId} not found`);
    }

    try {
      // Remove worktree
      await this.git.raw(['worktree', 'remove', worktree.path, '--force']);
      
      // Delete the evolution branch
      try {
        await this.git.deleteLocalBranch(worktree.branchName, true);
      } catch (branchError) {
        logger.warn('Failed to delete evolution branch', { 
          branch: worktree.branchName, 
          error: branchError.message 
        });
      }
      
      worktree.status = 'cleaned';
      worktree.cleanedAt = new Date();
      
      this.worktrees.delete(worktreeId);
      
      console.log(chalk.red(`🗑️  Worktree cleaned: ${worktreeId}`));
      
      this.emit('worktree:cleaned', worktree);
      logger.info('Worktree cleaned', { worktreeId });
      
    } catch (error) {
      logger.error('Failed to cleanup worktree', { worktreeId, error: error.message });
      throw error;
    }
  }

  // Prune low-fitness worktrees
  async pruneLowFitnessWorktrees(fitnessThreshold = 30) {
    const lowFitnessWorktrees = Array.from(this.worktrees.values())
      .filter(w => w.status === 'active' && w.fitness < fitnessThreshold);

    console.log(chalk.yellow(`🌿 Pruning ${lowFitnessWorktrees.length} low-fitness worktrees`));

    for (const worktree of lowFitnessWorktrees) {
      try {
        await this.cleanupWorktree(worktree.id);
      } catch (error) {
        logger.warn('Failed to prune worktree', { 
          worktreeId: worktree.id, 
          error: error.message 
        });
      }
    }

    return lowFitnessWorktrees.length;
  }

  // Get all worktrees status
  getWorktreesStatus() {
    const worktrees = Array.from(this.worktrees.values());
    
    return {
      total: worktrees.length,
      active: worktrees.filter(w => w.status === 'active').length,
      merged: worktrees.filter(w => w.status === 'merged').length,
      failed: worktrees.filter(w => w.status === 'merge_failed').length,
      averageFitness: worktrees.length > 0 
        ? worktrees.reduce((sum, w) => sum + w.fitness, 0) / worktrees.length 
        : 0,
      totalMutations: worktrees.reduce((sum, w) => sum + w.mutations, 0),
      totalCommits: worktrees.reduce((sum, w) => sum + w.commits.length, 0)
    };
  }

  // List all worktrees
  listWorktrees() {
    return Array.from(this.worktrees.values()).map(w => ({
      id: w.id,
      evolutionId: w.evolutionId,
      god: w.god,
      status: w.status,
      fitness: w.fitness,
      mutations: w.mutations,
      commits: w.commits.length,
      created: w.created
    }));
  }

  // Get specific worktree info
  getWorktree(worktreeId) {
    return this.worktrees.get(worktreeId);
  }
}

export default WorktreeManager;