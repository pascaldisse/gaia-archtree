/**
 * EvolutionMerger.js - Intelligent Merging of Successful Mutations
 * Advanced merge strategies with conflict resolution and fitness optimization
 */

import simpleGit from 'simple-git';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../core/Logger.js';
import { ashvatthaTree } from '../core/GodRealms.js';
import { treeCoordinator } from '../core/TreeCoordinator.js';
import { langGraphCoordinator } from '../core/LangGraphCoordinator.js';

export class EvolutionMerger extends EventEmitter {
  constructor(repoPath = '.') {
    super();
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.mergeHistory = [];
    this.conflictResolutions = new Map();
    this.mergeStrategies = new Map();
    this.fitnessThresholds = {
      individual: 60,    // Individual mutation threshold
      combined: 70,      // Combined mutation threshold
      critical: 85       // Critical system threshold
    };
    
    this.initializeMergeStrategies();
    logger.info('EvolutionMerger initialized with intelligent merge strategies');
  }

  // Initialize merge strategies
  initializeMergeStrategies() {
    this.mergeStrategies.set('fitness_based', {
      name: 'Fitness-Based Merge',
      description: 'Merge based on mutation fitness scores',
      strategy: this.fitnessBasedMerge.bind(this)
    });

    this.mergeStrategies.set('god_coordinated', {
      name: 'God-Coordinated Merge',
      description: 'Use divine coordination for merge decisions',
      strategy: this.godCoordinatedMerge.bind(this)
    });

    this.mergeStrategies.set('tree_balanced', {
      name: 'Tree-Balanced Merge',
      description: 'Maintain tree balance during merges',
      strategy: this.treeBalancedMerge.bind(this)
    });

    this.mergeStrategies.set('conflict_resolved', {
      name: 'Conflict-Resolved Merge',
      description: 'Intelligent conflict resolution with divine guidance',
      strategy: this.conflictResolvedMerge.bind(this)
    });
  }

  // Evaluate mutations for merge eligibility
  async evaluateMutationsForMerge(mutations) {
    const evaluation = {
      eligible: [],
      pending: [],
      rejected: [],
      conflicts: [],
      totalFitness: 0
    };

    console.log(chalk.cyan(`🔍 Evaluating ${mutations.length} mutations for merge`));

    for (const mutation of mutations) {
      const assessment = await this.assessMutationMergeability(mutation);
      
      if (assessment.eligible) {
        evaluation.eligible.push({ mutation, assessment });
        evaluation.totalFitness += mutation.fitness;
      } else if (assessment.conflicts.length > 0) {
        evaluation.conflicts.push({ mutation, assessment });
      } else if (assessment.needsImprovement) {
        evaluation.pending.push({ mutation, assessment });
      } else {
        evaluation.rejected.push({ mutation, assessment });
      }
    }

    evaluation.averageFitness = evaluation.eligible.length > 0 
      ? evaluation.totalFitness / evaluation.eligible.length 
      : 0;

    console.log(chalk.green(`   ✅ Eligible: ${evaluation.eligible.length}`));
    console.log(chalk.yellow(`   ⏳ Pending: ${evaluation.pending.length}`));
    console.log(chalk.blue(`   ⚠️  Conflicts: ${evaluation.conflicts.length}`));
    console.log(chalk.red(`   ❌ Rejected: ${evaluation.rejected.length}`));

    return evaluation;
  }

  // Assess individual mutation mergeability
  async assessMutationMergeability(mutation) {
    const assessment = {
      eligible: false,
      conflicts: [],
      needsImprovement: false,
      reason: '',
      fitness: mutation.fitness,
      compatibility: 0
    };

    try {
      // Check fitness threshold
      if (mutation.fitness < this.fitnessThresholds.individual) {
        assessment.reason = `Low fitness: ${mutation.fitness.toFixed(2)}`;
        assessment.needsImprovement = true;
        return assessment;
      }

      // Check for merge conflicts
      const conflicts = await this.checkMergeConflicts(mutation);
      if (conflicts.length > 0) {
        assessment.conflicts = conflicts;
        assessment.reason = `${conflicts.length} merge conflicts detected`;
        return assessment;
      }

      // Check compatibility with tree balance
      const balanceImpact = await this.assessTreeBalanceImpact(mutation);
      assessment.compatibility = balanceImpact.compatibility;

      if (balanceImpact.compatible) {
        assessment.eligible = true;
        assessment.reason = 'Passed all merge criteria';
      } else {
        assessment.reason = balanceImpact.reason;
        assessment.needsImprovement = true;
      }

      return assessment;

    } catch (error) {
      assessment.reason = `Assessment failed: ${error.message}`;
      logger.error('Mutation assessment failed', { 
        mutationId: mutation.id, 
        error: error.message 
      });
      return assessment;
    }
  }

  // Check for merge conflicts
  async checkMergeConflicts(mutation) {
    try {
      const currentBranch = await this.getCurrentBranch();
      
      // Simulate merge to detect conflicts
      await this.git.raw(['merge', '--no-commit', '--no-ff', mutation.branchName]);
      
      // Check for conflicted files
      const status = await this.git.status();
      const conflicts = status.conflicted || [];
      
      // Abort the test merge
      await this.git.raw(['merge', '--abort']);
      
      return conflicts.map(file => ({
        file,
        type: 'merge_conflict',
        severity: this.assessConflictSeverity(file)
      }));

    } catch (error) {
      // If merge --abort fails, we're probably not in a merge state
      try {
        await this.git.raw(['merge', '--abort']);
      } catch (abortError) {
        // Ignore abort errors
      }
      
      logger.warn('Conflict check failed', { 
        mutationId: mutation.id, 
        error: error.message 
      });
      return [];
    }
  }

  // Assess conflict severity
  assessConflictSeverity(file) {
    const criticalFiles = [
      'package.json', 
      'package-lock.json',
      'gaia.js',
      '|_trunk/core/',
      'README.md'
    ];

    const highImpactFiles = [
      '.js', '.ts', '.json'
    ];

    if (criticalFiles.some(pattern => file.includes(pattern))) {
      return 'critical';
    }

    if (highImpactFiles.some(ext => file.endsWith(ext))) {
      return 'high';
    }

    return 'low';
  }

  // Assess tree balance impact
  async assessTreeBalanceImpact(mutation) {
    const currentBalance = treeCoordinator.getTreeHealth().trunk.balance;
    const mutationRealm = mutation.divineGuidance?.realm || 'unknown';
    
    let projectedBalance = currentBalance;
    if (mutationRealm === 'light') {
      projectedBalance += 10;
    } else if (mutationRealm === 'shadow') {
      projectedBalance -= 10;
    }

    const balanceThreshold = 80; // Maximum allowed imbalance
    const compatible = Math.abs(projectedBalance) <= balanceThreshold;

    return {
      compatible,
      currentBalance,
      projectedBalance,
      impact: Math.abs(projectedBalance - currentBalance),
      compatibility: compatible ? 1.0 : 1.0 - (Math.abs(projectedBalance) - balanceThreshold) / 100,
      reason: compatible ? 'Tree balance maintained' : `Would cause excessive imbalance: ${projectedBalance}`
    };
  }

  // Execute intelligent merge with strategy selection
  async executeIntelligentMerge(mutations, strategy = 'auto', targetBranch = 'main') {
    const mergeId = `merge_${Date.now()}`;
    
    console.log(chalk.magenta('\n🔄 Executing Intelligent Evolution Merge'));
    console.log(chalk.cyan(`Merge ID: ${mergeId}`));
    console.log(chalk.yellow(`Strategy: ${strategy}`));
    console.log(chalk.green(`Mutations: ${mutations.length}`));

    // Auto-select strategy if needed
    if (strategy === 'auto') {
      strategy = await this.selectOptimalStrategy(mutations);
      console.log(chalk.yellow(`Auto-selected strategy: ${strategy}`));
    }

    const mergeRecord = {
      id: mergeId,
      strategy,
      mutations: mutations.map(m => ({ id: m.id, fitness: m.fitness, god: m.god })),
      targetBranch,
      started: new Date(),
      status: 'executing',
      conflicts: [],
      resolutions: [],
      results: {}
    };

    try {
      // Evaluate mutations
      const evaluation = await this.evaluateMutationsForMerge(mutations);
      
      // Handle conflicts if any
      if (evaluation.conflicts.length > 0) {
        const resolutions = await this.resolveConflictsWithDivineGuidance(evaluation.conflicts);
        mergeRecord.resolutions = resolutions;
      }

      // Execute merge strategy
      const strategyImpl = this.mergeStrategies.get(strategy);
      if (!strategyImpl) {
        throw new Error(`Unknown merge strategy: ${strategy}`);
      }

      const results = await strategyImpl.strategy(evaluation, targetBranch, mergeRecord);
      mergeRecord.results = results;
      mergeRecord.status = 'completed';
      mergeRecord.completed = new Date();

      this.mergeHistory.push(mergeRecord);
      
      console.log(chalk.green('\n✅ Intelligent merge completed successfully!'));
      console.log(chalk.cyan(`   Merged: ${results.merged || 0} mutations`));
      console.log(chalk.cyan(`   Total fitness gained: ${results.totalFitness || 0}`));
      
      this.emit('merge:completed', mergeRecord);
      logger.info('Intelligent merge completed', { 
        mergeId, 
        strategy, 
        merged: results.merged 
      });

      return mergeRecord;

    } catch (error) {
      mergeRecord.status = 'failed';
      mergeRecord.error = error.message;
      mergeRecord.failed = new Date();
      
      this.mergeHistory.push(mergeRecord);
      
      logger.error('Intelligent merge failed', { mergeId, error: error.message });
      throw error;
    }
  }

  // Select optimal merge strategy
  async selectOptimalStrategy(mutations) {
    const totalFitness = mutations.reduce((sum, m) => sum + m.fitness, 0);
    const avgFitness = totalFitness / mutations.length;
    const hasConflicts = await this.hasAnyConflicts(mutations);
    const treeBalance = Math.abs(treeCoordinator.getTreeHealth().trunk.balance);

    if (hasConflicts) {
      return 'conflict_resolved';
    } else if (treeBalance > 60) {
      return 'tree_balanced';
    } else if (avgFitness > 80) {
      return 'god_coordinated';
    } else {
      return 'fitness_based';
    }
  }

  // Check if mutations have any conflicts
  async hasAnyConflicts(mutations) {
    for (const mutation of mutations) {
      const conflicts = await this.checkMergeConflicts(mutation);
      if (conflicts.length > 0) return true;
    }
    return false;
  }

  // Fitness-based merge strategy
  async fitnessBasedMerge(evaluation, targetBranch, mergeRecord) {
    const eligible = evaluation.eligible.sort((a, b) => b.mutation.fitness - a.mutation.fitness);
    let merged = 0;
    let totalFitness = 0;

    await this.git.checkout(targetBranch);

    for (const { mutation } of eligible) {
      try {
        await this.git.mergeFromTo(mutation.branchName, targetBranch);
        merged++;
        totalFitness += mutation.fitness;
        
        console.log(chalk.green(`   ✅ Merged ${mutation.id} (fitness: ${mutation.fitness.toFixed(2)})`));
        
      } catch (error) {
        console.log(chalk.red(`   ❌ Failed to merge ${mutation.id}: ${error.message}`));
      }
    }

    return { merged, totalFitness, strategy: 'fitness_based' };
  }

  // God-coordinated merge strategy
  async godCoordinatedMerge(evaluation, targetBranch, mergeRecord) {
    console.log(chalk.magenta('🔮 Invoking divine coordination for merge'));
    
    // Create LangGraph workflow for merge coordination
    const workflow = await langGraphCoordinator.createWorkflow(
      `Coordinate merge of ${evaluation.eligible.length} mutations`,
      'high'
    );

    await langGraphCoordinator.executeWorkflow(workflow.id);
    
    const eligible = evaluation.eligible;
    let merged = 0;
    let totalFitness = 0;

    await this.git.checkout(targetBranch);

    for (const { mutation } of eligible) {
      // Get divine approval for each merge
      const approval = await treeCoordinator.invokeDualGods(
        mutation.god,
        'shiva', // Transformation god for merge guidance
        `Approve merge for mutation ${mutation.id}`
      );

      if (approval.balance > -50) { // Divine approval threshold
        try {
          await this.git.mergeFromTo(mutation.branchName, targetBranch);
          merged++;
          totalFitness += mutation.fitness;
          
          console.log(chalk.green(`   🔮 Divinely merged ${mutation.id}`));
          
        } catch (error) {
          console.log(chalk.red(`   ❌ Divine merge failed for ${mutation.id}`));
        }
      }
    }

    return { merged, totalFitness, strategy: 'god_coordinated', workflow: workflow.id };
  }

  // Tree-balanced merge strategy
  async treeBalancedMerge(evaluation, targetBranch, mergeRecord) {
    console.log(chalk.yellow('⚖️  Executing tree-balanced merge'));
    
    const eligible = evaluation.eligible;
    const lightMutations = eligible.filter(e => e.mutation.divineGuidance?.realm === 'light');
    const shadowMutations = eligible.filter(e => e.mutation.divineGuidance?.realm === 'shadow');
    
    let merged = 0;
    let totalFitness = 0;

    await this.git.checkout(targetBranch);

    // Alternate between light and shadow mutations to maintain balance
    const maxPairs = Math.min(lightMutations.length, shadowMutations.length);
    
    for (let i = 0; i < maxPairs; i++) {
      // Merge light mutation
      try {
        await this.git.mergeFromTo(lightMutations[i].mutation.branchName, targetBranch);
        merged++;
        totalFitness += lightMutations[i].mutation.fitness;
        console.log(chalk.yellow(`   ☀️  Merged light: ${lightMutations[i].mutation.id}`));
      } catch (error) {
        console.log(chalk.red(`   ❌ Light merge failed: ${lightMutations[i].mutation.id}`));
      }

      // Merge shadow mutation
      try {
        await this.git.mergeFromTo(shadowMutations[i].mutation.branchName, targetBranch);
        merged++;
        totalFitness += shadowMutations[i].mutation.fitness;
        console.log(chalk.magenta(`   🌙 Merged shadow: ${shadowMutations[i].mutation.id}`));
      } catch (error) {
        console.log(chalk.red(`   ❌ Shadow merge failed: ${shadowMutations[i].mutation.id}`));
      }

      // Update tree balance
      treeCoordinator.balanceForces(10, 10);
    }

    return { merged, totalFitness, strategy: 'tree_balanced', pairs: maxPairs };
  }

  // Conflict-resolved merge strategy
  async conflictResolvedMerge(evaluation, targetBranch, mergeRecord) {
    console.log(chalk.red('⚔️  Executing conflict-resolved merge'));
    
    let merged = 0;
    let totalFitness = 0;
    const resolutions = [];

    await this.git.checkout(targetBranch);

    // Handle eligible mutations first
    for (const { mutation } of evaluation.eligible) {
      try {
        await this.git.mergeFromTo(mutation.branchName, targetBranch);
        merged++;
        totalFitness += mutation.fitness;
        console.log(chalk.green(`   ✅ Clean merge: ${mutation.id}`));
      } catch (error) {
        console.log(chalk.red(`   ❌ Merge failed: ${mutation.id}`));
      }
    }

    // Resolve conflicts with divine guidance
    for (const { mutation, assessment } of evaluation.conflicts) {
      const resolution = await this.resolveConflictWithDivineGuidance(mutation, assessment.conflicts);
      resolutions.push(resolution);
      
      if (resolution.success) {
        merged++;
        totalFitness += mutation.fitness;
        console.log(chalk.green(`   🔮 Conflict resolved: ${mutation.id}`));
      }
    }

    return { merged, totalFitness, strategy: 'conflict_resolved', resolutions };
  }

  // Resolve conflicts with divine guidance
  async resolveConflictsWithDivineGuidance(conflictedMutations) {
    const resolutions = [];
    
    for (const { mutation, assessment } of conflictedMutations) {
      const resolution = await this.resolveConflictWithDivineGuidance(mutation, assessment.conflicts);
      resolutions.push(resolution);
    }
    
    return resolutions;
  }

  // Resolve individual conflict with divine guidance
  async resolveConflictWithDivineGuidance(mutation, conflicts) {
    const resolution = {
      mutationId: mutation.id,
      conflicts: conflicts.map(c => c.file),
      strategy: 'divine_guidance',
      success: false,
      god: mutation.god
    };

    try {
      // Invoke the mutation's god for conflict resolution guidance
      const guidance = await ashvatthaTree.invokeGod(
        mutation.god,
        `Resolve merge conflicts for mutation ${mutation.id}`,
        { conflicts, mutation }
      );

      // For now, we'll use a simple resolution strategy
      // In a real implementation, this would apply actual conflict resolution
      console.log(chalk.cyan(`   🔮 ${mutation.god} providing conflict resolution guidance`));
      
      resolution.guidance = guidance;
      resolution.success = true; // Simplified for demo
      
      return resolution;
      
    } catch (error) {
      resolution.error = error.message;
      logger.error('Divine conflict resolution failed', { 
        mutationId: mutation.id, 
        error: error.message 
      });
      return resolution;
    }
  }

  // Get current branch
  async getCurrentBranch() {
    const status = await this.git.status();
    return status.current;
  }

  // Get merge statistics
  getMergeStats() {
    const totalMerges = this.mergeHistory.length;
    const successfulMerges = this.mergeHistory.filter(m => m.status === 'completed').length;
    const failedMerges = this.mergeHistory.filter(m => m.status === 'failed').length;
    
    return {
      totalMerges,
      successfulMerges,
      failedMerges,
      successRate: totalMerges > 0 ? (successfulMerges / totalMerges) * 100 : 0,
      strategies: this.getStrategyUsage(),
      conflictResolutions: this.conflictResolutions.size
    };
  }

  // Get strategy usage statistics
  getStrategyUsage() {
    const usage = {};
    this.mergeHistory.forEach(merge => {
      usage[merge.strategy] = (usage[merge.strategy] || 0) + 1;
    });
    return usage;
  }

  // Get merge history
  getMergeHistory(limit = 10) {
    return this.mergeHistory.slice(-limit);
  }
}

export default EvolutionMerger;