/**
 * MonitoringDashboard.js - Real-Time Evolution Monitoring System
 * WebSocket-based dashboard for live monitoring of neural evolution and divine interventions
 */

import { EventEmitter } from 'events';
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import chalk from 'chalk';
import { logger } from './Logger.js';
import { treeCoordinator } from './TreeCoordinator.js';
import { ashvatthaTree } from './GodRealms.js';

export class MonitoringDashboard extends EventEmitter {
  constructor(options = {}) {
    super();
    this.port = options.port || 3000;
    this.wsPort = options.wsPort || 3001;
    this.app = express();
    this.server = null;
    this.wsServer = null;
    this.clients = new Set();
    
    // Real-time data stores
    this.evolutionData = {
      generations: [],
      paretoFronts: [],
      currentGeneration: 0,
      bestFitness: 0,
      averageFitness: 0,
      diversity: 0
    };
    
    this.neuralData = {
      networks: new Map(),
      architectures: [],
      trainingMetrics: [],
      bestNetwork: null
    };
    
    this.divineData = {
      interventions: [],
      godActivities: new Map(),
      blessings: [],
      treeHealth: null
    };
    
    this.metricsHistory = {
      fitness: [],
      performance: [],
      complexity: [],
      timestamps: []
    };
    
    this.setupExpress();
    this.setupWebSocket();
    this.startDataCollection();
    
    logger.info('MonitoringDashboard initialized for real-time evolution tracking');
  }

  // Setup Express server for dashboard
  setupExpress() {
    // Serve static dashboard files
    this.app.use(express.static(path.join(process.cwd(), 'dashboard', 'public')));
    this.app.use(express.json());
    
    // API Routes
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'active',
        uptime: process.uptime(),
        clients: this.clients.size,
        lastUpdate: new Date()
      });
    });
    
    this.app.get('/api/evolution', (req, res) => {
      res.json(this.evolutionData);
    });
    
    this.app.get('/api/neural', (req, res) => {
      res.json({
        ...this.neuralData,
        networks: Array.from(this.neuralData.networks.values())
      });
    });
    
    this.app.get('/api/divine', (req, res) => {
      res.json({
        ...this.divineData,
        godActivities: Array.from(this.divineData.godActivities.entries())
      });
    });
    
    this.app.get('/api/metrics', (req, res) => {
      const limit = parseInt(req.query.limit) || 100;
      res.json({
        fitness: this.metricsHistory.fitness.slice(-limit),
        performance: this.metricsHistory.performance.slice(-limit),
        complexity: this.metricsHistory.complexity.slice(-limit),
        timestamps: this.metricsHistory.timestamps.slice(-limit)
      });
    });
    
    this.app.get('/api/tree-health', (req, res) => {
      const treeHealth = treeCoordinator.getTreeHealth();
      res.json(treeHealth);
    });
    
    // Dashboard main page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dashboard', 'public', 'index.html'));
    });
  }

  // Setup WebSocket server for real-time updates
  setupWebSocket() {
    this.server = http.createServer(this.app);
    this.wsServer = new WebSocketServer({ port: this.wsPort });
    
    this.wsServer.on('connection', (ws, req) => {
      console.log(chalk.green('🔗 Dashboard client connected'));
      this.clients.add(ws);
      
      // Send initial data
      this.sendToClient(ws, 'initial-data', {
        evolution: this.evolutionData,
        neural: this.neuralData,
        divine: this.divineData,
        metrics: this.metricsHistory
      });
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          logger.warn('Invalid WebSocket message', { error: error.message });
        }
      });
      
      ws.on('close', () => {
        console.log(chalk.yellow('🔌 Dashboard client disconnected'));
        this.clients.delete(ws);
      });
      
      ws.on('error', (error) => {
        logger.error('WebSocket error', { error: error.message });
        this.clients.delete(ws);
      });
    });
  }

  // Handle messages from dashboard clients
  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        ws.subscriptions = data.channels || ['all'];
        this.sendToClient(ws, 'subscribed', { channels: ws.subscriptions });
        break;
        
      case 'trigger-evolution':
        this.emit('dashboard:trigger-evolution', data.params);
        break;
        
      case 'invoke-god':
        this.emit('dashboard:invoke-god', data.god, data.task);
        break;
        
      case 'reset-metrics':
        this.resetMetrics();
        this.broadcast('metrics-reset', { timestamp: new Date() });
        break;
        
      default:
        logger.warn('Unknown dashboard message type', { type: data.type });
    }
  }

  // Send message to specific client
  sendToClient(ws, type, data) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type, data, timestamp: new Date() }));
    }
  }

  // Broadcast to all connected clients
  broadcast(type, data, channel = 'all') {
    const message = JSON.stringify({ type, data, timestamp: new Date() });
    
    this.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        const subscriptions = ws.subscriptions || ['all'];
        if (subscriptions.includes('all') || subscriptions.includes(channel)) {
          ws.send(message);
        }
      }
    });
  }

  // Start collecting data from evolution systems
  startDataCollection() {
    // Listen for evolution events
    this.on('evolution:generation', (data) => {
      this.updateEvolutionData(data);
      this.broadcast('evolution-update', data, 'evolution');
    });
    
    this.on('neural:network-evaluated', (network) => {
      this.updateNeuralData(network);
      this.broadcast('neural-update', network, 'neural');
    });
    
    this.on('divine:intervention', (intervention) => {
      this.updateDivineData(intervention);
      this.broadcast('divine-update', intervention, 'divine');
    });
    
    this.on('metrics:update', (metrics) => {
      this.updateMetrics(metrics);
      this.broadcast('metrics-update', metrics, 'metrics');
    });
    
    // Periodic tree health updates
    setInterval(() => {
      const treeHealth = treeCoordinator.getTreeHealth();
      this.divineData.treeHealth = treeHealth;
      this.broadcast('tree-health-update', treeHealth, 'divine');
    }, 5000);
    
    // Periodic god activity summary
    setInterval(() => {
      this.updateGodActivities();
      this.broadcast('god-activities-update', {
        activities: Array.from(this.divineData.godActivities.entries())
      }, 'divine');
    }, 10000);
  }

  // Update evolution data
  updateEvolutionData(data) {
    this.evolutionData.currentGeneration = data.generation || 0;
    this.evolutionData.bestFitness = data.bestFitness || 0;
    this.evolutionData.averageFitness = data.averageFitness || 0;
    this.evolutionData.diversity = data.diversity || 0;
    
    // Store generation history
    this.evolutionData.generations.push({
      generation: data.generation,
      bestFitness: data.bestFitness,
      averageFitness: data.averageFitness,
      diversity: data.diversity,
      timestamp: new Date()
    });
    
    // Keep last 1000 generations
    if (this.evolutionData.generations.length > 1000) {
      this.evolutionData.generations = this.evolutionData.generations.slice(-1000);
    }
    
    // Update Pareto fronts
    if (data.paretoFronts) {
      this.evolutionData.paretoFronts = data.paretoFronts.map(front => ({
        solutions: front.map(solution => ({
          id: solution.id,
          fitness: solution.fitness,
          objectives: solution.evaluation?.objectives || {},
          rank: solution.evaluation?.rank || 0
        }))
      }));
    }
  }

  // Update neural network data
  updateNeuralData(network) {
    this.neuralData.networks.set(network.id, {
      id: network.id,
      fitness: network.fitness,
      generation: network.generation,
      architecture: {
        layers: network.hiddenLayers?.length || 0,
        neurons: network.hiddenLayers?.reduce((sum, layer) => sum + layer.neurons, 0) || 0,
        learningRate: network.learningRate
      },
      metrics: network.metrics,
      timestamp: new Date()
    });
    
    // Update best network
    if (!this.neuralData.bestNetwork || network.fitness > this.neuralData.bestNetwork.fitness) {
      this.neuralData.bestNetwork = network;
    }
    
    // Store architecture variations
    const archSignature = this.getArchitectureSignature(network);
    if (!this.neuralData.architectures.find(arch => arch.signature === archSignature)) {
      this.neuralData.architectures.push({
        signature: archSignature,
        layers: network.hiddenLayers?.length || 0,
        totalNeurons: network.hiddenLayers?.reduce((sum, layer) => sum + layer.neurons, 0) || 0,
        avgFitness: network.fitness,
        count: 1,
        firstSeen: new Date()
      });
    } else {
      const arch = this.neuralData.architectures.find(arch => arch.signature === archSignature);
      arch.count++;
      arch.avgFitness = (arch.avgFitness + network.fitness) / 2;
    }
  }

  // Update divine intervention data
  updateDivineData(intervention) {
    this.divineData.interventions.push({
      ...intervention,
      timestamp: new Date()
    });
    
    // Keep last 500 interventions
    if (this.divineData.interventions.length > 500) {
      this.divineData.interventions = this.divineData.interventions.slice(-500);
    }
    
    // Track god activities
    const godName = intervention.god || intervention.lightGod || intervention.shadowGod;
    if (godName) {
      const activity = this.divineData.godActivities.get(godName) || {
        interventions: 0,
        lastActive: null,
        totalEnergy: 0,
        averageSuccess: 0
      };
      
      activity.interventions++;
      activity.lastActive = new Date();
      activity.totalEnergy += intervention.energy || 0;
      
      this.divineData.godActivities.set(godName, activity);
    }
    
    // Track blessings
    if (intervention.blessing || intervention.divineBlessing) {
      this.divineData.blessings.push({
        god: godName,
        blessing: intervention.blessing || intervention.divineBlessing,
        timestamp: new Date()
      });
      
      // Keep last 100 blessings
      if (this.divineData.blessings.length > 100) {
        this.divineData.blessings = this.divineData.blessings.slice(-100);
      }
    }
  }

  // Update metrics history
  updateMetrics(metrics) {
    const timestamp = new Date();
    
    this.metricsHistory.fitness.push(metrics.fitness || 0);
    this.metricsHistory.performance.push(metrics.performance || 0);
    this.metricsHistory.complexity.push(metrics.complexity || 0);
    this.metricsHistory.timestamps.push(timestamp);
    
    // Keep last 1000 metrics
    const maxLength = 1000;
    if (this.metricsHistory.fitness.length > maxLength) {
      this.metricsHistory.fitness = this.metricsHistory.fitness.slice(-maxLength);
      this.metricsHistory.performance = this.metricsHistory.performance.slice(-maxLength);
      this.metricsHistory.complexity = this.metricsHistory.complexity.slice(-maxLength);
      this.metricsHistory.timestamps = this.metricsHistory.timestamps.slice(-maxLength);
    }
  }

  // Update god activities summary
  updateGodActivities() {
    for (const [godName, activity] of this.divineData.godActivities) {
      // Calculate activity level based on recent interventions
      const recentInterventions = this.divineData.interventions.filter(
        intervention => {
          const godMatch = intervention.god === godName || 
                         intervention.lightGod === godName || 
                         intervention.shadowGod === godName;
          const isRecent = Date.now() - new Date(intervention.timestamp).getTime() < 60000; // Last minute
          return godMatch && isRecent;
        }
      ).length;
      
      activity.recentActivity = recentInterventions;
      activity.activityLevel = recentInterventions > 5 ? 'high' : 
                              recentInterventions > 2 ? 'medium' : 
                              recentInterventions > 0 ? 'low' : 'idle';
    }
  }

  // Get architecture signature for grouping
  getArchitectureSignature(network) {
    const layers = network.hiddenLayers || [];
    return layers.map(layer => `${layer.neurons}-${layer.activation}`).join('|');
  }

  // Reset all metrics
  resetMetrics() {
    this.metricsHistory = {
      fitness: [],
      performance: [],
      complexity: [],
      timestamps: []
    };
    
    this.evolutionData.generations = [];
    this.neuralData.networks.clear();
    this.divineData.interventions = [];
    this.divineData.blessings = [];
    this.divineData.godActivities.clear();
    
    console.log(chalk.yellow('📊 Dashboard metrics reset'));
  }

  // Start the dashboard server
  async start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error) => {
        if (error) {
          reject(error);
          return;
        }
        
        console.log(chalk.cyan(`\n🚀 Monitoring Dashboard Started`));
        console.log(chalk.green(`   📊 Web Interface: http://localhost:${this.port}`));
        console.log(chalk.blue(`   🔗 WebSocket Server: ws://localhost:${this.wsPort}`));
        console.log(chalk.yellow(`   📈 Real-time evolution monitoring active`));
        
        this.emit('dashboard:started', { port: this.port, wsPort: this.wsPort });
        resolve();
      });
    });
  }

  // Stop the dashboard server
  async stop() {
    return new Promise((resolve) => {
      // Close all WebSocket connections
      this.clients.forEach(ws => ws.close());
      this.clients.clear();
      
      // Close WebSocket server
      if (this.wsServer) {
        this.wsServer.close();
      }
      
      // Close HTTP server
      if (this.server) {
        this.server.close(() => {
          console.log(chalk.red('🛑 Monitoring Dashboard stopped'));
          this.emit('dashboard:stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Get dashboard statistics
  getStats() {
    return {
      uptime: process.uptime(),
      clients: this.clients.size,
      totalGenerations: this.evolutionData.generations.length,
      totalNetworks: this.neuralData.networks.size,
      totalInterventions: this.divineData.interventions.length,
      activeGods: this.divineData.godActivities.size,
      metricsPoints: this.metricsHistory.fitness.length
    };
  }
}

export default MonitoringDashboard;