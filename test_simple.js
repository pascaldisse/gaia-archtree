#!/usr/bin/env node

/**
 * test_simple.js - Basic Functionality Tests
 * Simple tests for Gaia Archtree system initialization and basic operations
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import chalk from 'chalk';

// Load test configurations
const testsConfig = JSON.parse(readFileSync('./tests.json', 'utf-8'));
const simpleTests = testsConfig.tests.filter(test => test.category === 'simple');

class SimpleTester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    console.log(chalk.cyan('\n🧪 Simple Functionality Test Suite'));
    console.log(chalk.gray('=' . repeat(50)));

    for (const test of simpleTests) {
      await this.runTest(test);
    }

    this.printResults();
  }

  async runTest(test) {
    console.log(chalk.yellow(`\n📋 Test: ${test.name} (${test.id})`));
    
    try {
      let result;
      
      switch(test.id) {
        case 'simple_001':
          result = await this.testSystemInitialization(test);
          break;
        default:
          throw new Error(`Unknown test: ${test.id}`);
      }

      if (result.success) {
        this.passed++;
        console.log(chalk.green('✅ PASSED'));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.failed++;
      console.log(chalk.red(`❌ FAILED: ${error.message}`));
    }
  }

  async testSystemInitialization(test) {
    const { command } = test.input;
    
    return new Promise((resolve) => {
      const args = command.split(' ').slice(1);
      const child = spawn('node', args, { 
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'test' }
      });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        // Check for version in output
        const hasVersion = output.includes('1.0.0') || output.includes('version');
        
        // Check for required systems
        const hasGods = output.includes('god') || output.includes('pantheon');
        const hasEvolution = output.includes('evolution') || output.includes('Git Evolution');
        const hasAuth = output.includes('auth') || output.includes('Authentication');
        
        const success = hasVersion && hasGods && hasEvolution && hasAuth;
        
        resolve({
          success,
          error: !hasVersion ? 'Version not found' :
                 !hasGods ? 'Gods system not initialized' :
                 !hasEvolution ? 'Evolution system not initialized' :
                 !hasAuth ? 'Auth system not initialized' : null,
          output,
          errorOutput,
          exitCode: code
        });
      });
      
      // Send exit command after initialization
      setTimeout(() => {
        child.stdin.write('exit\n');
      }, 1000);
    });
  }

  printResults() {
    console.log(chalk.cyan('\n' + '=' . repeat(50)));
    console.log(chalk.cyan('Test Results:'));
    console.log(chalk.green(`  ✅ Passed: ${this.passed}`));
    console.log(chalk.red(`  ❌ Failed: ${this.failed}`));
    console.log(chalk.white(`  📊 Total: ${this.passed + this.failed}`));
    
    const successRate = (this.passed / (this.passed + this.failed) * 100).toFixed(1);
    console.log(chalk.magenta(`  🎯 Success Rate: ${successRate}%`));
  }
}

// Main execution
async function main() {
  try {
    const tester = new SimpleTester();
    await tester.runTests();
    
    process.exit(tester.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red('\n💥 Test suite crashed:'), error);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SimpleTester };