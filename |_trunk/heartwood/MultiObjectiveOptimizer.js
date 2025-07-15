/**
 * MultiObjectiveOptimizer.js - Advanced Multi-Objective Evolution System
 * NSGA-II inspired optimizer for balancing multiple conflicting evolution objectives
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import { logger } from '../core/Logger.js';
import { ashvatthaTree } from '../core/GodRealms.js';
import { treeCoordinator } from '../core/TreeCoordinator.js';

export class MultiObjectiveOptimizer extends EventEmitter {
  constructor() {
    super();
    this.objectives = new Map();
    this.solutions = new Map();
    this.paretoFronts = [];
    this.generations = 0;
    this.populationSize = 50;
    this.archiveSize = 100;
    
    // Default objectives for code evolution
    this.defaultObjectives = {
      performance: {
        name: 'Performance',
        weight: 1.0,
        maximize: true,
        description: 'Code execution speed and efficiency',
        divine_patron: 'thor'
      },
      maintainability: {
        name: 'Maintainability', 
        weight: 1.0,
        maximize: true,
        description: 'Code readability and modularity',
        divine_patron: 'odin'
      },
      complexity: {
        name: 'Complexity',
        weight: 1.0,
        maximize: false,
        description: 'Algorithmic and cyclomatic complexity',
        divine_patron: 'vidar'
      },
      security: {
        name: 'Security',
        weight: 1.0,
        maximize: true,
        description: 'Code security and vulnerability resistance',
        divine_patron: 'heimdall'
      },
      innovation: {
        name: 'Innovation',
        weight: 0.8,
        maximize: true,
        description: 'Creative and novel solutions',
        divine_patron: 'loki'
      },
      divine_harmony: {
        name: 'Divine Harmony',
        weight: 0.6,
        maximize: true,
        description: 'Alignment with tree balance and sacred patterns',
        divine_patron: 'baldr'
      }
    };
    
    this.initializeObjectives();
    logger.info('MultiObjectiveOptimizer initialized with NSGA-II algorithm');
  }

  // Initialize default objectives
  initializeObjectives() {
    for (const [key, objective] of Object.entries(this.defaultObjectives)) {
      this.addObjective(key, objective);
    }
    
    console.log(chalk.cyan(`🎯 Initialized ${this.objectives.size} optimization objectives`));
  }

  // Add new objective
  addObjective(id, objective) {
    if (!objective.name || typeof objective.maximize !== 'boolean') {
      throw new Error('Objective must have name and maximize properties');
    }
    
    const objectiveConfig = {
      id,
      name: objective.name,
      weight: objective.weight || 1.0,
      maximize: objective.maximize,
      description: objective.description || '',
      divine_patron: objective.divine_patron || 'odin',
      evaluationFunction: objective.evaluationFunction || this.defaultEvaluationFunction,
      constraints: objective.constraints || {},
      history: []
    };
    
    this.objectives.set(id, objectiveConfig);
    console.log(chalk.green(`✅ Added objective: ${objective.name} (${objective.maximize ? 'maximize' : 'minimize'})`));
    
    this.emit('objective:added', objectiveConfig);
  }

  // Remove objective
  removeObjective(id) {
    if (this.objectives.delete(id)) {
      console.log(chalk.yellow(`🗑️  Removed objective: ${id}`));
      this.emit('objective:removed', { id });
      return true;
    }
    return false;
  }

  // Default evaluation function
  async defaultEvaluationFunction(solution, objectiveId) {
    // Simulate objective evaluation based on solution properties
    const baseValue = Math.random() * 100;
    
    // Add some correlation between objectives
    if (objectiveId === 'performance' && solution.optimizations) {
      return baseValue + solution.optimizations.length * 5;
    }
    
    if (objectiveId === 'complexity' && solution.codeLength) {
      return Math.max(0, 100 - (solution.codeLength / 1000) * 20);
    }
    
    return baseValue;
  }

  // Evaluate solution on all objectives
  async evaluateSolution(solution) {
    console.log(chalk.cyan(`🔍 Evaluating solution ${solution.id} on ${this.objectives.size} objectives`));
    
    const objectiveValues = {};
    const evaluationPromises = [];
    
    for (const [objectiveId, objective] of this.objectives) {
      const promise = objective.evaluationFunction(solution, objectiveId)
        .then(value => {
          objectiveValues[objectiveId] = value;
          objective.history.push({
            solutionId: solution.id,
            value,
            timestamp: new Date()
          });
        })
        .catch(error => {
          logger.warn(`Objective evaluation failed: ${objectiveId}`, { error: error.message });
          objectiveValues[objectiveId] = 0;
        });
      
      evaluationPromises.push(promise);
    }
    
    await Promise.all(evaluationPromises);
    
    // Get divine blessing for the evaluation
    const divineBlessing = await this.getDivineBlessing(solution, objectiveValues);
    
    const evaluation = {
      solutionId: solution.id,
      objectives: objectiveValues,
      divineBlessing,
      timestamp: new Date(),
      dominationCount: 0,
      dominatedSolutions: new Set(),
      rank: 0,
      crowdingDistance: 0
    };
    
    solution.evaluation = evaluation;
    this.solutions.set(solution.id, solution);
    
    console.log(chalk.blue(`   📊 Objectives: ${Object.entries(objectiveValues).map(([k, v]) => `${k}:${v.toFixed(1)}`).join(', ')}`));
    
    this.emit('solution:evaluated', evaluation);
    return evaluation;
  }

  // Get divine blessing for solution
  async getDivineBlessing(solution, objectiveValues) {
    try {
      // Find the god with highest objective value
      let bestObjective = null;
      let bestValue = -1;
      
      for (const [objectiveId, value] of Object.entries(objectiveValues)) {
        const objective = this.objectives.get(objectiveId);
        const normalizedValue = objective.maximize ? value : (100 - value);
        
        if (normalizedValue > bestValue) {
          bestValue = normalizedValue;
          bestObjective = objective;
        }
      }
      
      if (bestObjective) {
        const blessing = await ashvatthaTree.invokeGod(
          bestObjective.divine_patron,
          `Bless solution ${solution.id} for ${bestObjective.name} optimization`
        );
        
        return {
          god: bestObjective.divine_patron,
          objective: bestObjective.name,
          blessing: blessing.intervention,
          strength: bestValue / 100
        };
      }
      
      return null;
      
    } catch (error) {
      logger.warn('Divine blessing failed', { error: error.message });
      return null;
    }
  }

  // NSGA-II Fast Non-Dominated Sort
  fastNonDominatedSort(population) {
    console.log(chalk.magenta('🏆 Performing non-dominated sorting'));
    
    const fronts = [[]];
    
    // Initialize domination counts and dominated solutions
    for (const solution of population) {
      solution.evaluation.dominationCount = 0;
      solution.evaluation.dominatedSolutions.clear();
      
      for (const otherSolution of population) {
        if (solution.id === otherSolution.id) continue;
        
        if (this.dominates(solution, otherSolution)) {
          solution.evaluation.dominatedSolutions.add(otherSolution.id);
        } else if (this.dominates(otherSolution, solution)) {
          solution.evaluation.dominationCount++;
        }
      }
      
      if (solution.evaluation.dominationCount === 0) {
        solution.evaluation.rank = 0;
        fronts[0].push(solution);
      }
    }
    
    // Build subsequent fronts
    let frontIndex = 0;
    while (fronts[frontIndex].length > 0) {
      const nextFront = [];
      
      for (const solution of fronts[frontIndex]) {
        for (const dominatedId of solution.evaluation.dominatedSolutions) {
          const dominatedSolution = population.find(s => s.id === dominatedId);
          if (dominatedSolution) {
            dominatedSolution.evaluation.dominationCount--;
            if (dominatedSolution.evaluation.dominationCount === 0) {
              dominatedSolution.evaluation.rank = frontIndex + 1;
              nextFront.push(dominatedSolution);
            }
          }
        }
      }
      
      frontIndex++;
      if (nextFront.length > 0) {
        fronts.push(nextFront);
      } else {
        break;
      }
    }
    
    this.paretoFronts = fronts;
    
    console.log(chalk.green(`   ✅ Found ${fronts.length} Pareto fronts`));
    console.log(chalk.cyan(`   🥇 First front: ${fronts[0].length} solutions`));
    
    return fronts;
  }

  // Check if solution1 dominates solution2
  dominates(solution1, solution2) {
    let atLeastOneObjectiveBetter = false;
    
    for (const [objectiveId, objective] of this.objectives) {
      const value1 = solution1.evaluation.objectives[objectiveId];
      const value2 = solution2.evaluation.objectives[objectiveId];
      
      if (objective.maximize) {
        if (value1 < value2) return false;
        if (value1 > value2) atLeastOneObjectiveBetter = true;
      } else {
        if (value1 > value2) return false;
        if (value1 < value2) atLeastOneObjectiveBetter = true;
      }
    }
    
    return atLeastOneObjectiveBetter;
  }

  // Calculate crowding distance for diversity preservation
  calculateCrowdingDistance(front) {
    const frontSize = front.length;
    
    // Initialize crowding distance
    for (const solution of front) {
      solution.evaluation.crowdingDistance = 0;
    }
    
    if (frontSize <= 2) {
      // Boundary solutions get infinite distance
      for (const solution of front) {
        solution.evaluation.crowdingDistance = Infinity;
      }
      return;
    }
    
    // Calculate distance for each objective
    for (const [objectiveId, objective] of this.objectives) {
      // Sort front by this objective
      front.sort((a, b) => {
        const valueA = a.evaluation.objectives[objectiveId];
        const valueB = b.evaluation.objectives[objectiveId];
        return objective.maximize ? valueB - valueA : valueA - valueB;
      });
      
      // Boundary solutions get infinite distance
      front[0].evaluation.crowdingDistance = Infinity;
      front[frontSize - 1].evaluation.crowdingDistance = Infinity;
      
      // Calculate range for normalization
      const maxValue = front[0].evaluation.objectives[objectiveId];
      const minValue = front[frontSize - 1].evaluation.objectives[objectiveId];
      const range = maxValue - minValue;
      
      if (range === 0) continue;
      
      // Calculate distance for interior solutions
      for (let i = 1; i < frontSize - 1; i++) {
        const distance = Math.abs(
          front[i + 1].evaluation.objectives[objectiveId] - 
          front[i - 1].evaluation.objectives[objectiveId]
        ) / range;
        
        front[i].evaluation.crowdingDistance += distance;
      }
    }
  }

  // NSGA-II Selection
  selection(population, newPopulationSize) {
    console.log(chalk.yellow(`🎯 Selecting ${newPopulationSize} solutions from ${population.length}`));
    
    const newPopulation = [];
    let frontIndex = 0;
    
    while (newPopulation.length + this.paretoFronts[frontIndex].length <= newPopulationSize) {
      this.calculateCrowdingDistance(this.paretoFronts[frontIndex]);
      newPopulation.push(...this.paretoFronts[frontIndex]);
      frontIndex++;
      
      if (frontIndex >= this.paretoFronts.length) break;
    }
    
    // Fill remaining slots with crowding distance selection
    if (newPopulation.length < newPopulationSize && frontIndex < this.paretoFronts.length) {
      const remainingSlots = newPopulationSize - newPopulation.length;
      const lastFront = this.paretoFronts[frontIndex];
      
      this.calculateCrowdingDistance(lastFront);
      
      // Sort by crowding distance (descending)
      lastFront.sort((a, b) => b.evaluation.crowdingDistance - a.evaluation.crowdingDistance);
      
      newPopulation.push(...lastFront.slice(0, remainingSlots));
    }
    
    console.log(chalk.green(`   ✅ Selected ${newPopulation.length} solutions`));
    return newPopulation;
  }

  // Run multi-objective optimization
  async optimize(initialPopulation, generations = 10) {
    console.log(chalk.magenta(`\n🌟 Starting Multi-Objective Optimization`));
    console.log(chalk.cyan(`   Population: ${initialPopulation.length}`));
    console.log(chalk.cyan(`   Generations: ${generations}`));
    console.log(chalk.cyan(`   Objectives: ${this.objectives.size}`));
    
    let population = [...initialPopulation];
    
    // Evaluate initial population
    console.log(chalk.yellow('\n📊 Evaluating initial population'));
    await Promise.all(population.map(solution => this.evaluateSolution(solution)));
    
    for (let gen = 0; gen < generations; gen++) {
      console.log(chalk.cyan(`\n🧬 Generation ${gen + 1}/${generations}`));
      
      // Non-dominated sorting
      this.fastNonDominatedSort(population);
      
      // Generate offspring through crossover and mutation
      const offspring = await this.generateOffspring(population);
      
      // Combine parent and offspring populations
      const combinedPopulation = [...population, ...offspring];
      
      // Evaluate new solutions
      await Promise.all(offspring.map(solution => this.evaluateSolution(solution)));
      
      // Perform non-dominated sorting on combined population
      this.fastNonDominatedSort(combinedPopulation);
      
      // Select next generation
      population = this.selection(combinedPopulation, this.populationSize);
      
      // Update generation counter
      this.generations = gen + 1;
      
      // Report progress
      this.reportGenerationProgress(population);
      
      // Check convergence
      if (this.hasConverged(population)) {
        console.log(chalk.green(`🎯 Convergence achieved at generation ${gen + 1}`));
        break;
      }
      
      this.emit('generation:completed', {
        generation: gen + 1,
        population: population.slice(),
        paretoFronts: this.paretoFronts.slice()
      });
    }
    
    // Final sorting and analysis
    this.fastNonDominatedSort(population);
    const results = this.analyzeResults(population);
    
    console.log(chalk.magenta('\n🏆 Multi-Objective Optimization Complete!'));
    console.log(chalk.green(`   🥇 Pareto Front Size: ${this.paretoFronts[0].length}`));
    console.log(chalk.cyan(`   📊 Total Fronts: ${this.paretoFronts.length}`));
    console.log(chalk.yellow(`   🔬 Hypervolume: ${results.hypervolume.toFixed(3)}`));
    
    this.emit('optimization:complete', results);
    
    return results;
  }

  // Generate offspring through crossover and mutation
  async generateOffspring(population) {
    console.log(chalk.yellow('🧬 Generating offspring'));
    
    const offspring = [];
    const offspringSize = Math.floor(this.populationSize / 2);
    
    for (let i = 0; i < offspringSize; i++) {
      // Tournament selection for parents
      const parent1 = this.tournamentSelection(population);
      const parent2 = this.tournamentSelection(population);
      
      // Crossover
      const children = await this.crossover(parent1, parent2);
      
      // Mutation
      for (const child of children) {
        await this.mutate(child);
        offspring.push(child);
        
        if (offspring.length >= offspringSize) break;
      }
      
      if (offspring.length >= offspringSize) break;
    }
    
    console.log(chalk.green(`   ✅ Generated ${offspring.length} offspring`));
    return offspring;
  }

  // Tournament selection
  tournamentSelection(population, tournamentSize = 3) {
    const tournament = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    
    // Select best based on rank and crowding distance
    tournament.sort((a, b) => {
      if (a.evaluation.rank !== b.evaluation.rank) {
        return a.evaluation.rank - b.evaluation.rank;
      }
      return b.evaluation.crowdingDistance - a.evaluation.crowdingDistance;
    });
    
    return tournament[0];
  }

  // Crossover operation
  async crossover(parent1, parent2) {
    // Simulate crossover by blending parent properties
    const child1 = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'offspring',
      parents: [parent1.id, parent2.id],
      generation: this.generations + 1,
      properties: this.blendProperties(parent1, parent2),
      created: new Date()
    };
    
    const child2 = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'offspring',
      parents: [parent1.id, parent2.id],
      generation: this.generations + 1,
      properties: this.blendProperties(parent2, parent1),
      created: new Date()
    };
    
    return [child1, child2];
  }

  // Blend parent properties
  blendProperties(parent1, parent2) {
    const properties = {};
    
    // Combine properties from both parents
    const allKeys = new Set([
      ...Object.keys(parent1.properties || {}),
      ...Object.keys(parent2.properties || {})
    ]);
    
    for (const key of allKeys) {
      const value1 = parent1.properties?.[key] || 0;
      const value2 = parent2.properties?.[key] || 0;
      
      // Blend with random weight
      const weight = Math.random();
      properties[key] = value1 * weight + value2 * (1 - weight);
    }
    
    return properties;
  }

  // Mutation operation
  async mutate(solution, mutationRate = 0.1) {
    if (Math.random() > mutationRate) return solution;
    
    // Mutate some properties
    for (const [key, value] of Object.entries(solution.properties || {})) {
      if (Math.random() < 0.3) { // 30% chance to mutate each property
        const mutationStrength = 0.1;
        const mutation = (Math.random() - 0.5) * mutationStrength * value;
        solution.properties[key] = Math.max(0, value + mutation);
      }
    }
    
    // Get divine blessing for mutation
    const blessing = await ashvatthaTree.invokeGod('loki', `Bless mutation: ${solution.id}`);
    solution.divineBlessing = blessing;
    
    return solution;
  }

  // Report generation progress
  reportGenerationProgress(population) {
    const paretoFront = this.paretoFronts[0];
    const avgObjectives = {};
    
    for (const objectiveId of this.objectives.keys()) {
      const values = paretoFront.map(sol => sol.evaluation.objectives[objectiveId]);
      avgObjectives[objectiveId] = values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    
    console.log(chalk.blue('   📈 Pareto Front Averages:'));
    for (const [objectiveId, avgValue] of Object.entries(avgObjectives)) {
      console.log(chalk.gray(`      ${objectiveId}: ${avgValue.toFixed(1)}`));
    }
  }

  // Check convergence
  hasConverged(population) {
    if (this.generations < 5) return false;
    
    // Check if Pareto front size has stabilized
    const recentFrontSizes = this.evolutionHistory.slice(-3).map(h => h.paretoFrontSize);
    const isStable = recentFrontSizes.every(size => Math.abs(size - recentFrontSizes[0]) <= 1);
    
    return isStable && this.paretoFronts[0].length > 5;
  }

  // Analyze optimization results
  analyzeResults(population) {
    const paretoFront = this.paretoFronts[0];
    
    const analysis = {
      paretoFront,
      paretoFrontSize: paretoFront.length,
      totalFronts: this.paretoFronts.length,
      generations: this.generations,
      hypervolume: this.calculateHypervolume(paretoFront),
      diversity: this.calculateDiversity(paretoFront),
      objectiveStats: this.calculateObjectiveStats(paretoFront),
      solutions: {
        total: population.length,
        evaluated: this.solutions.size,
        pareto: paretoFront.length
      }
    };
    
    return analysis;
  }

  // Calculate hypervolume indicator
  calculateHypervolume(paretoFront) {
    // Simplified hypervolume calculation
    // In practice, this would use more sophisticated algorithms
    
    if (paretoFront.length === 0) return 0;
    
    let volume = 0;
    const objectiveIds = Array.from(this.objectives.keys());
    
    for (const solution of paretoFront) {
      let solutionVolume = 1;
      
      for (const objectiveId of objectiveIds) {
        const objective = this.objectives.get(objectiveId);
        const value = solution.evaluation.objectives[objectiveId];
        const normalizedValue = objective.maximize ? value / 100 : (100 - value) / 100;
        solutionVolume *= Math.max(0, normalizedValue);
      }
      
      volume += solutionVolume;
    }
    
    return volume / paretoFront.length;
  }

  // Calculate diversity metric
  calculateDiversity(paretoFront) {
    if (paretoFront.length < 2) return 0;
    
    let totalDistance = 0;
    let pairCount = 0;
    
    for (let i = 0; i < paretoFront.length; i++) {
      for (let j = i + 1; j < paretoFront.length; j++) {
        let distance = 0;
        
        for (const objectiveId of this.objectives.keys()) {
          const value1 = paretoFront[i].evaluation.objectives[objectiveId];
          const value2 = paretoFront[j].evaluation.objectives[objectiveId];
          distance += Math.pow(value1 - value2, 2);
        }
        
        totalDistance += Math.sqrt(distance);
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalDistance / pairCount : 0;
  }

  // Calculate objective statistics
  calculateObjectiveStats(paretoFront) {
    const stats = {};
    
    for (const [objectiveId, objective] of this.objectives) {
      const values = paretoFront.map(sol => sol.evaluation.objectives[objectiveId]);
      
      stats[objectiveId] = {
        min: Math.min(...values),
        max: Math.max(...values),
        mean: values.reduce((sum, val) => sum + val, 0) / values.length,
        std: this.calculateStandardDeviation(values),
        objective: objective.name
      };
    }
    
    return stats;
  }

  // Calculate standard deviation
  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }

  // Get optimization statistics
  getOptimizationStats() {
    return {
      objectives: Array.from(this.objectives.values()),
      solutions: this.solutions.size,
      generations: this.generations,
      paretoFronts: this.paretoFronts.length,
      paretoFrontSize: this.paretoFronts[0]?.length || 0,
      populationSize: this.populationSize
    };
  }
}

export default MultiObjectiveOptimizer;