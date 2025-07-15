/**
 * NeuralGodNetwork.js - Neural Network Enhanced Divine Coordination
 * Advanced AI system that learns optimal god combinations and intervention strategies
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import { logger } from './Logger.js';
import { ashvatthaTree } from './GodRealms.js';
import { treeCoordinator } from './TreeCoordinator.js';
import NeuralEvolutionEngine from '../heartwood/NeuralEvolutionEngine.js';

export class NeuralGodNetwork extends EventEmitter {
  constructor() {
    super();
    this.neuralEngine = new NeuralEvolutionEngine();
    this.godEmbeddings = new Map(); // god_name -> embedding vector
    this.taskEmbeddings = new Map(); // task_type -> embedding vector
    this.interventionHistory = [];
    this.coordinationModel = null;
    this.embeddingDimension = 64;
    
    // God categories for neural organization
    this.godCategories = {
      light: {
        supreme: ['zeus', 'odin', 'brahma'],
        creation: ['apollo', 'freyr', 'saraswati'],
        protection: ['thor', 'heimdall', 'durga'],
        wisdom: ['athena', 'bragi', 'ganesha'],
        harmony: ['baldr', 'frigg', 'lakshmi']
      },
      shadow: {
        supreme: ['hades', 'shiva', 'kali'],
        transformation: ['loki', 'mara', 'mahakala'],
        destruction: ['fenrir', 'yama', 'bhairava'],
        mystery: ['hel', 'nyx', 'tamas'],
        chaos: ['jormungandr', 'avidya', 'nirrti']
      }
    };
    
    // Task complexity neural mapping
    this.complexityLevels = {
      trivial: { min: 0, max: 20, gods: 1, neural_weight: 0.1 },
      low: { min: 20, max: 40, gods: 2, neural_weight: 0.3 },
      medium: { min: 40, max: 60, gods: 3, neural_weight: 0.5 },
      high: { min: 60, max: 80, gods: 4, neural_weight: 0.7 },
      divine: { min: 80, max: 100, gods: 6, neural_weight: 1.0 }
    };
    
    logger.info('NeuralGodNetwork initialized for enhanced divine coordination');
  }

  // Initialize neural god system
  async initialize() {
    console.log(chalk.cyan('🧠 Initializing Neural God Network'));
    
    try {
      // Generate god embeddings
      await this.generateGodEmbeddings();
      
      // Generate task embeddings
      await this.generateTaskEmbeddings();
      
      // Train initial coordination model
      await this.trainCoordinationModel();
      
      console.log(chalk.green('✅ Neural God Network initialized successfully'));
      this.emit('network:initialized');
      
    } catch (error) {
      logger.error('Failed to initialize Neural God Network', { error: error.message });
      throw error;
    }
  }

  // Generate neural embeddings for each god
  async generateGodEmbeddings() {
    console.log(chalk.yellow('🔮 Generating god embeddings'));
    
    for (const [realm, categories] of Object.entries(this.godCategories)) {
      for (const [category, gods] of Object.entries(categories)) {
        for (const godName of gods) {
          const embedding = await this.createGodEmbedding(godName, realm, category);
          this.godEmbeddings.set(godName, embedding);
          
          console.log(chalk.gray(`   📊 ${godName}: ${embedding.slice(0, 3).map(v => v.toFixed(2)).join(', ')}...`));
        }
      }
    }
    
    console.log(chalk.green(`✨ Generated embeddings for ${this.godEmbeddings.size} gods`));
  }

  // Create embedding vector for a specific god
  async createGodEmbedding(godName, realm, category) {
    const embedding = new Array(this.embeddingDimension).fill(0);
    
    // Get god's divine properties
    const godInfo = await ashvatthaTree.invokeGod(godName, 'Provide divine essence for neural embedding');
    
    // Base embedding from god properties
    const baseValues = this.extractGodProperties(godName, realm, category, godInfo);
    
    // Fill embedding with god characteristics
    for (let i = 0; i < this.embeddingDimension; i++) {
      let value = 0;
      
      // Realm encoding (first 8 dimensions)
      if (i < 8) {
        value = realm === 'light' ? Math.random() * 0.8 + 0.2 : Math.random() * -0.8 - 0.2;
      }
      // Category encoding (next 16 dimensions)
      else if (i < 24) {
        value = this.encodeCategoryFeature(category, i - 8);
      }
      // God-specific features (next 24 dimensions)
      else if (i < 48) {
        value = this.encodeGodSpecificFeature(godName, baseValues, i - 24);
      }
      // Dynamic features (last 16 dimensions)
      else {
        value = this.encodeDynamicFeature(godInfo, i - 48);
      }
      
      embedding[i] = this.normalizeEmbeddingValue(value);
    }
    
    return embedding;
  }

  // Extract god properties for embedding
  extractGodProperties(godName, realm, category, godInfo) {
    const properties = {
      wisdom: 0.5,
      power: 0.5,
      creativity: 0.5,
      stability: 0.5,
      energy: godInfo?.god?.energy || 100
    };
    
    // God-specific property adjustments
    const godTraits = {
      // Light gods
      odin: { wisdom: 0.95, power: 0.85, stability: 0.9 },
      thor: { power: 0.95, stability: 0.8, creativity: 0.6 },
      apollo: { creativity: 0.9, wisdom: 0.8, energy: 120 },
      athena: { wisdom: 0.9, stability: 0.85, power: 0.75 },
      baldr: { stability: 0.95, creativity: 0.7, wisdom: 0.8 },
      
      // Shadow gods
      shiva: { power: 0.95, creativity: 0.9, stability: 0.6 },
      kali: { power: 0.9, creativity: 0.85, stability: 0.4 },
      loki: { creativity: 0.95, wisdom: 0.8, stability: 0.3 },
      yama: { stability: 0.9, power: 0.8, wisdom: 0.85 },
      mara: { creativity: 0.8, power: 0.7, wisdom: 0.9 }
    };
    
    if (godTraits[godName]) {
      Object.assign(properties, godTraits[godName]);
    }
    
    return properties;
  }

  // Encode category features
  encodeCategoryFeature(category, index) {
    const categoryMappings = {
      supreme: [0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6],
      creation: [0.8, 0.7, 0.9, 0.8, 0.6, 0.5, 0.7, 0.8],
      protection: [0.7, 0.9, 0.6, 0.8, 0.9, 0.8, 0.5, 0.6],
      wisdom: [0.9, 0.8, 0.7, 0.9, 0.8, 0.7, 0.8, 0.9],
      harmony: [0.6, 0.7, 0.8, 0.7, 0.9, 0.8, 0.9, 0.8],
      transformation: [0.8, 0.6, 0.9, 0.7, 0.5, 0.8, 0.7, 0.9],
      destruction: [0.9, 0.8, 0.5, 0.6, 0.7, 0.9, 0.8, 0.6],
      mystery: [0.7, 0.9, 0.6, 0.8, 0.6, 0.7, 0.9, 0.8],
      chaos: [0.8, 0.5, 0.9, 0.6, 0.8, 0.6, 0.7, 0.9]
    };
    
    const mapping = categoryMappings[category] || new Array(8).fill(0.5);
    return mapping[index % mapping.length] + (Math.random() - 0.5) * 0.1;
  }

  // Encode god-specific features
  encodeGodSpecificFeature(godName, properties, index) {
    const propertyKeys = Object.keys(properties);
    const propertyIndex = index % propertyKeys.length;
    const propertyName = propertyKeys[propertyIndex];
    
    let value = properties[propertyName];
    
    // Add some god-specific noise
    const godHash = this.hashString(godName);
    const noise = (godHash % 100) / 1000; // Small god-specific variation
    
    return value + noise;
  }

  // Encode dynamic features from god invocation
  encodeDynamicFeature(godInfo, index) {
    if (!godInfo || !godInfo.god) return Math.random() * 0.2;
    
    const features = [
      godInfo.god.energy / 200, // Normalize energy
      godInfo.balance || 0,
      Math.random() * 0.3, // Current cosmic alignment
      (godInfo.intervention?.length || 0) / 100 // Intervention complexity
    ];
    
    return features[index % features.length] || Math.random() * 0.1;
  }

  // Generate task embeddings
  async generateTaskEmbeddings() {
    console.log(chalk.yellow('📋 Generating task embeddings'));
    
    const taskTypes = [
      'debugging', 'optimization', 'security', 'architecture', 'ui', 'testing',
      'documentation', 'refactoring', 'performance', 'integration', 'deployment',
      'data_processing', 'api_design', 'database', 'authentication', 'monitoring'
    ];
    
    for (const taskType of taskTypes) {
      const embedding = await this.createTaskEmbedding(taskType);
      this.taskEmbeddings.set(taskType, embedding);
      
      console.log(chalk.gray(`   📝 ${taskType}: ${embedding.slice(0, 3).map(v => v.toFixed(2)).join(', ')}...`));
    }
    
    console.log(chalk.green(`✨ Generated embeddings for ${this.taskEmbeddings.size} task types`));
  }

  // Create embedding for task type
  async createTaskEmbedding(taskType) {
    const embedding = new Array(this.embeddingDimension).fill(0);
    
    // Task characteristics
    const taskCharacteristics = {
      debugging: { complexity: 0.6, creativity: 0.7, logic: 0.9, urgency: 0.8 },
      optimization: { complexity: 0.8, creativity: 0.6, logic: 0.8, urgency: 0.5 },
      security: { complexity: 0.9, creativity: 0.5, logic: 0.9, urgency: 0.9 },
      architecture: { complexity: 0.9, creativity: 0.8, logic: 0.9, urgency: 0.3 },
      ui: { complexity: 0.5, creativity: 0.9, logic: 0.6, urgency: 0.4 },
      testing: { complexity: 0.6, creativity: 0.5, logic: 0.9, urgency: 0.6 },
      documentation: { complexity: 0.3, creativity: 0.6, logic: 0.7, urgency: 0.2 },
      refactoring: { complexity: 0.7, creativity: 0.7, logic: 0.8, urgency: 0.4 },
      performance: { complexity: 0.8, creativity: 0.6, logic: 0.9, urgency: 0.7 },
      integration: { complexity: 0.8, creativity: 0.5, logic: 0.8, urgency: 0.6 }
    };
    
    const characteristics = taskCharacteristics[taskType] || {
      complexity: 0.5, creativity: 0.5, logic: 0.5, urgency: 0.5
    };
    
    // Fill embedding with task features
    for (let i = 0; i < this.embeddingDimension; i++) {
      let value;
      
      if (i < 16) {
        // Task characteristic features
        const charKeys = Object.keys(characteristics);
        const charIndex = i % charKeys.length;
        value = characteristics[charKeys[charIndex]];
      } else if (i < 32) {
        // Domain-specific features
        value = this.encodeDomainFeature(taskType, i - 16);
      } else if (i < 48) {
        // Complexity encoding
        value = this.encodeComplexityFeature(taskType, characteristics, i - 32);
      } else {
        // Context features
        value = Math.random() * 0.3; // Random context variation
      }
      
      embedding[i] = this.normalizeEmbeddingValue(value);
    }
    
    return embedding;
  }

  // Encode domain-specific features
  encodeDomainFeature(taskType, index) {
    const domainMappings = {
      frontend: ['ui', 'documentation'],
      backend: ['api_design', 'database', 'authentication'],
      devops: ['deployment', 'monitoring', 'integration'],
      quality: ['testing', 'debugging', 'security'],
      architecture: ['architecture', 'refactoring', 'optimization']
    };
    
    let domainScore = 0.5;
    
    for (const [domain, tasks] of Object.entries(domainMappings)) {
      if (tasks.includes(taskType)) {
        domainScore = 0.8 + Math.random() * 0.2;
        break;
      }
    }
    
    return domainScore + (Math.random() - 0.5) * 0.1;
  }

  // Encode complexity features
  encodeComplexityFeature(taskType, characteristics, index) {
    const complexityWeight = characteristics.complexity;
    const logicWeight = characteristics.logic;
    const creativityWeight = characteristics.creativity;
    
    const features = [complexityWeight, logicWeight, creativityWeight];
    return features[index % features.length] || 0.5;
  }

  // Neural god selection using embeddings
  async selectOptimalGods(task, complexity = 'medium', requireDualGods = true) {
    console.log(chalk.cyan(`🧠 Neural god selection for: ${task}`));
    
    try {
      // Analyze task to get task embedding
      const taskEmbedding = await this.analyzeTaskForEmbedding(task);
      
      // Calculate similarities with all gods
      const godSimilarities = [];
      
      for (const [godName, godEmbedding] of this.godEmbeddings) {
        const similarity = this.calculateCosineSimilarity(taskEmbedding, godEmbedding);
        const complexityMatch = this.calculateComplexityMatch(godName, complexity);
        const finalScore = similarity * 0.7 + complexityMatch * 0.3;
        
        godSimilarities.push({
          god: godName,
          similarity,
          complexityMatch,
          finalScore,
          realm: this.getGodRealm(godName)
        });
      }
      
      // Sort by final score
      godSimilarities.sort((a, b) => b.finalScore - a.finalScore);
      
      let selectedGods = {};
      
      if (requireDualGods) {
        // Select best light and shadow gods
        const lightGods = godSimilarities.filter(g => g.realm === 'light');
        const shadowGods = godSimilarities.filter(g => g.realm === 'shadow');
        
        selectedGods = {
          light: lightGods[0]?.god || 'odin',
          shadow: shadowGods[0]?.god || 'shiva',
          lightScore: lightGods[0]?.finalScore || 0,
          shadowScore: shadowGods[0]?.finalScore || 0,
          balance: this.calculateDualGodBalance(lightGods[0], shadowGods[0])
        };
      } else {
        // Select single best god
        selectedGods = {
          primary: godSimilarities[0]?.god || 'odin',
          score: godSimilarities[0]?.finalScore || 0,
          realm: godSimilarities[0]?.realm || 'light'
        };
      }
      
      // Log neural selection process
      console.log(chalk.blue('   🎯 Neural Selection Results:'));
      if (requireDualGods) {
        console.log(chalk.green(`      ☀️  Light: ${selectedGods.light} (${selectedGods.lightScore.toFixed(3)})`));
        console.log(chalk.magenta(`      🌙 Shadow: ${selectedGods.shadow} (${selectedGods.shadowScore.toFixed(3)})`));
        console.log(chalk.yellow(`      ⚖️  Balance: ${selectedGods.balance.toFixed(3)}`));
      } else {
        console.log(chalk.green(`      🎯 Primary: ${selectedGods.primary} (${selectedGods.score.toFixed(3)})`));
      }
      
      // Record for learning
      this.recordNeuralSelection(task, selectedGods, taskEmbedding, complexity);
      
      this.emit('gods:selected', { task, selectedGods, method: 'neural' });
      
      return selectedGods;
      
    } catch (error) {
      logger.error('Neural god selection failed', { error: error.message });
      
      // Fallback to traditional selection
      return this.fallbackGodSelection(task, complexity, requireDualGods);
    }
  }

  // Analyze task to create embedding
  async analyzeTaskForEmbedding(task) {
    const taskLower = task.toLowerCase();
    
    // Try to match existing task types
    for (const [taskType, embedding] of this.taskEmbeddings) {
      if (taskLower.includes(taskType) || taskType.includes(taskLower.split(' ')[0])) {
        return embedding.slice(); // Return copy
      }
    }
    
    // Create dynamic embedding for new task type
    return await this.createDynamicTaskEmbedding(task);
  }

  // Create dynamic embedding for unknown task
  async createDynamicTaskEmbedding(task) {
    const embedding = new Array(this.embeddingDimension).fill(0);
    
    // Analyze task text for features
    const taskLower = task.toLowerCase();
    const words = taskLower.split(/\s+/);
    
    // Extract features from task description
    const features = {
      complexity: this.estimateTaskComplexity(words),
      creativity: this.estimateTaskCreativity(words),
      logic: this.estimateTaskLogic(words),
      urgency: this.estimateTaskUrgency(words)
    };
    
    // Fill embedding based on extracted features
    for (let i = 0; i < this.embeddingDimension; i++) {
      const featureKeys = Object.keys(features);
      const featureIndex = i % featureKeys.length;
      const featureValue = features[featureKeys[featureIndex]];
      
      // Add some variation based on task words
      const wordHash = this.hashWords(words);
      const variation = (wordHash % 100) / 1000;
      
      embedding[i] = this.normalizeEmbeddingValue(featureValue + variation);
    }
    
    return embedding;
  }

  // Calculate cosine similarity between embeddings
  calculateCosineSimilarity(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Calculate complexity match for god
  calculateComplexityMatch(godName, complexity) {
    const godComplexityScores = {
      // Light gods
      odin: 0.9,     // Supreme wisdom
      thor: 0.7,     // Direct power
      apollo: 0.8,   // Creative wisdom
      athena: 0.85,  // Strategic wisdom
      baldr: 0.6,    // Harmony and peace
      
      // Shadow gods
      shiva: 0.95,   // Ultimate transformation
      kali: 0.8,     // Destructive power
      loki: 0.9,     // Adaptive complexity
      yama: 0.75,    // Systematic judgment
      mara: 0.85     // Psychological complexity
    };
    
    const godScore = godComplexityScores[godName] || 0.5;
    const complexityScore = this.complexityLevels[complexity]?.neural_weight || 0.5;
    
    // Calculate match (closer values = higher match)
    return 1 - Math.abs(godScore - complexityScore);
  }

  // Get god's realm
  getGodRealm(godName) {
    for (const [realm, categories] of Object.entries(this.godCategories)) {
      for (const gods of Object.values(categories)) {
        if (gods.includes(godName)) return realm;
      }
    }
    return 'light'; // Default
  }

  // Calculate balance between dual gods
  calculateDualGodBalance(lightGod, shadowGod) {
    if (!lightGod || !shadowGod) return 0;
    
    const lightScore = lightGod.finalScore;
    const shadowScore = shadowGod.finalScore;
    
    // Perfect balance when scores are equal
    const scoreDifference = Math.abs(lightScore - shadowScore);
    const averageScore = (lightScore + shadowScore) / 2;
    
    // Balance score (higher is more balanced)
    return averageScore * (1 - scoreDifference);
  }

  // Record neural selection for learning
  recordNeuralSelection(task, selectedGods, taskEmbedding, complexity) {
    const record = {
      task,
      selectedGods,
      taskEmbedding: taskEmbedding.slice(),
      complexity,
      timestamp: new Date(),
      sessionId: Date.now()
    };
    
    this.interventionHistory.push(record);
    
    // Keep only recent history (last 1000 interventions)
    if (this.interventionHistory.length > 1000) {
      this.interventionHistory = this.interventionHistory.slice(-1000);
    }
  }

  // Train coordination model
  async trainCoordinationModel() {
    console.log(chalk.yellow('🎓 Training neural coordination model'));
    
    if (this.interventionHistory.length < 10) {
      console.log(chalk.yellow('⚠️  Insufficient history for training, using pre-trained model'));
      return;
    }
    
    // Prepare training data from intervention history
    const trainingData = this.prepareCoordinationTrainingData();
    
    // Train model using neural evolution
    this.coordinationModel = await this.neuralEngine.runNeuralEvolution(3, trainingData);
    
    console.log(chalk.green('✅ Coordination model trained successfully'));
  }

  // Prepare training data for coordination model
  prepareCoordinationTrainingData() {
    return this.interventionHistory.map(record => ({
      input: record.taskEmbedding,
      output: this.encodeGodSelection(record.selectedGods),
      weight: 1.0 // All records equally important for now
    }));
  }

  // Encode god selection as output vector
  encodeGodSelection(selectedGods) {
    const output = new Array(8).fill(0);
    
    if (selectedGods.light && selectedGods.shadow) {
      // Dual god encoding
      const lightIndex = this.getGodIndex(selectedGods.light);
      const shadowIndex = this.getGodIndex(selectedGods.shadow);
      
      output[0] = lightIndex / 32;   // Normalized light god index
      output[1] = shadowIndex / 32;  // Normalized shadow god index
      output[2] = selectedGods.lightScore || 0;
      output[3] = selectedGods.shadowScore || 0;
      output[4] = selectedGods.balance || 0;
      output[5] = 1; // Dual god flag
    } else if (selectedGods.primary) {
      // Single god encoding
      const godIndex = this.getGodIndex(selectedGods.primary);
      output[0] = godIndex / 32;
      output[1] = selectedGods.score || 0;
      output[5] = 0; // Single god flag
    }
    
    return output;
  }

  // Get numeric index for god
  getGodIndex(godName) {
    const allGods = [];
    
    for (const categories of Object.values(this.godCategories)) {
      for (const gods of Object.values(categories)) {
        allGods.push(...gods);
      }
    }
    
    return allGods.indexOf(godName) || 0;
  }

  // Utility functions
  normalizeEmbeddingValue(value) {
    return Math.max(-1, Math.min(1, value));
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  hashWords(words) {
    return this.hashString(words.join(''));
  }

  estimateTaskComplexity(words) {
    const complexityKeywords = ['complex', 'advanced', 'system', 'architecture', 'algorithm'];
    let score = 0.5;
    
    words.forEach(word => {
      if (complexityKeywords.some(keyword => word.includes(keyword))) {
        score += 0.1;
      }
    });
    
    return Math.min(1, score);
  }

  estimateTaskCreativity(words) {
    const creativityKeywords = ['create', 'design', 'innovative', 'new', 'original'];
    let score = 0.5;
    
    words.forEach(word => {
      if (creativityKeywords.some(keyword => word.includes(keyword))) {
        score += 0.1;
      }
    });
    
    return Math.min(1, score);
  }

  estimateTaskLogic(words) {
    const logicKeywords = ['algorithm', 'logic', 'structure', 'analysis', 'system'];
    let score = 0.5;
    
    words.forEach(word => {
      if (logicKeywords.some(keyword => word.includes(keyword))) {
        score += 0.1;
      }
    });
    
    return Math.min(1, score);
  }

  estimateTaskUrgency(words) {
    const urgencyKeywords = ['urgent', 'critical', 'fix', 'bug', 'immediately'];
    let score = 0.3;
    
    words.forEach(word => {
      if (urgencyKeywords.some(keyword => word.includes(keyword))) {
        score += 0.2;
      }
    });
    
    return Math.min(1, score);
  }

  // Fallback god selection
  fallbackGodSelection(task, complexity, requireDualGods) {
    console.log(chalk.yellow('⚠️  Using fallback god selection'));
    
    if (requireDualGods) {
      return {
        light: 'odin',
        shadow: 'shiva',
        lightScore: 0.5,
        shadowScore: 0.5,
        balance: 0.5
      };
    } else {
      return {
        primary: 'odin',
        score: 0.5,
        realm: 'light'
      };
    }
  }

  // Get network statistics
  getNetworkStats() {
    return {
      gods: this.godEmbeddings.size,
      tasks: this.taskEmbeddings.size,
      interventions: this.interventionHistory.length,
      hasModel: !!this.coordinationModel,
      embeddingDimension: this.embeddingDimension
    };
  }
}

export default NeuralGodNetwork;