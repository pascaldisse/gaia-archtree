#!/usr/bin/env node

/**
 * gaia.js - Main CLI Entry Point
 * Divine AI-powered code assistant with evolutionary algorithms
 */

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ashvatthaTree } from './|_trunk/core/GodRealms.js';
import { treeCoordinator } from './|_trunk/core/TreeCoordinator.js';
import GitEvolutionEngine from './|_trunk/heartwood/GitEvolutionEngine.js';
import { authManager } from './|_trunk/auth/AuthManager.js';
import { logger, setupGlobalErrorHandling } from './|_trunk/core/Logger.js';
import { zodiacPolarity } from './|_trunk/core/ZodiacPolarity.js';

// Initialize core systems
const evolutionEngine = new GitEvolutionEngine();

// Setup global error handling
setupGlobalErrorHandling(logger);

// Log system startup
logger.info('Gaia Archtree system initializing', {
  version: '1.0.0',
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch
});

// ASCII Art Header
const displayHeader = () => {
  console.log(chalk.cyan(`
    ╔══════════════════════════════════════════════╗
    ║               🌳 GAIA ARCHTREE 🌳             ║
    ║        Divine AI Code Assistant System       ║
    ║                                              ║
    ║  ☀️  16 Light Gods (Crown Branches)          ║
    ║  🌙 16 Shadow Gods (Ashvattha Roots)         ║
    ║  🧬 Git Evolution Engine (M1 Optimized)     ║
    ╚══════════════════════════════════════════════╝
  `));
};

// Divine Intervention Command
const divineIntervention = async (task) => {
  console.log(chalk.magenta('🔮 Initiating Divine Intervention...'));
  
  // Get current zodiac information
  const zodiacStatus = zodiacPolarity.getCurrentStatus();
  const preferredGods = zodiacPolarity.getPreferredGods();
  
  console.log(chalk.cyan(`🌟 Current Zodiac: ${zodiacStatus.zodiac.symbol} ${zodiacStatus.zodiac.name} (${zodiacStatus.polarity})`));
  console.log(chalk.gray(`   Dominant Tree: ${zodiacStatus.dominantTree === 'light' ? '☀️ Light' : '🌙 Shadow'} Realm`));
  
  const choices = [
    { name: '⚡ Thor - Testing & Debugging', value: 'thor' },
    { name: '🦉 Odin - Wisdom & Architecture', value: 'odin' },
    { name: '🌊 Freyr - Growth & Optimization', value: 'freyr' },
    { name: '🔥 Kali - Destruction & Cleanup', value: 'kali' },
    { name: '🕉️  Shiva - Transformation', value: 'shiva' },
    { name: '🛡️  Durga - Protection & Security', value: 'durga' },
    { name: '🎯 Auto-select based on task', value: 'auto' },
    { name: '🌟 Zodiac-guided selection', value: 'zodiac' }
  ];

  const { godChoice } = await inquirer.prompt([{
    type: 'list',
    name: 'godChoice',
    message: 'Select divine guidance:',
    choices
  }]);

  let selectedGod = godChoice;
  
  if (godChoice === 'zodiac') {
    // Select based on current zodiac's preferred gods
    const dominantGods = preferredGods.dominant;
    if (dominantGods.length > 0) {
      selectedGod = dominantGods[Math.floor(Math.random() * dominantGods.length)];
      console.log(chalk.yellow(`🌟 Zodiac-selected: ${selectedGod} (${zodiacStatus.dominantTree} realm)`));
    } else {
      selectedGod = 'vishnu'; // Fallback
      console.log(chalk.yellow(`🌟 Zodiac fallback: ${selectedGod}`));
    }
  } else if (godChoice === 'auto') {
    // Auto-select god based on task keywords and zodiac influence
    const taskLower = task.toLowerCase();
    if (taskLower.includes('test') || taskLower.includes('debug')) {
      selectedGod = 'thor';
    } else if (taskLower.includes('security') || taskLower.includes('auth')) {
      selectedGod = 'durga';
    } else if (taskLower.includes('clean') || taskLower.includes('delete')) {
      selectedGod = 'kali';
    } else if (taskLower.includes('refactor') || taskLower.includes('change')) {
      selectedGod = 'shiva';
    } else {
      // Use zodiac-preferred god as default
      const dominantGods = preferredGods.dominant;
      if (dominantGods.length > 0) {
        selectedGod = dominantGods[0];
      } else {
        selectedGod = 'vishnu'; // Final fallback
      }
    }
    console.log(chalk.yellow(`🎯 Auto-selected: ${selectedGod}`));
  }

  try {
    const result = await ashvatthaTree.invokeGod(selectedGod, task);
    console.log(chalk.green('✨ Divine intervention completed!'));
    console.log(chalk.cyan(`Result: ${result.intervention}`));
    return result;
  } catch (error) {
    console.error(chalk.red(`❌ Divine intervention failed: ${error.message}`));
    throw error;
  }
};

// Evolution Command
const runEvolution = async (iterations = 3) => {
  console.log(chalk.cyan(`🧬 Starting Git Evolution (${iterations} iterations)`));
  
  for (let i = 0; i < iterations; i++) {
    try {
      const mutationId = `evolution_${Date.now()}_${i}`;
      const gods = ['Brahma', 'Vishnu', 'Agni', 'Vayu'];
      const randomGod = gods[Math.floor(Math.random() * gods.length)];
      
      console.log(chalk.yellow(`\n--- Iteration ${i + 1}/${iterations} ---`));
      
      // Create mutation
      const mutation = await evolutionEngine.createMutationBranch(mutationId, randomGod);
      
      // Simulate evolution
      await evolutionEngine.evolveMutation(
        mutationId, 
        {}, 
        `Evolution iteration ${i + 1}: ${randomGod} guidance`
      );
      
      // Try to merge if fitness is high enough
      await evolutionEngine.mergeMutation(mutationId);
      
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Evolution iteration ${i + 1} failed: ${error.message}`));
    }
  }
  
  // Show evolution stats
  const stats = evolutionEngine.getEvolutionStats();
  console.log(chalk.green('\n📊 Evolution Complete!'));
  console.log(chalk.cyan(`   Active Mutations: ${stats.activeMutations}`));
  console.log(chalk.cyan(`   Merged Mutations: ${stats.mergedMutations}`));
  console.log(chalk.cyan(`   Average Fitness: ${stats.averageFitness.toFixed(2)}`));
  console.log(chalk.cyan(`   M1 Optimized: ${stats.isM1Optimized ? '✅' : '❌'}`));
};

// Zodiac System Menu
const handleZodiacMenu = async () => {
  const zodiacStatus = zodiacPolarity.getCurrentStatus();
  
  console.log(chalk.cyan('\n🌟 Zodiac System Status'));
  console.log(chalk.yellow(`   Current: ${zodiacStatus.zodiac.symbol} ${zodiacStatus.zodiac.name} (${zodiacStatus.polarity})`));
  console.log(chalk.gray(`   Tree Control: ${zodiacStatus.dominantTree === 'light' ? '☀️ Light' : '🌙 Shadow'} Realm`));
  
  if (zodiacStatus.manualOverride) {
    console.log(chalk.red('   🎯 Manual Override Active'));
  }
  
  const { zodiacAction } = await inquirer.prompt([{
    type: 'list',
    name: 'zodiacAction',
    message: 'Zodiac system options:',
    choices: [
      { name: '🌟 Show detailed zodiac information', value: 'show' },
      { name: '🌍 Show seasonal transitions', value: 'seasonal' },
      { name: '🎯 Set zodiac manually (testing)', value: 'manual' },
      { name: '🔄 Clear manual override', value: 'clear' },
      { name: '⬅️  Back to main menu', value: 'back' }
    ]
  }]);
  
  try {
    switch (zodiacAction) {
      case 'show':
        zodiacPolarity.displayZodiacInfo();
        break;
      case 'seasonal':
        const seasonalInfo = zodiacPolarity.getSeasonalInfo();
        console.log(chalk.cyan('\n🌍 Seasonal Information:'));
        console.log(`   Current Season: ${seasonalInfo.currentSeason}`);
        console.log(`   Zodiac Sign: ${seasonalInfo.zodiacSign}`);
        console.log(`   Polarity: ${seasonalInfo.polarity}`);
        console.log(`   Tree Control: ${seasonalInfo.treeControl}`);
        if (seasonalInfo.transition.isTransition) {
          console.log(chalk.red(`   🔄 SEASONAL TRANSITION: ${seasonalInfo.transition.transitionName}`));
        }
        console.log(`   Next Transition: ${seasonalInfo.nextTransition.name} in ${seasonalInfo.nextTransition.daysUntil} days`);
        break;
      case 'manual':
        const { zodiacName } = await inquirer.prompt([{
          type: 'list',
          name: 'zodiacName',
          message: 'Select zodiac sign:',
          choices: [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
          ]
        }]);
        const newZodiac = zodiacPolarity.setZodiacManually(zodiacName);
        console.log(chalk.green(`✅ Zodiac set to: ${newZodiac.symbol} ${newZodiac.name} (${newZodiac.polarity})`));
        console.log(chalk.yellow(`   Tree Control: ${newZodiac.treeControl} realm`));
        break;
      case 'clear':
        zodiacPolarity.clearManualOverride();
        const currentStatus = zodiacPolarity.getCurrentStatus();
        console.log(chalk.green(`✅ Returned to automatic: ${currentStatus.zodiac.symbol} ${currentStatus.zodiac.name}`));
        break;
      case 'back':
        return;
    }
  } catch (error) {
    console.error(chalk.red(`❌ Zodiac error: ${error.message}`));
  }
};

// Authentication Menu
const handleAuthMenu = async () => {
  const currentAuth = authManager.getCurrentProvider();
  
  console.log(chalk.cyan('\n🔐 Authentication Status'));
  if (currentAuth.provider) {
    console.log(chalk.green(`   Current: ${authManager.getProviderIcon(currentAuth.provider)} ${currentAuth.provider}`));
    console.log(chalk.cyan(`   Status: ${currentAuth.authenticated ? '✅ Authenticated' : '❌ Not authenticated'}`));
  } else {
    console.log(chalk.yellow('   No provider configured'));
  }
  
  const { authAction } = await inquirer.prompt([{
    type: 'list',
    name: 'authAction',
    message: 'Authentication options:',
    choices: [
      { name: '🔑 Login to provider', value: 'login' },
      { name: '🔄 Switch provider', value: 'switch' },
      { name: '✅ Validate current auth', value: 'validate' },
      { name: '🚪 Logout', value: 'logout' },
      { name: '📋 Show current status', value: 'status' },
      { name: '⬅️  Back to main menu', value: 'back' }
    ]
  }]);
  
  try {
    switch (authAction) {
      case 'login':
        await authManager.login();
        break;
      case 'switch':
        await authManager.switchProvider();
        break;
      case 'validate':
        const validation = await authManager.validateAuth();
        if (validation.valid) {
          console.log(chalk.green(`✅ ${validation.message}`));
        } else {
          console.log(chalk.red(`❌ ${validation.error}`));
        }
        break;
      case 'logout':
        await authManager.logout();
        break;
      case 'status':
        const status = authManager.getCurrentProvider();
        console.log(chalk.cyan('\n📋 Detailed Status:'));
        console.log(JSON.stringify(status, null, 2));
        break;
      case 'back':
        return;
    }
  } catch (error) {
    console.error(chalk.red(`❌ Auth error: ${error.message}`));
  }
};

// Status Command
const showStatus = () => {
  console.log(chalk.cyan('\n🌳 Gaia Archtree Status'));
  
  const treeHealth = treeCoordinator.getTreeHealth();
  const ashvatthaStatus = ashvatthaTree.getTreeStatus();
  const evolutionStats = evolutionEngine.getEvolutionStats();
  
  console.log(chalk.yellow('\n--- Tree Health ---'));
  console.log(`Crown (Light): ${treeHealth.yggdrasil.branches} branches - ${treeHealth.yggdrasil.health}`);
  console.log(`Ashvattha (Shadow): ${treeHealth.ashvattha.roots} roots - ${treeHealth.ashvattha.health}`);
  console.log(`Balance: ${treeHealth.trunk.balance} (${treeHealth.trunk.balanced ? 'balanced' : 'imbalanced'})`);
  
  console.log(chalk.yellow('\n--- Divine Status ---'));
  console.log(`Active Light Gods: ${ashvatthaStatus.lightGods.active}/${ashvatthaStatus.lightGods.total}`);
  console.log(`Active Shadow Gods: ${ashvatthaStatus.shadowGods.active}/${ashvatthaStatus.shadowGods.total}`);
  console.log(`Tree Leafs: ${ashvatthaStatus.leafs}`);
  
  console.log(chalk.yellow('\n--- Evolution Status ---'));
  console.log(`Active Mutations: ${evolutionStats.activeMutations}`);
  console.log(`Total Mutations: ${evolutionStats.totalMutations}`);
  console.log(`M1 Optimized: ${evolutionStats.isM1Optimized ? '✅' : '❌'}`);
};

// Interactive Mode
const interactiveMode = async () => {
  displayHeader();
  console.log(chalk.green('🌟 Welcome to Gaia Archtree Interactive Mode'));
  console.log(chalk.gray('Type "exit" to quit\n'));
  
  while (true) {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🔮 Divine Intervention', value: 'divine' },
        { name: '🧬 Run Evolution', value: 'evolution' },
        { name: '📊 Show Status', value: 'status' },
        { name: '🌟 Zodiac System', value: 'zodiac' },
        { name: '🌳 Tree Balance', value: 'balance' },
        { name: '🔐 Authentication', value: 'auth' },
        { name: '⚙️  Settings', value: 'settings' },
        { name: '🚪 Exit', value: 'exit' }
      ]
    }]);
    
    try {
      switch (action) {
        case 'divine':
          const { task } = await inquirer.prompt([{
            type: 'input',
            name: 'task',
            message: 'Describe your coding task:'
          }]);
          if (task.trim()) {
            await divineIntervention(task);
          }
          break;
          
        case 'evolution':
          const { iterations } = await inquirer.prompt([{
            type: 'number',
            name: 'iterations',
            message: 'Number of evolution iterations:',
            default: 3
          }]);
          await runEvolution(iterations);
          break;
          
        case 'status':
          showStatus();
          break;
          
        case 'zodiac':
          await handleZodiacMenu();
          break;
          
        case 'balance':
          const pairing = treeCoordinator.getOptimalPairing('optimization');
          await treeCoordinator.invokeDualGods(pairing.light, pairing.shadow, 'System balance check');
          break;
          
        case 'auth':
          await handleAuthMenu();
          break;
          
        case 'settings':
          console.log(chalk.yellow('⚙️  Settings panel - Coming soon in Month 2'));
          break;
          
        case 'exit':
          console.log(chalk.cyan('🙏 May the divine code be with you!'));
          process.exit(0);
          break;
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
    
    console.log(); // Add spacing
  }
};

// Setup CLI Commands
program
  .name('gaia')
  .description('Divine AI-powered code assistant with evolutionary algorithms')
  .version('1.0.0');

program
  .command('divine <task>')
  .description('Invoke divine intervention for a coding task')
  .option('-g, --god <god>', 'specify which god to invoke')
  .action(async (task, options) => {
    displayHeader();
    if (options.god) {
      try {
        const result = await ashvatthaTree.invokeGod(options.god, task);
        console.log(chalk.green(`✨ ${result.intervention}`));
      } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
      }
    } else {
      await divineIntervention(task);
    }
  });

program
  .command('evolve')
  .description('Run git evolution engine')
  .option('-i, --iterations <number>', 'number of evolution iterations', '3')
  .action(async (options) => {
    displayHeader();
    await runEvolution(parseInt(options.iterations));
  });

program
  .command('status')
  .description('Show system status')
  .action(() => {
    displayHeader();
    showStatus();
  });

program
  .command('login')
  .description('Login to authentication provider')
  .option('-p, --provider <provider>', 'specify provider (deepinfra, anthropic, openai, local, divine)')
  .action(async (options) => {
    displayHeader();
    try {
      await authManager.login(options.provider);
    } catch (error) {
      console.error(chalk.red(`❌ Login failed: ${error.message}`));
    }
  });

program
  .command('provider')
  .description('Provider management commands')
  .action(async () => {
    const { subcommand } = await inquirer.prompt([{
      type: 'list',
      name: 'subcommand',
      message: 'Provider command:',
      choices: [
        { name: 'current - Show current provider', value: 'current' },
        { name: 'switch - Switch provider', value: 'switch' },
        { name: 'list - List all configured providers', value: 'list' }
      ]
    }]);
    
    try {
      switch (subcommand) {
        case 'current':
          const current = authManager.getCurrentProvider();
          console.log(chalk.cyan(`Current provider: ${current.provider || 'none'}`));
          break;
        case 'switch':
          await authManager.switchProvider();
          break;
        case 'list':
          const providers = Array.from(authManager.credentials.keys());
          console.log(chalk.cyan('Configured providers:'));
          providers.forEach(p => {
            const icon = authManager.getProviderIcon(p);
            const current = p === authManager.currentProvider ? ' (current)' : '';
            console.log(`  ${icon} ${p}${current}`);
          });
          break;
      }
    } catch (error) {
      console.error(chalk.red(`❌ Provider command failed: ${error.message}`));
    }
  });

program
  .command('zodiac')
  .description('Zodiac polarity system commands')
  .option('-s, --seasonal', 'show seasonal information')
  .option('-m, --manual <zodiac>', 'set zodiac manually')
  .option('-c, --clear', 'clear manual override')
  .action(async (options) => {
    displayHeader();
    
    try {
      if (options.seasonal) {
        const seasonalInfo = zodiacPolarity.getSeasonalInfo();
        console.log(chalk.cyan('\n🌍 Seasonal Information:'));
        console.log(`   Current Season: ${seasonalInfo.currentSeason}`);
        console.log(`   Zodiac Sign: ${seasonalInfo.zodiacSign}`);
        console.log(`   Polarity: ${seasonalInfo.polarity}`);
        console.log(`   Tree Control: ${seasonalInfo.treeControl}`);
        if (seasonalInfo.transition.isTransition) {
          console.log(chalk.red(`   🔄 SEASONAL TRANSITION: ${seasonalInfo.transition.transitionName}`));
        }
        console.log(`   Next Transition: ${seasonalInfo.nextTransition.name} in ${seasonalInfo.nextTransition.daysUntil} days`);
      } else if (options.manual) {
        const newZodiac = zodiacPolarity.setZodiacManually(options.manual);
        console.log(chalk.green(`✅ Zodiac set to: ${newZodiac.symbol} ${newZodiac.name} (${newZodiac.polarity})`));
        console.log(chalk.yellow(`   Tree Control: ${newZodiac.treeControl} realm`));
      } else if (options.clear) {
        zodiacPolarity.clearManualOverride();
        const currentStatus = zodiacPolarity.getCurrentStatus();
        console.log(chalk.green(`✅ Returned to automatic: ${currentStatus.zodiac.symbol} ${currentStatus.zodiac.name}`));
      } else {
        zodiacPolarity.displayZodiacInfo();
      }
    } catch (error) {
      console.error(chalk.red(`❌ Zodiac error: ${error.message}`));
    }
  });

program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(interactiveMode);

// Default action (interactive mode)
if (process.argv.length === 2) {
  interactiveMode();
} else {
  program.parse();
}