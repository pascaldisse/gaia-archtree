#!/usr/bin/env node

/**
 * reverse_tree_divine_intervention.js - Advanced Divine Intervention System
 * Primary coding tool using dual-tree architecture and GaiaScript integration
 */

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ashvatthaTree } from './GodRealms.js';
import { treeCoordinator } from './TreeCoordinator.js';
import GitEvolutionEngine from '../heartwood/GitEvolutionEngine.js';
import { authManager } from '../auth/AuthManager.js';
import { logger, setupGlobalErrorHandling } from './Logger.js';
import { gaiaTranslator } from './GaiaTranslator.js';

// Initialize systems
const evolutionEngine = new GitEvolutionEngine();
setupGlobalErrorHandling(logger);

class DivineInterventionEngine {
  constructor() {
    this.activeInterventions = new Map();
    this.interventionHistory = [];
    this.godPairings = new Map();
    this.complexity = 'medium'; // low, medium, high, divine
    
    logger.divine('Divine Intervention Engine initialized');
  }

  // Analyze task complexity and assign appropriate gods
  analyzeTask(task) {
    const taskLower = task.toLowerCase();
    let complexity = 'medium';
    let domain = 'general';
    let suggestedGods = { light: 'odin', shadow: 'shiva' };

    // Complexity analysis
    const complexityIndicators = {
      high: ['architecture', 'system', 'complex', 'advanced', 'enterprise', 'scale'],
      divine: ['ai', 'machine learning', 'quantum', 'distributed', 'microservices'],
      low: ['simple', 'basic', 'quick', 'fix', 'small', 'minor']
    };

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => taskLower.includes(indicator))) {
        complexity = level;
        break;
      }
    }

    // Domain analysis and god assignment
    const domainMappings = {
      'debugging': { light: 'thor', shadow: 'bhairava', domain: 'testing' },
      'security': { light: 'heimdall', shadow: 'durga', domain: 'protection' },
      'performance': { light: 'thor', shadow: 'mahakala', domain: 'optimization' },
      'cleanup': { light: 'vidar', shadow: 'kali', domain: 'purification' },
      'refactoring': { light: 'modi', shadow: 'shiva', domain: 'transformation' },
      'architecture': { light: 'odin', shadow: 'avidya', domain: 'wisdom' },
      'documentation': { light: 'bragi', shadow: 'yama', domain: 'knowledge' },
      'testing': { light: 'thor', shadow: 'mara', domain: 'validation' },
      'ui': { light: 'baldr', shadow: 'nirrti', domain: 'beauty' },
      'api': { light: 'hermes', shadow: 'rahu', domain: 'communication' }
    };

    for (const [keyword, mapping] of Object.entries(domainMappings)) {
      if (taskLower.includes(keyword)) {
        suggestedGods = mapping;
        domain = mapping.domain;
        break;
      }
    }

    return { complexity, domain, suggestedGods, analysis: taskLower };
  }

  // Create divine intervention protocol
  async createIntervention(task, userPreferences = {}) {
    const interventionId = `divine_${Date.now()}`;
    const analysis = this.analyzeTask(task);
    
    // Allow user to override god selection
    let { light, shadow } = analysis.suggestedGods;
    
    if (userPreferences.interactive) {
      const godSelection = await this.interactiveGodSelection(analysis);
      light = godSelection.light;
      shadow = godSelection.shadow;
    }

    // Create intervention record
    const intervention = {
      id: interventionId,
      task,
      analysis,
      gods: { light, shadow },
      created: new Date(),
      status: 'initializing',
      steps: [],
      gaiaScript: {
        originalTask: task,
        translatedTask: gaiaTranslator.translateToGaia(task),
        systemPrompt: gaiaTranslator.createGaiaSystemPrompt()
      }
    };

    this.activeInterventions.set(interventionId, intervention);
    
    logger.divine('Divine intervention created', {
      interventionId,
      complexity: analysis.complexity,
      lightGod: light,
      shadowGod: shadow,
      gaiaEnabled: true
    });

    return intervention;
  }

  // Interactive god selection
  async interactiveGodSelection(analysis) {
    console.log(chalk.cyan('\n🔮 Divine God Selection'));
    console.log(chalk.yellow(`Task complexity: ${analysis.complexity}`));
    console.log(chalk.yellow(`Domain: ${analysis.domain}`));
    console.log(chalk.green(`Suggested: ${analysis.suggestedGods.light} (light) + ${analysis.suggestedGods.shadow} (shadow)`));

    const { useAutoSelection } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useAutoSelection',
      message: 'Use auto-selected gods?',
      default: true
    }]);

    if (useAutoSelection) {
      return analysis.suggestedGods;
    }

    // Manual selection
    const lightGods = ['odin', 'thor', 'freyr', 'baldr', 'heimdall', 'tyr', 'vidar', 'bragi'];
    const shadowGods = ['kali', 'shiva', 'durga', 'bhairava', 'yama', 'mahakala', 'rahu', 'mara'];

    const { lightGod } = await inquirer.prompt([{
      type: 'list',
      name: 'lightGod',
      message: 'Select light god:',
      choices: lightGods.map(god => ({ name: `${god} - ${this.getGodDescription(god)}`, value: god }))
    }]);

    const { shadowGod } = await inquirer.prompt([{
      type: 'list', 
      name: 'shadowGod',
      message: 'Select shadow god:',
      choices: shadowGods.map(god => ({ name: `${god} - ${this.getGodDescription(god)}`, value: god }))
    }]);

    return { light: lightGod, shadow: shadowGod };
  }

  // Get god description
  getGodDescription(godName) {
    const descriptions = {
      // Light gods
      odin: 'Wisdom & Architecture',
      thor: 'Testing & Debugging', 
      freyr: 'Growth & Optimization',
      baldr: 'Beauty & UX',
      heimdall: 'Security & Monitoring',
      tyr: 'Justice & Fair Algorithms',
      vidar: 'Clean Code & Silence',
      bragi: 'Documentation',
      // Shadow gods
      kali: 'Destruction & Cleanup',
      shiva: 'Transformation & Breaking Changes',
      durga: 'Protection & Defense',
      bhairava: 'Terror & Critical Bugs',
      yama: 'Process Termination',
      mahakala: 'Deep Time Cycles',
      rahu: 'Hidden Dependencies',
      mara: 'Bad Practices'
    };
    return descriptions[godName] || 'Divine Power';
  }

  // Execute divine intervention
  async executeIntervention(interventionId, codeContext = null) {
    const intervention = this.activeInterventions.get(interventionId);
    if (!intervention) {
      throw new Error(`Intervention ${interventionId} not found`);
    }

    intervention.status = 'executing';
    
    console.log(chalk.magenta('\n🌟 Executing Divine Intervention'));
    console.log(chalk.cyan(`ID: ${interventionId}`));
    console.log(chalk.yellow(`Task: ${intervention.task}`));
    console.log(chalk.green(`Gods: ${intervention.gods.light} ☀️  + ${intervention.gods.shadow} 🌙`));

    // Step 1: Light god intervention (creation/inspiration)
    await this.lightGodIntervention(intervention, codeContext);
    
    // Step 2: Shadow god intervention (optimization/destruction)
    await this.shadowGodIntervention(intervention, codeContext);
    
    // Step 3: Tree balance and synthesis
    await this.synthesizeIntervention(intervention);
    
    // Step 4: Evolution if requested
    if (intervention.analysis.complexity === 'divine' || intervention.analysis.complexity === 'high') {
      await this.evolveWithGit(intervention);
    }

    intervention.status = 'completed';
    intervention.completed = new Date();
    
    this.interventionHistory.push(intervention);
    this.activeInterventions.delete(interventionId);
    
    logger.divine('Divine intervention completed', {
      interventionId,
      duration: intervention.completed - intervention.created,
      steps: intervention.steps.length
    });

    return intervention;
  }

  // Light god intervention (creation phase)
  async lightGodIntervention(intervention, codeContext) {
    const step = {
      phase: 'light',
      god: intervention.gods.light,
      started: new Date(),
      type: 'creation'
    };

    console.log(chalk.yellow(`\n☀️  Light Phase: ${intervention.gods.light} Creating...`));
    
    // Invoke light god through ashvattha tree
    const lightResult = await ashvatthaTree.invokeGod(intervention.gods.light, intervention.task, {
      phase: 'light',
      codeContext,
      gaiaScript: intervention.gaiaScript.translatedTask
    });

    // Simulate light god work (in real implementation, this would call AI)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    step.completed = new Date();
    step.result = lightResult;
    step.output = `${intervention.gods.light} has illuminated the path for: ${intervention.task}`;
    
    intervention.steps.push(step);
    
    // Update tree balance
    treeCoordinator.balanceForces(30, 0); // Light energy added
  }

  // Shadow god intervention (optimization/destruction phase)
  async shadowGodIntervention(intervention, codeContext) {
    const step = {
      phase: 'shadow',
      god: intervention.gods.shadow,
      started: new Date(),
      type: 'optimization'
    };

    console.log(chalk.magenta(`\n🌙 Shadow Phase: ${intervention.gods.shadow} Optimizing...`));
    
    // Get light phase result for shadow god to work with
    const lightStep = intervention.steps.find(s => s.phase === 'light');
    
    // Invoke shadow god
    const shadowResult = await ashvatthaTree.invokeGod(intervention.gods.shadow, intervention.task, {
      phase: 'shadow',
      lightResult: lightStep?.result,
      codeContext,
      gaiaScript: intervention.gaiaScript.translatedTask
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    
    step.completed = new Date();
    step.result = shadowResult;
    step.output = `${intervention.gods.shadow} has optimized and refined the solution`;
    
    intervention.steps.push(step);
    
    // Update tree balance
    treeCoordinator.balanceForces(0, 25); // Shadow energy added
  }

  // Synthesize light and shadow results
  async synthesizeIntervention(intervention) {
    const step = {
      phase: 'synthesis',
      god: 'tree_coordinator',
      started: new Date(),
      type: 'synthesis'
    };

    console.log(chalk.cyan('\n⚖️  Synthesis Phase: Balancing Forces...'));
    
    // Get dual god results
    const lightStep = intervention.steps.find(s => s.phase === 'light');
    const shadowStep = intervention.steps.find(s => s.phase === 'shadow');
    
    // Invoke dual gods through tree coordinator
    const synthesis = await treeCoordinator.invokeDualGods(
      intervention.gods.light,
      intervention.gods.shadow,
      `Synthesize solution for: ${intervention.task}`
    );

    step.completed = new Date();
    step.result = synthesis;
    step.output = `Divine synthesis achieved: Light creation balanced with shadow optimization`;
    
    intervention.steps.push(step);
    intervention.finalResult = {
      synthesis,
      lightPhase: lightStep?.result,
      shadowPhase: shadowStep?.result,
      balance: treeCoordinator.getTreeHealth().trunk.balance
    };
  }

  // Evolve solution using git evolution engine
  async evolveWithGit(intervention) {
    if (intervention.analysis.complexity === 'divine' || intervention.analysis.complexity === 'high') {
      console.log(chalk.green('\n🧬 Evolution Phase: Git Evolution...'));
      
      try {
        const mutationId = `intervention_${intervention.id}`;
        const mutation = await evolutionEngine.createMutationBranch(mutationId, intervention.gods.shadow);
        
        // Simulate evolution
        await evolutionEngine.evolveMutation(
          mutationId,
          {},
          `Divine intervention evolution: ${intervention.task}`
        );
        
        intervention.evolution = {
          mutationId,
          branch: mutation.branchName,
          fitness: mutation.fitness
        };
        
      } catch (error) {
        logger.warn('Evolution phase failed', { error: error.message });
      }
    }
  }

  // Get intervention status
  getInterventionStatus(interventionId) {
    return this.activeInterventions.get(interventionId) || 
           this.interventionHistory.find(i => i.id === interventionId);
  }

  // List all interventions
  listInterventions() {
    return {
      active: Array.from(this.activeInterventions.values()),
      history: this.interventionHistory.slice(-10), // Last 10
      total: this.interventionHistory.length
    };
  }
}

// Initialize divine intervention engine
const divineEngine = new DivineInterventionEngine();

// CLI Commands
program
  .name('reverse-tree-divine-intervention')
  .description('Advanced Divine Intervention System for Code Generation')
  .version('1.0.0');

program
  .command('intervene <task>')
  .description('Create and execute divine intervention')
  .option('-i, --interactive', 'interactive god selection')
  .option('-c, --complexity <level>', 'task complexity (low, medium, high, divine)', 'medium')
  .option('--no-evolution', 'disable git evolution')
  .action(async (task, options) => {
    try {
      console.log(chalk.cyan('🔮 Initiating Reverse Tree Divine Intervention'));
      
      // Check authentication
      const auth = authManager.getCurrentProvider();
      if (!auth.authenticated) {
        console.log(chalk.yellow('⚠️  No authentication found. Consider logging in for AI integration.'));
      }

      // Create intervention
      const intervention = await divineEngine.createIntervention(task, {
        interactive: options.interactive,
        complexity: options.complexity
      });

      // Execute intervention
      await divineEngine.executeIntervention(intervention.id);

      // Display results
      console.log(chalk.green('\n✨ Divine Intervention Complete!'));
      console.log(chalk.cyan(`Final Balance: ${intervention.finalResult.balance}`));
      
      if (intervention.evolution) {
        console.log(chalk.green(`🧬 Evolution Branch: ${intervention.evolution.branch}`));
      }

      // GaiaScript integration info
      if (auth.provider === 'deepseek' || auth.provider === 'anthropic') {
        console.log(chalk.magenta('\n🔮 GaiaScript Integration Available:'));
        console.log(chalk.gray(`System Prompt: Use gaiaTranslator.createGaiaSystemPrompt()`));
        console.log(chalk.gray(`Translated Task: ${intervention.gaiaScript.translatedTask}`));
      }
      
    } catch (error) {
      logger.error('Divine intervention failed', { error: error.message });
      console.error(chalk.red(`❌ Intervention failed: ${error.message}`));
    }
  });

program
  .command('status [intervention-id]')
  .description('Show intervention status')
  .action((interventionId) => {
    if (interventionId) {
      const intervention = divineEngine.getInterventionStatus(interventionId);
      if (intervention) {
        console.log(chalk.cyan('\n📊 Intervention Status:'));
        console.log(JSON.stringify(intervention, null, 2));
      } else {
        console.log(chalk.red(`Intervention ${interventionId} not found`));
      }
    } else {
      const all = divineEngine.listInterventions();
      console.log(chalk.cyan('\n📊 All Interventions:'));
      console.log(chalk.yellow(`Active: ${all.active.length}`));
      console.log(chalk.green(`Completed: ${all.history.length}`));
      console.log(chalk.cyan(`Total: ${all.total}`));
    }
  });

program
  .command('demo')
  .description('Run GaiaScript translation demo')
  .action(() => {
    gaiaTranslator.demo();
  });

// Interactive mode if no arguments
if (process.argv.length === 2) {
  console.log(chalk.cyan('🔮 Reverse Tree Divine Intervention - Interactive Mode'));
  console.log(chalk.gray('Usage: node reverse_tree_divine_intervention.js intervene "your task"'));
  console.log(chalk.gray('       node reverse_tree_divine_intervention.js status'));
  console.log(chalk.gray('       node reverse_tree_divine_intervention.js demo'));
} else {
  program.parse();
}