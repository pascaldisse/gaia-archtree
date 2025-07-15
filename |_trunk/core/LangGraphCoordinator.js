/**
 * LangGraphCoordinator.js - Multi-Agent Coordination System
 * Coordinates 32-god pantheon as LangGraph agents for complex tasks
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import { ashvatthaTree } from './GodRealms.js';
import { treeCoordinator } from './TreeCoordinator.js';
import { gaiaTranslator } from './GaiaTranslator.js';
import { logger } from './Logger.js';

export class LangGraphCoordinator extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map(); // god -> agent mapping
    this.workflows = new Map(); // active workflows
    this.coordinationGraph = null;
    this.messageQueue = [];
    
    this.initializeAgents();
    logger.info('LangGraph Coordinator initialized with 32-god agent system');
  }

  // Initialize 32 gods as LangGraph agents
  initializeAgents() {
    // Light realm agents (16 Norse gods)
    const lightGods = [
      'odin', 'thor', 'freyr', 'baldr', 'heimdall', 'tyr', 'vidar', 'vali',
      'bragi', 'hodr', 'magni', 'modi', 'forseti', 'ull', 'vili', 've'
    ];

    // Shadow realm agents (16 Indian gods)
    const shadowGods = [
      'kali', 'shiva', 'durga', 'bhairava', 'rahu', 'ketu', 'yama', 'nirrti',
      'alakshmi', 'jyestha', 'mara', 'apasmara', 'mahakala', 'chandi', 'tamas', 'avidya'
    ];

    // Initialize light agents
    lightGods.forEach(god => {
      this.agents.set(god, {
        id: god,
        name: god,
        realm: 'light',
        type: 'creation',
        status: 'idle',
        capabilities: this.getGodCapabilities(god),
        messageHistory: [],
        currentTask: null
      });
    });

    // Initialize shadow agents
    shadowGods.forEach(god => {
      this.agents.set(god, {
        id: god,
        name: god,
        realm: 'shadow',
        type: 'optimization',
        status: 'idle',
        capabilities: this.getGodCapabilities(god),
        messageHistory: [],
        currentTask: null
      });
    });

    console.log(chalk.cyan(`🕸️  LangGraph: ${this.agents.size} agents initialized`));
  }

  // Get god-specific capabilities for agent specialization
  getGodCapabilities(godName) {
    const capabilities = {
      // Light gods
      odin: ['architecture', 'wisdom', 'planning', 'system-design'],
      thor: ['testing', 'debugging', 'performance', 'strength'],
      freyr: ['optimization', 'growth', 'scaling', 'prosperity'],
      baldr: ['ui-ux', 'beauty', 'harmony', 'user-experience'],
      heimdall: ['security', 'monitoring', 'auth', 'protection'],
      tyr: ['justice', 'validation', 'ethics', 'fairness'],
      vidar: ['clean-code', 'silence', 'minimalism', 'clarity'],
      bragi: ['documentation', 'communication', 'storytelling'],
      // Shadow gods
      kali: ['destruction', 'cleanup', 'removal', 'purification'],
      shiva: ['transformation', 'breaking-changes', 'revolution'],
      durga: ['defense', 'protection', 'security', 'barriers'],
      bhairava: ['critical-issues', 'panic-handling', 'emergency'],
      yama: ['termination', 'timeout', 'process-management'],
      mahakala: ['deep-cycles', 'time-management', 'eternity'],
      rahu: ['hidden-dependencies', 'dark-imports', 'obscurity'],
      mara: ['anti-patterns', 'temptation-detection', 'bad-practices']
    };
    return capabilities[godName] || ['general'];
  }

  // Create workflow for complex task coordination
  async createWorkflow(task, complexity = 'medium') {
    const workflowId = `workflow_${Date.now()}`;
    
    // Analyze task and select appropriate agents
    const selectedAgents = this.selectAgentsForTask(task, complexity);
    
    const workflow = {
      id: workflowId,
      task,
      complexity,
      agents: selectedAgents,
      status: 'created',
      created: new Date(),
      steps: [],
      gaiaScript: {
        originalTask: task,
        translatedTask: gaiaTranslator.translateToGaia(task)
      },
      coordination: {
        lightLeader: selectedAgents.light[0],
        shadowLeader: selectedAgents.shadow[0],
        collaboration: []
      }
    };

    this.workflows.set(workflowId, workflow);
    
    logger.info('LangGraph workflow created', {
      workflowId,
      lightAgents: selectedAgents.light.length,
      shadowAgents: selectedAgents.shadow.length
    });

    return workflow;
  }

  // Select optimal agents for task
  selectAgentsForTask(task, complexity) {
    const taskLower = task.toLowerCase();
    let lightAgents = ['odin']; // Default wisdom leader
    let shadowAgents = ['shiva']; // Default transformation leader

    // Task-specific agent selection
    if (taskLower.includes('debug') || taskLower.includes('test')) {
      lightAgents = ['thor', 'heimdall'];
      shadowAgents = ['bhairava', 'mara'];
    } else if (taskLower.includes('ui') || taskLower.includes('design')) {
      lightAgents = ['baldr', 'bragi'];
      shadowAgents = ['nirrti', 'alakshmi'];
    } else if (taskLower.includes('security') || taskLower.includes('auth')) {
      lightAgents = ['heimdall', 'tyr'];
      shadowAgents = ['durga', 'chandi'];
    } else if (taskLower.includes('performance') || taskLower.includes('optimize')) {
      lightAgents = ['thor', 'freyr'];
      shadowAgents = ['mahakala', 'kali'];
    } else if (taskLower.includes('architecture') || taskLower.includes('system')) {
      lightAgents = ['odin', 'vili', 've'];
      shadowAgents = ['avidya', 'tamas', 'yama'];
    }

    // Scale agent count based on complexity
    const agentCounts = {
      low: { light: 1, shadow: 1 },
      medium: { light: 2, shadow: 2 },
      high: { light: 3, shadow: 3 },
      divine: { light: 4, shadow: 4 }
    };

    const counts = agentCounts[complexity] || agentCounts.medium;
    
    return {
      light: lightAgents.slice(0, counts.light),
      shadow: shadowAgents.slice(0, counts.shadow)
    };
  }

  // Execute workflow with multi-agent coordination
  async executeWorkflow(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    workflow.status = 'executing';
    workflow.started = new Date();

    console.log(chalk.magenta('\n🕸️  LangGraph Workflow Execution'));
    console.log(chalk.cyan(`ID: ${workflowId}`));
    console.log(chalk.yellow(`Task: ${workflow.task}`));
    console.log(chalk.green(`Light Agents: ${workflow.agents.light.join(', ')}`));
    console.log(chalk.red(`Shadow Agents: ${workflow.agents.shadow.join(', ')}`));

    try {
      // Phase 1: Light agents collaboration (parallel)
      await this.executeAgentPhase(workflow, 'light');
      
      // Phase 2: Shadow agents optimization (parallel)
      await this.executeAgentPhase(workflow, 'shadow');
      
      // Phase 3: Cross-realm coordination
      await this.executeCrossRealmCoordination(workflow);
      
      // Phase 4: Final synthesis
      await this.executeWorkflowSynthesis(workflow);

      workflow.status = 'completed';
      workflow.completed = new Date();
      
      console.log(chalk.green('\n✨ LangGraph Workflow Complete!'));
      
    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      logger.error('LangGraph workflow failed', { workflowId, error: error.message });
      throw error;
    }

    return workflow;
  }

  // Execute agent phase (light or shadow)
  async executeAgentPhase(workflow, realm) {
    const agents = workflow.agents[realm];
    const realmSymbol = realm === 'light' ? '☀️' : '🌙';
    
    console.log(chalk.cyan(`\n${realmSymbol} ${realm.toUpperCase()} Agents Phase`));
    
    const phaseResults = [];
    
    // Execute agents in parallel (simulated)
    for (const agentId of agents) {
      const agent = this.agents.get(agentId);
      agent.status = 'active';
      agent.currentTask = workflow.task;
      
      console.log(chalk.gray(`  ${realmSymbol} ${agentId} processing...`));
      
      // Simulate agent processing
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      // Invoke god through ashvattha tree
      const result = await ashvatthaTree.invokeGod(agentId, workflow.task, {
        realm,
        workflow: workflow.id,
        gaiaScript: workflow.gaiaScript.translatedTask,
        collaboration: agents.length > 1
      });
      
      agent.status = 'idle';
      agent.currentTask = null;
      agent.messageHistory.push({
        timestamp: new Date(),
        task: workflow.task,
        result
      });
      
      phaseResults.push({
        agent: agentId,
        realm,
        result,
        capabilities: agent.capabilities
      });
    }
    
    workflow.steps.push({
      phase: `${realm}_agents`,
      results: phaseResults,
      timestamp: new Date()
    });
    
    // Update tree balance
    const balanceChange = realm === 'light' ? 20 : -20;
    treeCoordinator.balanceForces(
      realm === 'light' ? balanceChange : 0,
      realm === 'shadow' ? Math.abs(balanceChange) : 0
    );
  }

  // Execute cross-realm coordination between light and shadow
  async executeCrossRealmCoordination(workflow) {
    console.log(chalk.yellow('\n⚖️  Cross-Realm Coordination'));
    
    const lightLeader = workflow.coordination.lightLeader;
    const shadowLeader = workflow.coordination.shadowLeader;
    
    // Coordinate between light and shadow leaders
    const coordination = await treeCoordinator.invokeDualGods(
      lightLeader,
      shadowLeader,
      `Cross-realm coordination for: ${workflow.task}`
    );
    
    workflow.coordination.collaboration.push({
      type: 'cross_realm',
      lightLeader,
      shadowLeader,
      result: coordination,
      timestamp: new Date()
    });
    
    console.log(chalk.cyan(`  ⚡ ${lightLeader} ↔ ${shadowLeader} coordinated`));
  }

  // Execute final workflow synthesis
  async executeWorkflowSynthesis(workflow) {
    console.log(chalk.green('\n🌟 Final Synthesis'));
    
    // Gather all results
    const lightResults = workflow.steps.find(s => s.phase === 'light_agents')?.results || [];
    const shadowResults = workflow.steps.find(s => s.phase === 'shadow_agents')?.results || [];
    
    const synthesis = {
      lightPhase: lightResults,
      shadowPhase: shadowResults,
      coordination: workflow.coordination.collaboration,
      treeBalance: treeCoordinator.getTreeHealth().trunk.balance,
      agentCount: lightResults.length + shadowResults.length,
      gaiaScript: workflow.gaiaScript
    };
    
    workflow.finalResult = synthesis;
    
    console.log(chalk.green(`  🎯 Synthesis complete: ${synthesis.agentCount} agents coordinated`));
  }

  // Get workflow status
  getWorkflowStatus(workflowId) {
    return this.workflows.get(workflowId);
  }

  // List active workflows
  getActiveWorkflows() {
    return Array.from(this.workflows.values()).filter(w => w.status === 'executing');
  }

  // Get agent status
  getAgentStatus(agentId) {
    return this.agents.get(agentId);
  }

  // Get system statistics
  getSystemStats() {
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active');
    const workflows = Array.from(this.workflows.values());
    
    return {
      totalAgents: this.agents.size,
      activeAgents: activeAgents.length,
      lightAgents: Array.from(this.agents.values()).filter(a => a.realm === 'light').length,
      shadowAgents: Array.from(this.agents.values()).filter(a => a.realm === 'shadow').length,
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'executing').length,
      completedWorkflows: workflows.filter(w => w.status === 'completed').length,
      treeBalance: treeCoordinator.getTreeHealth().trunk.balance
    };
  }

  // Message passing between agents (for future expansion)
  async sendMessage(fromAgent, toAgent, message) {
    const messageObj = {
      id: `msg_${Date.now()}`,
      from: fromAgent,
      to: toAgent,
      message,
      timestamp: new Date()
    };
    
    this.messageQueue.push(messageObj);
    this.emit('message', messageObj);
    
    return messageObj;
  }
}

// Singleton instance
export const langGraphCoordinator = new LangGraphCoordinator();
export default langGraphCoordinator;