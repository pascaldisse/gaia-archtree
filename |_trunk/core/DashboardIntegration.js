/**
 * DashboardIntegration.js - Integration Layer for Real-Time Dashboard
 * Connects all evolution systems to the monitoring dashboard
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import { logger } from './Logger.js';
import MonitoringDashboard from './MonitoringDashboard.js';
import MetricsCollector from './MetricsCollector.js';

export class DashboardIntegration extends EventEmitter {
  constructor(options = {}) {
    super();
    this.dashboard = null;
    this.metricsCollector = null;
    this.isRunning = false;
    
    // Integration configuration
    this.config = {
      dashboardPort: options.dashboardPort || 3000,
      wsPort: options.wsPort || 3001,
      updateInterval: options.updateInterval || 1000,
      autoStart: options.autoStart !== false,
      ...options
    };
    
    // Component references
    this.components = {
      neuralEngine: null,
      evolutionEngine: null,
      multiObjectiveOptimizer: null,
      fitnessEvaluator: null,
      treeCoordinator: null,
      ashvatthaTree: null
    };
    
    // Event subscription tracking
    this.subscriptions = new Map();
    
    logger.info('DashboardIntegration initialized for real-time monitoring');
  }

  // Initialize dashboard with component connections
  async initialize(components = {}) {
    console.log(chalk.cyan('🚀 Initializing Dashboard Integration'));
    
    try {
      // Store component references
      this.components = { ...this.components, ...components };
      
      // Create metrics collector
      this.metricsCollector = new MetricsCollector();
      
      // Create dashboard
      this.dashboard = new MonitoringDashboard({
        port: this.config.dashboardPort,
        wsPort: this.config.wsPort
      });
      
      // Setup component integrations
      this.setupEvolutionIntegration();
      this.setupNeuralIntegration();
      this.setupDivineIntegration();
      this.setupTreeIntegration();
      this.setupFitnessIntegration();
      
      // Connect metrics collector to dashboard
      this.connectMetricsCollector();
      
      // Connect dashboard event handlers
      this.setupDashboardHandlers();
      
      // Start dashboard server
      if (this.config.autoStart) {
        await this.start();
      }
      
      console.log(chalk.green('✅ Dashboard Integration initialized successfully'));
      this.emit('integration:initialized');
      
    } catch (error) {
      logger.error('Dashboard integration initialization failed', { error: error.message });
      throw error;
    }
  }

  // Setup evolution engine integration
  setupEvolutionIntegration() {
    const { evolutionEngine, multiObjectiveOptimizer } = this.components;
    
    if (evolutionEngine) {
      // Listen for evolution events
      evolutionEngine.on('generation:evolved', (data) => {
        this.dashboard.emit('evolution:generation', {
          generation: data.generation,
          bestFitness: data.best?.fitness || 0,
          averageFitness: data.population.reduce((sum, ind) => sum + (ind.fitness || 0), 0) / data.population.length,
          diversity: data.diversity || 0,
          paretoFronts: data.paretoFronts || [],
          timestamp: new Date()
        });
      });
      
      evolutionEngine.on('population:evaluated', (population) => {
        this.dashboard.emit('evolution:population-evaluated', {
          population: population.map(ind => ({
            id: ind.id,
            fitness: ind.fitness,
            evaluation: ind.evaluation
          }))
        });
      });
      
      this.subscriptions.set('evolution', evolutionEngine);
    }
    
    if (multiObjectiveOptimizer) {
      multiObjectiveOptimizer.on('optimization:complete', (results) => {
        this.dashboard.emit('evolution:generation', {
          generation: results.generations || 0,
          bestFitness: results.paretoFront?.[0]?.fitness || 0,
          averageFitness: results.paretoFront?.reduce((sum, sol) => sum + sol.fitness, 0) / results.paretoFront?.length || 0,
          diversity: results.diversity || 0,
          paretoFronts: [{ solutions: results.paretoFront || [] }],
          timestamp: new Date()
        });
      });
      
      this.subscriptions.set('multiObjective', multiObjectiveOptimizer);
    }
  }

  // Setup neural evolution integration
  setupNeuralIntegration() {
    const { neuralEngine } = this.components;
    
    if (neuralEngine) {
      neuralEngine.on('network:evaluated', (network) => {
        this.dashboard.emit('neural:network-evaluated', {
          id: network.id,
          fitness: network.fitness,
          generation: network.generation,
          hiddenLayers: network.hiddenLayers,
          learningRate: network.learningRate,
          metrics: network.metrics,
          timestamp: new Date()
        });
      });
      
      neuralEngine.on('evolution:complete', (results) => {
        this.dashboard.emit('neural:evolution-complete', {
          bestNetwork: results.bestNetwork,
          population: results.population,
          generations: results.evolutionHistory,
          timestamp: new Date()
        });
      });
      
      neuralEngine.on('generation:evolved', (data) => {
        this.dashboard.emit('neural:generation', {
          generation: data.generation,
          bestNetwork: data.best,
          population: data.population,
          diversity: data.diversity || 0,
          timestamp: new Date()
        });
      });
      
      this.subscriptions.set('neural', neuralEngine);
    }
  }

  // Setup divine intervention integration
  setupDivineIntegration() {
    const { ashvatthaTree } = this.components;
    
    if (ashvatthaTree) {
      ashvatthaTree.on('god:invoked', (data) => {
        this.dashboard.emit('divine:intervention', {
          god: data.god,
          task: data.task,
          intervention: data.intervention,
          energy: data.energy || 100,
          success: data.success !== false,
          timestamp: new Date()
        });
      });
      
      ashvatthaTree.on('blessing:granted', (data) => {
        this.dashboard.emit('divine:blessing', {
          god: data.god,
          target: data.target,
          blessing: data.blessing,
          strength: data.strength || 1.0,
          timestamp: new Date()
        });
      });
      
      ashvatthaTree.on('balance:changed', (data) => {
        this.dashboard.emit('divine:balance-change', {
          previousBalance: data.previous,
          newBalance: data.new,
          change: data.change,
          timestamp: new Date()
        });
      });
      
      this.subscriptions.set('divine', ashvatthaTree);
    }
  }

  // Setup tree coordinator integration
  setupTreeIntegration() {
    const { treeCoordinator } = this.components;
    
    if (treeCoordinator) {
      // Monitor tree health changes
      setInterval(() => {
        const treeHealth = treeCoordinator.getTreeHealth();
        this.dashboard.emit('tree:health-update', {
          ...treeHealth,
          timestamp: new Date()
        });
      }, 5000); // Every 5 seconds
      
      treeCoordinator.on('balance:updated', (data) => {
        this.dashboard.emit('tree:balance-updated', {
          balance: data.balance,
          stability: data.stability,
          timestamp: new Date()
        });
      });
      
      this.subscriptions.set('tree', treeCoordinator);
    }
  }

  // Setup fitness evaluator integration
  setupFitnessIntegration() {
    const { fitnessEvaluator } = this.components;
    
    if (fitnessEvaluator) {
      fitnessEvaluator.on('fitness:evaluated', (evaluation) => {
        this.dashboard.emit('metrics:update', {
          fitness: evaluation.fitness,
          confidence: evaluation.confidence,
          features: evaluation.features,
          breakdown: evaluation.breakdown,
          timestamp: new Date()
        });
      });
      
      fitnessEvaluator.on('model:retrained', (modelInfo) => {
        this.dashboard.emit('fitness:model-updated', {
          accuracy: modelInfo.accuracy,
          trainingData: modelInfo.trainingDataSize,
          improvements: modelInfo.improvements,
          timestamp: new Date()
        });
      });
      
      this.subscriptions.set('fitness', fitnessEvaluator);
    }
  }

  // Connect metrics collector to dashboard
  connectMetricsCollector() {
    if (!this.metricsCollector) return;
    
    this.metricsCollector.on('metrics:update', (metrics) => {
      this.dashboard.emit('metrics:update', metrics);
    });
    
    this.metricsCollector.on('metrics:snapshot', (snapshot) => {
      this.dashboard.emit('metrics:snapshot', snapshot);
    });
  }

  // Setup dashboard event handlers
  setupDashboardHandlers() {
    if (!this.dashboard) return;
    
    // Handle dashboard-triggered actions
    this.dashboard.on('dashboard:trigger-evolution', (params) => {
      this.triggerEvolution(params);
    });
    
    this.dashboard.on('dashboard:invoke-god', (god, task) => {
      this.invokeGod(god, task);
    });
    
    this.dashboard.on('dashboard:reset-metrics', () => {
      this.resetMetrics();
    });
    
    this.dashboard.on('dashboard:started', (info) => {
      console.log(chalk.green(`📊 Dashboard available at http://localhost:${info.port}`));
      this.emit('dashboard:started', info);
    });
  }

  // Action handlers
  async triggerEvolution(params = {}) {
    console.log(chalk.yellow('🧬 Dashboard triggered evolution'));
    
    try {
      const { generations = 5, populationSize = 20 } = params;
      
      // Trigger evolution in available engines
      if (this.components.evolutionEngine) {
        await this.components.evolutionEngine.runNeuralEvolution(generations);
      }
      
      if (this.components.multiObjectiveOptimizer) {
        // Create sample population for optimization
        const population = Array.from({ length: populationSize }, (_, i) => ({
          id: `sample_${i}`,
          properties: {
            performance: Math.random() * 100,
            complexity: Math.random() * 100,
            maintainability: Math.random() * 100
          }
        }));
        
        await this.components.multiObjectiveOptimizer.optimize(population, generations);
      }
      
      logger.info('Dashboard-triggered evolution completed', { generations, populationSize });
      
    } catch (error) {
      logger.error('Dashboard-triggered evolution failed', { error: error.message });
    }
  }

  async invokeGod(godName, task) {
    console.log(chalk.magenta(`🔮 Dashboard invoked ${godName} for: ${task}`));
    
    try {
      if (this.components.ashvatthaTree) {
        const result = await this.components.ashvatthaTree.invokeGod(godName, task);
        logger.info('Dashboard god invocation completed', { god: godName, task, result });
        return result;
      }
    } catch (error) {
      logger.error('Dashboard god invocation failed', { god: godName, task, error: error.message });
    }
  }

  resetMetrics() {
    console.log(chalk.yellow('📊 Dashboard triggered metrics reset'));
    
    if (this.metricsCollector) {
      this.metricsCollector.reset();
    }
    
    // Reset component metrics
    Object.values(this.components).forEach(component => {
      if (component && typeof component.resetMetrics === 'function') {
        component.resetMetrics();
      }
    });
  }

  // Start the dashboard system
  async start() {
    if (this.isRunning) {
      console.log(chalk.yellow('⚠️  Dashboard already running'));
      return;
    }
    
    try {
      console.log(chalk.cyan('🚀 Starting Dashboard System'));
      
      if (this.dashboard) {
        await this.dashboard.start();
      }
      
      this.isRunning = true;
      console.log(chalk.green('✅ Dashboard system started successfully'));
      
      // Log system information
      this.logSystemInfo();
      
    } catch (error) {
      logger.error('Failed to start dashboard system', { error: error.message });
      throw error;
    }
  }

  // Stop the dashboard system
  async stop() {
    if (!this.isRunning) return;
    
    try {
      console.log(chalk.yellow('🛑 Stopping Dashboard System'));
      
      // Stop dashboard
      if (this.dashboard) {
        await this.dashboard.stop();
      }
      
      // Stop metrics collector
      if (this.metricsCollector) {
        this.metricsCollector.stop();
      }
      
      // Clear subscriptions
      this.subscriptions.clear();
      
      this.isRunning = false;
      console.log(chalk.red('🛑 Dashboard system stopped'));
      
    } catch (error) {
      logger.error('Error stopping dashboard system', { error: error.message });
    }
  }

  // Log system information
  logSystemInfo() {
    const info = {
      dashboard: {
        port: this.config.dashboardPort,
        wsPort: this.config.wsPort,
        running: this.isRunning
      },
      components: Object.keys(this.components).filter(key => this.components[key] !== null),
      subscriptions: Array.from(this.subscriptions.keys()),
      metrics: this.metricsCollector?.getCurrentMetrics() || null
    };
    
    console.log(chalk.cyan('\n📊 Dashboard System Information:'));
    console.log(chalk.blue(`   🌐 Web Interface: http://localhost:${info.dashboard.port}`));
    console.log(chalk.blue(`   🔗 WebSocket: ws://localhost:${info.dashboard.wsPort}`));
    console.log(chalk.green(`   🔧 Components: ${info.components.join(', ')}`));
    console.log(chalk.yellow(`   📡 Subscriptions: ${info.subscriptions.join(', ')}`));
  }

  // Get integration status
  getStatus() {
    return {
      running: this.isRunning,
      dashboard: this.dashboard?.getStats() || null,
      metrics: this.metricsCollector?.getCurrentMetrics() || null,
      components: Object.keys(this.components).filter(key => this.components[key] !== null),
      subscriptions: Array.from(this.subscriptions.keys()),
      config: this.config
    };
  }

  // Register additional component
  registerComponent(name, component) {
    this.components[name] = component;
    console.log(chalk.green(`✅ Registered component: ${name}`));
    
    // Setup integration if component has known patterns
    if (name.includes('evolution') || name.includes('Evolution')) {
      this.setupEvolutionIntegration();
    } else if (name.includes('neural') || name.includes('Neural')) {
      this.setupNeuralIntegration();
    } else if (name.includes('divine') || name.includes('tree') || name.includes('ashvattha')) {
      this.setupDivineIntegration();
    }
  }

  // Unregister component
  unregisterComponent(name) {
    if (this.components[name]) {
      this.components[name] = null;
      this.subscriptions.delete(name);
      console.log(chalk.yellow(`🗑️  Unregistered component: ${name}`));
    }
  }
}

export default DashboardIntegration;