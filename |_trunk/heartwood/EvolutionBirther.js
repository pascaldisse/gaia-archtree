/**
 * EvolutionBirther.js - Git-based Evolutionary Birthing System
 * Creates new evolutionary lineages through git branching and divine intervention
 */

import simpleGit from 'simple-git';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import crypto from 'crypto';
import { logger } from '../core/Logger.js';
import { ashvatthaTree } from '../core/GodRealms.js';
import { treeCoordinator } from '../core/TreeCoordinator.js';
import WorktreeManager from './WorktreeManager.js';
import MutationBrancher from './MutationBrancher.js';

export class EvolutionBirther extends EventEmitter {
  constructor(repoPath = '.') {
    super();
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.lineages = new Map(); // lineageId -> lineage info
    this.generations = new Map(); // generationId -> generation info
    this.birthHistory = [];
    this.maxActiveLineages = 5; // M1 optimization
    
    // Initialize sub-systems
    this.worktreeManager = new WorktreeManager(repoPath);
    this.mutationBrancher = new MutationBrancher(repoPath);
    
    logger.info('EvolutionBirther initialized for evolutionary lineage management');
  }

  // Generate unique lineage ID
  generateLineageId(species = 'evolution') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(3).toString('hex');
    return `${species}_lineage_${timestamp}_${random}`;
  }

  // Birth new evolutionary lineage
  async birthNewLineage(parentLineage = 'main', godPair = null, species = 'hybrid') {
    if (this.lineages.size >= this.maxActiveLineages) {
      throw new Error(`Maximum active lineages (${this.maxActiveLineages}) reached`);
    }

    const lineageId = this.generateLineageId(species);
    
    // Auto-select god pair if not provided
    if (!godPair) {
      godPair = this.selectOptimalGodPair(species);
    }

    const birthRecord = {
      id: lineageId,
      species,
      parentLineage,
      lightGod: godPair.light,
      shadowGod: godPair.shadow,
      birthed: new Date(),
      status: 'birthing',
      generations: [],
      totalFitness: 0,
      activeWorktrees: 0,
      activeMutations: 0
    };

    try {
      console.log(chalk.magenta('\n🌱 Birthing New Evolutionary Lineage'));
      console.log(chalk.cyan(`Lineage ID: ${lineageId}`));
      console.log(chalk.yellow(`Species: ${species}`));
      console.log(chalk.green(`Light God: ${godPair.light} ☀️`));
      console.log(chalk.red(`Shadow God: ${godPair.shadow} 🌙`));

      // Invoke dual gods for lineage blessing
      const blessing = await treeCoordinator.invokeDualGods(
        godPair.light,
        godPair.shadow,
        `Birth new evolutionary lineage: ${lineageId}`
      );

      birthRecord.divineBlessing = blessing;
      birthRecord.status = 'active';

      // Create initial generation
      const firstGeneration = await this.createGeneration(lineageId, 0, 'genesis');
      birthRecord.generations.push(firstGeneration.id);

      this.lineages.set(lineageId, birthRecord);
      this.birthHistory.push(birthRecord);

      console.log(chalk.green('✨ Lineage birthed successfully!'));
      console.log(chalk.cyan(`   First Generation: ${firstGeneration.id}`));
      console.log(chalk.cyan(`   Divine Balance: ${blessing.balance}`));

      this.emit('lineage:birthed', birthRecord);
      logger.info('Evolutionary lineage birthed', { 
        lineageId, 
        species, 
        gods: godPair 
      });

      return birthRecord;

    } catch (error) {
      birthRecord.status = 'birth_failed';
      birthRecord.error = error.message;
      logger.error('Lineage birth failed', { lineageId, error: error.message });
      throw error;
    }
  }

  // Select optimal god pair for species
  selectOptimalGodPair(species) {
    const speciesGodMappings = {
      'performance': { light: 'thor', shadow: 'mahakala' },
      'security': { light: 'heimdall', shadow: 'durga' },
      'architecture': { light: 'odin', shadow: 'avidya' },
      'optimization': { light: 'freyr', shadow: 'kali' },
      'transformation': { light: 'modi', shadow: 'shiva' },
      'beauty': { light: 'baldr', shadow: 'nirrti' },
      'testing': { light: 'thor', shadow: 'mara' },
      'documentation': { light: 'bragi', shadow: 'yama' },
      'hybrid': { light: 'odin', shadow: 'shiva' }, // Default balanced pair
      'experimental': { light: 'vili', shadow: 'tamas' }
    };

    return speciesGodMappings[species] || speciesGodMappings.hybrid;
  }

  // Create new generation within lineage
  async createGeneration(lineageId, generationNumber, generationType = 'evolution') {
    const lineage = this.lineages.get(lineageId);
    if (!lineage) {
      throw new Error(`Lineage ${lineageId} not found`);
    }

    const generationId = `gen_${generationNumber}_${lineageId}_${Date.now()}`;
    
    const generation = {
      id: generationId,
      lineageId,
      number: generationNumber,
      type: generationType,
      created: new Date(),
      status: 'active',
      mutations: [],
      worktrees: [],
      fitness: 0,
      parentGeneration: generationNumber > 0 ? lineage.generations[generationNumber - 1] : null
    };

    try {
      console.log(chalk.cyan(`🧬 Creating Generation ${generationNumber} for lineage ${lineageId}`));

      // Create initial mutations for this generation
      const initialMutations = await this.createInitialMutations(generation, lineage);
      generation.mutations = initialMutations.map(m => m.id);

      // Create worktrees for parallel evolution
      const worktrees = await this.createGenerationWorktrees(generation, lineage);
      generation.worktrees = worktrees.map(w => w.id);

      this.generations.set(generationId, generation);
      
      console.log(chalk.green(`   ✅ Generation created with ${initialMutations.length} mutations`));
      console.log(chalk.cyan(`   🌿 ${worktrees.length} worktrees allocated`));

      this.emit('generation:created', generation);
      logger.info('Generation created', { 
        generationId, 
        lineageId, 
        mutations: initialMutations.length 
      });

      return generation;

    } catch (error) {
      generation.status = 'failed';
      generation.error = error.message;
      logger.error('Generation creation failed', { generationId, error: error.message });
      throw error;
    }
  }

  // Create initial mutations for generation
  async createInitialMutations(generation, lineage) {
    const mutations = [];
    const mutationTypes = this.selectMutationTypes(lineage.species);
    
    for (const mutationType of mutationTypes) {
      try {
        // Alternate between light and shadow gods for mutations
        const god = mutations.length % 2 === 0 ? lineage.lightGod : lineage.shadowGod;
        
        const mutation = await this.mutationBrancher.createMutationBranch(
          mutationType,
          lineage.parentLineage,
          god
        );

        mutation.lineageId = lineage.id;
        mutation.generationId = generation.id;
        mutations.push(mutation);

        console.log(chalk.gray(`     🧬 ${mutationType} mutation: ${mutation.id}`));

      } catch (error) {
        logger.warn('Failed to create initial mutation', { 
          mutationType, 
          error: error.message 
        });
      }
    }

    return mutations;
  }

  // Select mutation types based on species
  selectMutationTypes(species) {
    const speciesMutations = {
      'performance': ['optimize', 'refactor', 'cleanup'],
      'security': ['security', 'testing', 'validation'],
      'architecture': ['refactor', 'architecture', 'docs'],
      'optimization': ['optimize', 'performance', 'cleanup'],
      'transformation': ['breaking', 'refactor', 'architecture'],
      'beauty': ['ui', 'docs', 'cleanup'],
      'testing': ['testing', 'debug', 'validation'],
      'documentation': ['docs', 'cleanup', 'refactor'],
      'hybrid': ['optimize', 'refactor', 'testing'],
      'experimental': ['breaking', 'experimental', 'optimize']
    };

    return speciesMutations[species] || speciesMutations.hybrid;
  }

  // Create worktrees for generation
  async createGenerationWorktrees(generation, lineage) {
    const worktrees = [];
    const worktreeCount = Math.min(3, generation.mutations.length); // 3 worktrees per generation
    
    for (let i = 0; i < worktreeCount; i++) {
      try {
        const evolutionId = `${generation.id}_wt_${i}`;
        const god = i % 2 === 0 ? lineage.lightGod : lineage.shadowGod;
        
        const worktree = await this.worktreeManager.createEvolutionWorktree(
          evolutionId,
          lineage.parentLineage,
          god
        );

        worktree.lineageId = lineage.id;
        worktree.generationId = generation.id;
        worktrees.push(worktree);

      } catch (error) {
        logger.warn('Failed to create generation worktree', { 
          generationId: generation.id, 
          error: error.message 
        });
      }
    }

    return worktrees;
  }

  // Evolve generation (apply mutations and calculate fitness)
  async evolveGeneration(generationId, evolutionCycles = 3) {
    const generation = this.generations.get(generationId);
    if (!generation) {
      throw new Error(`Generation ${generationId} not found`);
    }

    const lineage = this.lineages.get(generation.lineageId);
    if (!lineage) {
      throw new Error(`Lineage ${generation.lineageId} not found`);
    }

    console.log(chalk.cyan(`🌟 Evolving Generation ${generation.number} (${evolutionCycles} cycles)`));

    try {
      let totalFitness = 0;
      let evolutionCount = 0;

      for (let cycle = 0; cycle < evolutionCycles; cycle++) {
        console.log(chalk.yellow(`   Cycle ${cycle + 1}/${evolutionCycles}`));

        // Apply mutations to worktrees
        for (const worktreeId of generation.worktrees) {
          try {
            const mutation = {
              id: `${generation.id}_cycle_${cycle}`,
              type: 'evolution',
              description: `Generation evolution cycle ${cycle + 1}`
            };

            const worktree = await this.worktreeManager.applyMutation(
              worktreeId,
              mutation,
              `Generation ${generation.number} evolution cycle ${cycle + 1}`
            );

            totalFitness += worktree.fitness;
            evolutionCount++;

          } catch (error) {
            logger.warn('Evolution cycle failed for worktree', { 
              worktreeId, 
              cycle, 
              error: error.message 
            });
          }
        }

        // Brief pause between cycles
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      generation.fitness = evolutionCount > 0 ? totalFitness / evolutionCount : 0;
      generation.evolutionCycles = evolutionCycles;
      generation.evolved = new Date();

      // Update lineage fitness
      lineage.totalFitness += generation.fitness;

      console.log(chalk.green(`   ✨ Evolution complete! Average fitness: ${generation.fitness.toFixed(2)}`));

      this.emit('generation:evolved', generation);
      logger.info('Generation evolved', { 
        generationId, 
        fitness: generation.fitness,
        cycles: evolutionCycles 
      });

      return generation;

    } catch (error) {
      generation.status = 'evolution_failed';
      generation.error = error.message;
      logger.error('Generation evolution failed', { generationId, error: error.message });
      throw error;
    }
  }

  // Birth next generation from successful mutations
  async birthNextGeneration(lineageId, fitnessThreshold = 70) {
    const lineage = this.lineages.get(lineageId);
    if (!lineage) {
      throw new Error(`Lineage ${lineageId} not found`);
    }

    const currentGeneration = lineage.generations.length - 1;
    const parentGenerationId = lineage.generations[currentGeneration];
    const parentGeneration = this.generations.get(parentGenerationId);

    if (!parentGeneration || parentGeneration.fitness < fitnessThreshold) {
      throw new Error(`Parent generation fitness too low: ${parentGeneration?.fitness || 0}`);
    }

    console.log(chalk.magenta(`🌱 Birthing Generation ${currentGeneration + 1} from successful lineage`));

    try {
      // Create next generation
      const nextGeneration = await this.createGeneration(
        lineageId, 
        currentGeneration + 1, 
        'descendant'
      );

      // Update lineage
      lineage.generations.push(nextGeneration.id);
      
      console.log(chalk.green(`   🌟 Generation ${currentGeneration + 1} birthed successfully!`));
      
      this.emit('lineage:generation_birthed', { lineage, generation: nextGeneration });
      
      return nextGeneration;

    } catch (error) {
      logger.error('Next generation birth failed', { lineageId, error: error.message });
      throw error;
    }
  }

  // Terminate lineage (end evolution)
  async terminateLineage(lineageId, reason = 'Natural completion') {
    const lineage = this.lineages.get(lineageId);
    if (!lineage) {
      throw new Error(`Lineage ${lineageId} not found`);
    }

    console.log(chalk.red(`💀 Terminating lineage ${lineageId}`));
    console.log(chalk.gray(`   Reason: ${reason}`));

    try {
      // Clean up all worktrees for this lineage
      for (const generation of lineage.generations) {
        const gen = this.generations.get(generation);
        if (gen) {
          for (const worktreeId of gen.worktrees) {
            try {
              await this.worktreeManager.cleanupWorktree(worktreeId);
            } catch (error) {
              logger.warn('Failed to cleanup worktree during termination', { 
                worktreeId, 
                error: error.message 
              });
            }
          }
        }
      }

      lineage.status = 'terminated';
      lineage.terminated = new Date();
      lineage.terminationReason = reason;

      this.lineages.delete(lineageId);

      console.log(chalk.green(`   ✅ Lineage terminated cleanly`));

      this.emit('lineage:terminated', lineage);
      logger.info('Lineage terminated', { lineageId, reason });

    } catch (error) {
      logger.error('Lineage termination failed', { lineageId, error: error.message });
      throw error;
    }
  }

  // Get lineage statistics
  getLineageStats(lineageId) {
    const lineage = this.lineages.get(lineageId);
    if (!lineage) {
      return null;
    }

    const generations = lineage.generations.map(genId => this.generations.get(genId));
    const totalGenerations = generations.length;
    const avgFitness = totalGenerations > 0 ? lineage.totalFitness / totalGenerations : 0;

    return {
      id: lineageId,
      species: lineage.species,
      status: lineage.status,
      gods: { light: lineage.lightGod, shadow: lineage.shadowGod },
      generations: totalGenerations,
      totalFitness: lineage.totalFitness,
      averageFitness: avgFitness,
      age: Date.now() - lineage.birthed.getTime(),
      activeWorktrees: lineage.activeWorktrees,
      activeMutations: lineage.activeMutations
    };
  }

  // Get all lineages overview
  getAllLineagesOverview() {
    const active = Array.from(this.lineages.values()).filter(l => l.status === 'active');
    const terminated = this.birthHistory.filter(l => l.status === 'terminated');

    return {
      activeLineages: active.length,
      terminatedLineages: terminated.length,
      totalLineages: this.birthHistory.length,
      totalGenerations: this.generations.size,
      species: [...new Set(this.birthHistory.map(l => l.species))],
      overview: active.map(l => this.getLineageStats(l.id))
    };
  }
}

export default EvolutionBirther;