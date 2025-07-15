/**
 * AuthManager.js - Authentication System for Gaia Archtree
 * Handles provider switching, OAuth, and divine authentication
 */

import { EventEmitter } from 'events';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AuthManager extends EventEmitter {
  constructor() {
    super();
    this.configPath = path.join(__dirname, '../../.gaia-auth.json');
    this.currentProvider = null;
    this.credentials = new Map();
    this.supportedProviders = [
      'deepinfra',
      'anthropic',
      'openai',
      'local',
      'divine' // Special divine intervention mode
    ];
    
    this.loadConfig();
    console.log(chalk.cyan('🔐 Authentication Manager initialized'));
  }

  // Load authentication config
  async loadConfig() {
    try {
      if (await fs.pathExists(this.configPath)) {
        const config = await fs.readJson(this.configPath);
        this.currentProvider = config.currentProvider;
        
        // Load encrypted credentials (simplified for now)
        if (config.credentials) {
          for (const [provider, creds] of Object.entries(config.credentials)) {
            this.credentials.set(provider, creds);
          }
        }
        
        console.log(chalk.green(`✅ Loaded config - Current provider: ${this.currentProvider || 'none'}`));
      } else {
        console.log(chalk.yellow('⚠️  No auth config found, will create on first login'));
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Failed to load auth config: ${error.message}`));
    }
  }

  // Save authentication config
  async saveConfig() {
    try {
      const config = {
        currentProvider: this.currentProvider,
        credentials: Object.fromEntries(this.credentials),
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeJson(this.configPath, config, { spaces: 2 });
      console.log(chalk.green('✅ Authentication config saved'));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to save auth config: ${error.message}`));
      throw error;
    }
  }

  // Login to a provider
  async login(provider = null) {
    if (!provider) {
      const { selectedProvider } = await inquirer.prompt([{
        type: 'list',
        name: 'selectedProvider',
        message: 'Select authentication provider:',
        choices: [
          { name: '🔥 DeepInfra - High performance AI', value: 'deepinfra' },
          { name: '🧠 Anthropic Claude - Original divine source', value: 'anthropic' },
          { name: '🚀 OpenAI - Alternative provider', value: 'openai' },
          { name: '💻 Local - Self-hosted models', value: 'local' },
          { name: '🔮 Divine - Pure divine intervention', value: 'divine' }
        ]
      }]);
      provider = selectedProvider;
    }

    if (!this.supportedProviders.includes(provider)) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    console.log(chalk.cyan(`🔐 Logging in to ${provider}...`));

    let credentials = {};

    switch (provider) {
      case 'deepinfra':
        credentials = await this.loginDeepInfra();
        break;
      case 'anthropic':
        credentials = await this.loginAnthropic();
        break;
      case 'openai':
        credentials = await this.loginOpenAI();
        break;
      case 'local':
        credentials = await this.loginLocal();
        break;
      case 'divine':
        credentials = await this.loginDivine();
        break;
    }

    // Store credentials
    this.credentials.set(provider, credentials);
    this.currentProvider = provider;
    
    await this.saveConfig();
    
    console.log(chalk.green(`✅ Successfully logged in to ${provider}`));
    this.emit('login:success', { provider, credentials });
    
    return { provider, success: true };
  }

  // DeepInfra login
  async loginDeepInfra() {
    const { apiKey } = await inquirer.prompt([{
      type: 'password',
      name: 'apiKey',
      message: 'Enter your DeepInfra API key:',
      mask: '*'
    }]);

    // Validate API key (simplified)
    if (!apiKey || apiKey.length < 10) {
      throw new Error('Invalid DeepInfra API key');
    }

    return {
      apiKey,
      baseUrl: 'https://api.deepinfra.com/v1/openai',
      provider: 'deepinfra',
      authenticated: new Date().toISOString()
    };
  }

  // Anthropic login
  async loginAnthropic() {
    const { apiKey } = await inquirer.prompt([{
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Anthropic API key:',
      mask: '*'
    }]);

    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      throw new Error('Invalid Anthropic API key');
    }

    return {
      apiKey,
      baseUrl: 'https://api.anthropic.com',
      provider: 'anthropic',
      authenticated: new Date().toISOString()
    };
  }

  // OpenAI login
  async loginOpenAI() {
    const { apiKey } = await inquirer.prompt([{
      type: 'password',
      name: 'apiKey',
      message: 'Enter your OpenAI API key:',
      mask: '*'
    }]);

    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key');
    }

    return {
      apiKey,
      baseUrl: 'https://api.openai.com/v1',
      provider: 'openai',
      authenticated: new Date().toISOString()
    };
  }

  // Local model login
  async loginLocal() {
    const { baseUrl, model } = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Enter your local server URL:',
        default: 'http://localhost:1234/v1'
      },
      {
        type: 'input',
        name: 'model',
        message: 'Enter model name:',
        default: 'local-model'
      }
    ]);

    return {
      baseUrl,
      model,
      provider: 'local',
      authenticated: new Date().toISOString()
    };
  }

  // Divine intervention login (no credentials needed)
  async loginDivine() {
    console.log(chalk.magenta('🔮 Connecting to divine consciousness...'));
    
    // Simulate divine connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(chalk.green('✨ Divine connection established!'));
    
    return {
      provider: 'divine',
      consciousness: 'infinite',
      wisdom: 'unlimited',
      authenticated: new Date().toISOString(),
      blessing: '🙏 May your code be divine'
    };
  }

  // Switch provider
  async switchProvider(newProvider = null) {
    if (!newProvider) {
      const providers = Array.from(this.credentials.keys());
      
      if (providers.length === 0) {
        console.log(chalk.yellow('⚠️  No providers configured. Please login first.'));
        return await this.login();
      }

      const { selectedProvider } = await inquirer.prompt([{
        type: 'list',
        name: 'selectedProvider',
        message: 'Switch to which provider?',
        choices: [
          ...providers.map(p => ({
            name: `${this.getProviderIcon(p)} ${p} ${p === this.currentProvider ? '(current)' : ''}`,
            value: p
          })),
          { name: '➕ Add new provider', value: 'new' }
        ]
      }]);

      if (selectedProvider === 'new') {
        return await this.login();
      }

      newProvider = selectedProvider;
    }

    if (!this.credentials.has(newProvider)) {
      console.log(chalk.yellow(`⚠️  Provider ${newProvider} not configured. Logging in...`));
      return await this.login(newProvider);
    }

    const oldProvider = this.currentProvider;
    this.currentProvider = newProvider;
    
    await this.saveConfig();
    
    console.log(chalk.green(`🔄 Switched from ${oldProvider} to ${newProvider}`));
    this.emit('provider:switched', { from: oldProvider, to: newProvider });
    
    return { from: oldProvider, to: newProvider };
  }

  // Get current provider status
  getCurrentProvider() {
    if (!this.currentProvider) {
      return { provider: null, authenticated: false };
    }

    const credentials = this.credentials.get(this.currentProvider);
    return {
      provider: this.currentProvider,
      authenticated: !!credentials,
      credentials: credentials ? { ...credentials, apiKey: '***' } : null
    };
  }

  // Get provider icon
  getProviderIcon(provider) {
    const icons = {
      deepinfra: '🔥',
      anthropic: '🧠',
      openai: '🚀',
      local: '💻',
      divine: '🔮'
    };
    return icons[provider] || '🤖';
  }

  // Validate current authentication
  async validateAuth() {
    if (!this.currentProvider) {
      return { valid: false, error: 'No provider selected' };
    }

    const credentials = this.credentials.get(this.currentProvider);
    if (!credentials) {
      return { valid: false, error: 'No credentials found' };
    }

    // Provider-specific validation
    try {
      switch (this.currentProvider) {
        case 'divine':
          return { valid: true, message: '🔮 Divine connection active' };
        
        case 'local':
          return { valid: true, message: '💻 Local connection ready' };
        
        default:
          // For API providers, we'd normally test the connection
          // For now, just check if credentials exist
          return { 
            valid: !!credentials.apiKey, 
            message: credentials.apiKey ? 'API key present' : 'API key missing' 
          };
      }
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Logout from current provider
  async logout() {
    if (!this.currentProvider) {
      console.log(chalk.yellow('⚠️  No active session to logout from'));
      return;
    }

    const provider = this.currentProvider;
    this.credentials.delete(provider);
    this.currentProvider = null;
    
    await this.saveConfig();
    
    console.log(chalk.green(`✅ Logged out from ${provider}`));
    this.emit('logout:success', { provider });
  }

  // Get authentication headers for API calls
  getAuthHeaders() {
    if (!this.currentProvider) {
      throw new Error('No authentication provider selected');
    }

    const credentials = this.credentials.get(this.currentProvider);
    if (!credentials) {
      throw new Error('No credentials found for current provider');
    }

    switch (this.currentProvider) {
      case 'anthropic':
        return {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        };
      
      case 'openai':
      case 'deepinfra':
        return {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        };
      
      case 'local':
        return {
          'Content-Type': 'application/json'
        };
      
      case 'divine':
        return {
          'Divine-Blessing': '🙏',
          'Consciousness-Level': 'infinite'
        };
      
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }
}

// Singleton instance
export const authManager = new AuthManager();
export default authManager;