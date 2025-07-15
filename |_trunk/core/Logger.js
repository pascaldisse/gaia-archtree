/**
 * Logger.js - Divine Logging System for Gaia Archtree
 * Centralized logging with divine intervention tracking
 */

import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DivineLogger {
  constructor() {
    this.logPath = path.join(__dirname, '../../.gaia-logs');
    this.maxLogFiles = 10;
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.levels = {
      ERROR: { value: 0, color: chalk.red, icon: '❌' },
      WARN: { value: 1, color: chalk.yellow, icon: '⚠️' },
      INFO: { value: 2, color: chalk.cyan, icon: 'ℹ️' },
      DEBUG: { value: 3, color: chalk.gray, icon: '🔍' },
      DIVINE: { value: 4, color: chalk.magenta, icon: '🔮' }
    };
    this.currentLevel = 'INFO';
    
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    try {
      await fs.ensureDir(this.logPath);
    } catch (error) {
      console.error('Failed to create log directory:', error.message);
    }
  }

  // Format log message
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const levelInfo = this.levels[level];
    
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      process: process.pid,
      memory: process.memoryUsage()
    };

    // Console output
    const consoleMsg = `${levelInfo.icon} ${timestamp} [${level}] ${message}`;
    console.log(levelInfo.color(consoleMsg));
    
    if (Object.keys(context).length > 0) {
      console.log(chalk.gray('   Context:'), context);
    }

    return logEntry;
  }

  // Write to log file
  async writeToFile(logEntry) {
    try {
      const logFile = path.join(this.logPath, `gaia-${new Date().toISOString().split('T')[0]}.log`);
      const logLine = JSON.stringify(logEntry) + '\n';
      
      await fs.appendFile(logFile, logLine);
      
      // Check file size and rotate if needed
      const stats = await fs.stat(logFile);
      if (stats.size > this.maxLogSize) {
        await this.rotateLog(logFile);
      }
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  // Rotate log files
  async rotateLog(logFile) {
    try {
      const baseName = path.basename(logFile, '.log');
      const rotatedName = `${baseName}-${Date.now()}.log`;
      const rotatedPath = path.join(this.logPath, rotatedName);
      
      await fs.move(logFile, rotatedPath);
      
      // Clean up old log files
      await this.cleanupOldLogs();
    } catch (error) {
      console.error('Failed to rotate log:', error.message);
    }
  }

  // Clean up old log files
  async cleanupOldLogs() {
    try {
      const files = await fs.readdir(this.logPath);
      const logFiles = files
        .filter(f => f.endsWith('.log'))
        .map(f => ({ name: f, path: path.join(this.logPath, f) }))
        .sort((a, b) => b.name.localeCompare(a.name));

      if (logFiles.length > this.maxLogFiles) {
        const filesToDelete = logFiles.slice(this.maxLogFiles);
        for (const file of filesToDelete) {
          await fs.remove(file.path);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error.message);
    }
  }

  // Logging methods
  error(message, context = {}) {
    const logEntry = this.formatMessage('ERROR', message, context);
    this.writeToFile(logEntry);
  }

  warn(message, context = {}) {
    const logEntry = this.formatMessage('WARN', message, context);
    this.writeToFile(logEntry);
  }

  info(message, context = {}) {
    const logEntry = this.formatMessage('INFO', message, context);
    this.writeToFile(logEntry);
  }

  debug(message, context = {}) {
    if (this.levels[this.currentLevel].value >= this.levels.DEBUG.value) {
      const logEntry = this.formatMessage('DEBUG', message, context);
      this.writeToFile(logEntry);
    }
  }

  divine(message, context = {}) {
    const logEntry = this.formatMessage('DIVINE', message, context);
    this.writeToFile(logEntry);
  }

  // Log divine intervention
  logDivineIntervention(god, task, result, realm = 'unknown') {
    this.divine(`Divine intervention: ${god} in ${realm} realm`, {
      god,
      task,
      result,
      realm,
      interventionId: `${god}_${Date.now()}`
    });
  }

  // Log evolution step
  logEvolution(mutationId, god, fitness, action) {
    this.info(`Evolution: ${action} for mutation ${mutationId}`, {
      mutationId,
      god,
      fitness,
      action,
      timestamp: new Date().toISOString()
    });
  }

  // Log authentication events
  logAuth(action, provider, success = true, error = null) {
    const level = success ? 'INFO' : 'ERROR';
    const message = `Auth ${action}: ${provider} - ${success ? 'success' : 'failed'}`;
    
    this[level.toLowerCase()](message, {
      action,
      provider,
      success,
      error: error?.message,
      authEvent: true
    });
  }

  // Set log level
  setLevel(level) {
    if (this.levels[level]) {
      this.currentLevel = level;
      this.info(`Log level set to ${level}`);
    } else {
      this.warn(`Invalid log level: ${level}`);
    }
  }

  // Get recent logs
  async getRecentLogs(lines = 100) {
    try {
      const logFile = path.join(this.logPath, `gaia-${new Date().toISOString().split('T')[0]}.log`);
      
      if (await fs.pathExists(logFile)) {
        const content = await fs.readFile(logFile, 'utf8');
        const logs = content.trim().split('\n')
          .slice(-lines)
          .map(line => {
            try {
              return JSON.parse(line);
            } catch {
              return { message: line, timestamp: new Date().toISOString() };
            }
          });
        
        return logs;
      }
      
      return [];
    } catch (error) {
      this.error('Failed to read recent logs', { error: error.message });
      return [];
    }
  }
}

// Global error handler
export const setupGlobalErrorHandling = (logger) => {
  // Uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
      fatal: true
    });
    console.error(chalk.red('💥 Fatal error occurred. Check logs for details.'));
    process.exit(1);
  });

  // Unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString()
    });
    console.error(chalk.yellow('⚠️  Unhandled promise rejection. Check logs.'));
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    console.log(chalk.cyan('\n🙏 Divine shutdown initiated. May your code rest in peace.'));
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    console.log(chalk.cyan('\n🙏 Divine termination received. Ascending to higher realms.'));
    process.exit(0);
  });
};

// Singleton instance
export const logger = new DivineLogger();
export default logger;