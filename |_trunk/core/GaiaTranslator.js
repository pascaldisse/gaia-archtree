/**
 * GaiaTranslator.js - English ↔ GaiaScript Translation System
 * Translates between English and GaiaScript using pure Chinese character encoding
 */

import chalk from 'chalk';
import { logger } from './Logger.js';

export class GaiaTranslator {
  constructor() {
    this.initializeVocabulary();
    logger.info('GaiaScript Translator initialized');
  }

  initializeVocabulary() {
    // Core Words (核心詞彙) - From CLAUDE.md
    this.coreWords = new Map([
      ['the', '的'], ['of', '之'], ['and', '和'], ['to', '至'], ['a', '一'],
      ['in', '在'], ['is', '是'], ['you', '你'], ['are', '都'], ['for', '為'],
      ['it', '它'], ['with', '與'], ['on', '上'], ['this', '這'], ['but', '但'],
      ['her', '她'], ['or', '或'], ['his', '他'], ['will', '將'], ['can', '能'],
      ['have', '有'], ['what', '所']
    ]);

    // Technical Terms (技術術語)
    this.techTerms = new Map([
      ['build', '編'], ['execution', '執'], ['commands', '令'], ['language', '語'],
      ['requirements', '需'], ['always', '總'], ['use', '用'], ['code', '碼'],
      ['style', '格'], ['guidelines', '則'], ['imports', '導'], ['formatting', '式'],
      ['naming', '名'], ['state', '狀'], ['declaration', '宣'], ['layers', '層'],
      ['error', '錯'], ['handling', '處'], ['standard', '標'], ['project', '專'],
      ['structure', '結'], ['ecosystem', '生'], ['technical', '技'], ['specification', '規'],
      ['system', '系'], ['description', '述'], ['features', '特'], ['syntax', '法'],
      ['numbers', '數'], ['operations', '操']
    ]);

    // Programming Languages (語言)
    this.languages = new Map([
      ['javascript', '語零'], ['swift', '語一'], ['python', '語二'], 
      ['gaiascript', '語三'], ['rust', '語四'], ['csharp', '語五'],
      ['c', '語六'], ['kotlin', '語七']
    ]);

    // Numbers (數字)
    this.numbers = new Map([
      ['0', '零'], ['1', '一'], ['2', '二'], ['3', '三'], ['4', '四'],
      ['5', '五'], ['6', '六'], ['7', '七'], ['8', '八'], ['9', '九']
    ]);

    // Symbols (符號)
    this.symbols = new Map([
      ['opening', '⟨'], ['closing', '⟩'], ['concatenation', '⊕'], ['flow', '→'],
      ['network', '網'], ['input', '入'], ['convolution', '卷'], ['pooling', '池'],
      ['flatten', '平'], ['dense', '密'], ['output', '出'], ['softmax', '軟']
    ]);

    // Reverse mappings for translation back
    this.reverseCore = new Map([...this.coreWords].map(([k, v]) => [v, k]));
    this.reverseTech = new Map([...this.techTerms].map(([k, v]) => [v, k]));
    this.reverseLang = new Map([...this.languages].map(([k, v]) => [v, k]));
    this.reverseNumbers = new Map([...this.numbers].map(([k, v]) => [v, k]));
  }

  // Translate English to GaiaScript
  translateToGaia(englishText) {
    logger.debug('Translating to GaiaScript', { input: englishText });
    
    let gaiaText = englishText.toLowerCase();
    
    // Replace programming languages first
    for (const [eng, gaia] of this.languages) {
      const regex = new RegExp(`\\b${eng}\\b`, 'gi');
      gaiaText = gaiaText.replace(regex, gaia);
    }
    
    // Replace technical terms
    for (const [eng, gaia] of this.techTerms) {
      const regex = new RegExp(`\\b${eng}\\b`, 'gi');
      gaiaText = gaiaText.replace(regex, gaia);
    }
    
    // Replace core words
    for (const [eng, gaia] of this.coreWords) {
      const regex = new RegExp(`\\b${eng}\\b`, 'gi');
      gaiaText = gaiaText.replace(regex, gaia);
    }
    
    // Replace numbers
    for (const [eng, gaia] of this.numbers) {
      const regex = new RegExp(`\\b${eng}\\b`, 'g');
      gaiaText = gaiaText.replace(regex, gaia);
    }
    
    logger.debug('Translation to GaiaScript complete', { output: gaiaText });
    return gaiaText;
  }

  // Translate GaiaScript back to English
  translateFromGaia(gaiaText) {
    logger.debug('Translating from GaiaScript', { input: gaiaText });
    
    let englishText = gaiaText;
    
    // Replace numbers first
    for (const [gaia, eng] of this.reverseNumbers) {
      const regex = new RegExp(gaia, 'g');
      englishText = englishText.replace(regex, eng);
    }
    
    // Replace programming languages
    for (const [gaia, eng] of this.reverseLang) {
      const regex = new RegExp(gaia, 'g');
      englishText = englishText.replace(regex, eng);
    }
    
    // Replace technical terms
    for (const [gaia, eng] of this.reverseTech) {
      const regex = new RegExp(gaia, 'g');
      englishText = englishText.replace(regex, eng);
    }
    
    // Replace core words
    for (const [gaia, eng] of this.reverseCore) {
      const regex = new RegExp(gaia, 'g');
      englishText = englishText.replace(regex, eng);
    }
    
    logger.debug('Translation from GaiaScript complete', { output: englishText });
    return englishText;
  }

  // Create GaiaScript system prompt for AI models
  createGaiaSystemPrompt() {
    return `你必須只用純中文字符編碼系統回應。用以下映射：

核心詞彙：
${Array.from(this.coreWords.entries()).map(([eng, gaia]) => `${eng} → ${gaia}`).join(', ')}

技術術語：
${Array.from(this.techTerms.entries()).map(([eng, gaia]) => `${eng} → ${gaia}`).join(', ')}

語言代碼：
${Array.from(this.languages.entries()).map(([eng, gaia]) => `${eng} → ${gaia}`).join(', ')}

數字：
${Array.from(this.numbers.entries()).map(([eng, gaia]) => `${eng} → ${gaia}`).join(', ')}

語法結構：
文⟨...⟩ = 文本值
列⟨...⟩ = 列表
物⟨name:value⟩ = 對象
函⟨name, params⟩...⟨/函⟩ = 函數
組⟨name⟩...⟨/組⟩ = 組件

只用這些字符和結構回應。不用英文。`;
  }

  // Process user input for AI interaction
  processUserInput(userInput, targetModel = 'deepseek') {
    logger.info('Processing user input for AI interaction', { 
      model: targetModel,
      inputLength: userInput.length 
    });

    // Translate user input to GaiaScript
    const gaiaInput = this.translateToGaia(userInput);
    
    // Create system prompt for the target model
    const systemPrompt = this.createGaiaSystemPrompt();
    
    return {
      systemPrompt,
      userInput: gaiaInput,
      originalInput: userInput,
      translationUsed: gaiaInput !== userInput
    };
  }

  // Process AI response back to English
  processAIResponse(aiResponse) {
    logger.info('Processing AI response from GaiaScript', {
      responseLength: aiResponse.length
    });

    // Translate back to English
    const englishResponse = this.translateFromGaia(aiResponse);
    
    return {
      originalResponse: aiResponse,
      translatedResponse: englishResponse,
      translationUsed: englishResponse !== aiResponse
    };
  }

  // Create formatted GaiaScript code block
  formatGaiaCode(englishCode, type = 'function') {
    const gaiaCode = this.translateToGaia(englishCode);
    
    switch (type) {
      case 'function':
        return `函⟨${gaiaCode}⟩⟨/函⟩`;
      case 'component':
        return `組⟨${gaiaCode}⟩⟨/組⟩`;
      case 'text':
        return `文⟨${gaiaCode}⟩`;
      case 'list':
        return `列⟨${gaiaCode}⟩`;
      case 'object':
        return `物⟨${gaiaCode}⟩`;
      default:
        return gaiaCode;
    }
  }

  // Validate GaiaScript syntax
  validateGaiaScript(gaiaText) {
    const validPatterns = [
      /文⟨[^⟩]*⟩/g,           // Text values
      /列⟨[^⟩]*⟩/g,           // Lists
      /物⟨[^⟩]*⟩/g,           // Objects
      /函⟨[^⟩]*⟩.*⟨\/函⟩/g,    // Functions
      /組⟨[^⟩]*⟩.*⟨\/組⟩/g,    // Components
      /界⟨[^⟩]*⟩.*⟨\/界⟩/g     // Main UI
    ];
    
    let isValid = false;
    const foundPatterns = [];
    
    for (const pattern of validPatterns) {
      const matches = gaiaText.match(pattern);
      if (matches) {
        isValid = true;
        foundPatterns.push(...matches);
      }
    }
    
    return {
      isValid,
      foundPatterns,
      hasChineseChars: /[\u4e00-\u9fff]/.test(gaiaText),
      hasSymbols: /[⟨⟩]/.test(gaiaText)
    };
  }

  // Get translation statistics
  getTranslationStats() {
    return {
      coreWords: this.coreWords.size,
      techTerms: this.techTerms.size,
      languages: this.languages.size,
      numbers: this.numbers.size,
      symbols: this.symbols.size,
      totalMappings: this.coreWords.size + this.techTerms.size + 
                     this.languages.size + this.numbers.size + this.symbols.size
    };
  }

  // Demo translation
  demo() {
    const examples = [
      "Build the code with JavaScript",
      "Use the system for error handling", 
      "This project has 3 features",
      "Execute the commands in Python"
    ];
    
    console.log(chalk.cyan('\n🔮 GaiaScript Translation Demo'));
    
    examples.forEach((example, i) => {
      const gaia = this.translateToGaia(example);
      const back = this.translateFromGaia(gaia);
      
      console.log(chalk.yellow(`\nExample ${i + 1}:`));
      console.log(chalk.white(`English: ${example}`));
      console.log(chalk.magenta(`GaiaScript: ${gaia}`));
      console.log(chalk.green(`Back to English: ${back}`));
    });
    
    const stats = this.getTranslationStats();
    console.log(chalk.cyan(`\n📊 Translation mappings: ${stats.totalMappings} total`));
  }
}

// Singleton instance
export const gaiaTranslator = new GaiaTranslator();
export default gaiaTranslator;