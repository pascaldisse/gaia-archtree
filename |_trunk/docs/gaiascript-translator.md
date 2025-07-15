# GaiaScript Translator Documentation

## Overview

The GaiaScript Translator is a bidirectional translation system that converts between English input and GaiaScript's ultra-compact encoding format. This system enables seamless interaction with GaiaScript while maintaining maximum token efficiency for AI processing.

## Architecture

### Core Translation Engine

The translator operates on three primary layers:

1. **Lexical Analysis Layer**: Tokenizes input and identifies translatable elements
2. **Semantic Mapping Layer**: Maps concepts between English and GaiaScript encodings
3. **Syntax Transformation Layer**: Applies structural transformations and formatting

### Translation Modes

#### English → GaiaScript (Compress Mode)
- Input: Natural English text or code
- Output: Ultra-compact GaiaScript encoding
- Primary use: User input compression for AI processing

#### GaiaScript → English (Expand Mode)
- Input: GaiaScript encoded content
- Output: Human-readable English equivalent
- Primary use: AI output translation for user consumption

## Translation Patterns

### Word-Level Translation

#### Common Words (w₀-w₁₉)
```
English → GaiaScript Mapping:
the     → w₀  (的)
of      → w₁  (之)
and     → w₂  (和)
to      → w₃  (至)
a       → w₄  (一)
in      → w₅  (在)
is      → w₆  (是)
you     → w₇  (你)
are     → w₈  (都)
for     → w₉  (為)
it      → w₁₀ (它)
with    → w₁₁ (與)
on      → w₁₂ (上)
this    → w₁₃ (這)
but     → w₁₄ (但)
her     → w₁₅ (她)
or      → w₁₆ (或)
his     → w₁₇ (他)
she     → w₁₈ (她)
will    → w₁₉ (將)
```

### Language Encoding
```
JavaScript → l₀ (語零, 脚本, 📜)
Swift      → l₁ (語一, 迅, 🦅)
Python     → l₂ (語二, 蟒, 🐍)
GaiaScript → l₃ (語三, 蓋, 🌍)
Rust       → l₄ (語四, 錆, 🦀)
C#         → l₅ (語五, 尖, #️⃣)
C          → l₆ (語六, 基, 🔢)
Kotlin     → l₇ (語七, 科, ☕)
```

### Number Encoding
```
0 → ⊹    5 → ⌓
1 → ⊿    6 → ⌗
2 → ⋮    7 → ⊥
3 → ⋰    8 → ⊢
4 → ⋱    9 → ⊧
```

### Structural Elements

#### Container Structures
```
English Pattern → GaiaScript Format
Text content    → T⟨...⟩
List/Array      → L⟨...⟩
Object/Dict     → O⟨...⟩
Documentation   → D⟨...⟩
Imports         → N⟨...⟩
State           → S⟨...⟩
Function        → F⟨...⟩⟨...⟨/F⟩
Component       → C⟨...⟩⟨...⟨/C⟩
UI Application  → UI⟨✱⟩...⟨/UI⟩
Styled Element  → □{...}⟦...⟧
```

### UI Element Translation

#### Property Mapping
```
English Property    → GaiaScript Symbol
display            → 📏
alignItems         → 📐
padding            → 🛑
border             → 🧱
backgroundColor    → 🎨
cursor             → 👆
position           → 📌
width              → 📏
height             → 📐
fontSize           → 📝📏
color              → 🎨
hover              → 👆🎯
fontFamily         → 🔠
borderRadius       → 🔘
```

#### Element Mapping
```
English Element    → GaiaScript Symbol
container          → 📦
title/label        → 📋
icon               → 🔍
button             → 🔘
input              → 📝
link               → 🔗
click handler      → 🖱️
close handler      → 🚫
```

## Translation Examples

### Example 1: Simple Function
**English Input:**
```javascript
function calculate(a, b) {
  return a + b;
}
```

**GaiaScript Output:**
```gaia
F⟨計算, 甲, 乙⟩⟨
  w₁₂７ 甲 + 乙;
⟨/F⟩
```

### Example 2: Component Definition
**English Input:**
```javascript
const Button = ({label, onClick}) => {
  return <button onClick={onClick}>{label}</button>;
};
```

**GaiaScript Output:**
```gaia
C⟨🔘⟩⟨
  props:⟨
    📋: "",
    🖱️: null
  ⟩,
  render:⟨
    □{onClick: 🖱️}⟦${📋}⟧
  ⟩
⟨/C⟩
```

### Example 3: State Management
**English Input:**
```javascript
const state = {
  user: "John",
  count: 5,
  isActive: true
};
```

**GaiaScript Output:**
```gaia
S⟨
  👤: "John",
  計數: ⌓,
  活躍: true
⟩
```

## Translation Algorithms

### Compression Algorithm (English → GaiaScript)

1. **Tokenization Phase**
   ```
   Input: "function calculate(a, b) { return a + b; }"
   Tokens: ["function", "calculate", "(", "a", ",", "b", ")", "{", "return", "a", "+", "b", ";", "}"]
   ```

2. **Pattern Recognition Phase**
   ```
   Identify: Function declaration pattern
   Extract: name="calculate", params=["a", "b"], body="return a + b;"
   ```

3. **Symbol Substitution Phase**
   ```
   "function" → F⟨...⟩⟨...⟨/F⟩ structure
   "a", "b" → 甲, 乙 (parameter names)
   "return" → w₁₂７ (return keyword)
   ```

4. **Structure Generation Phase**
   ```
   Output: F⟨計算, 甲, 乙⟩⟨w₁₂７ 甲 + 乙;⟨/F⟩
   ```

### Expansion Algorithm (GaiaScript → English)

1. **Structure Parsing Phase**
   ```
   Input: "F⟨計算, 甲, 乙⟩⟨w₁₂７ 甲 + 乙;⟨/F⟩"
   Parse: Function structure with name="計算", params=["甲", "乙"]
   ```

2. **Symbol Lookup Phase**
   ```
   F⟨...⟩ → function declaration
   w₁₂７ → "return"
   甲, 乙 → "a", "b"
   ```

3. **Reconstruction Phase**
   ```
   Generate: "function calculate(a, b) { return a + b; }"
   ```

## API Reference

### Core Translator Class

```javascript
class GaiaScriptTranslator {
  // Main translation methods
  englishToGaia(input: string): string
  gaiaToEnglish(input: string): string
  
  // Utility methods
  compressWords(text: string): string
  expandWords(text: string): string
  translateStructure(structure: Object): Object
  
  // Configuration
  setLanguageTarget(language: string): void
  enableEmojis(enabled: boolean): void
  setCompressionLevel(level: number): void
}
```

### Translation Options

```javascript
interface TranslationOptions {
  preserveComments: boolean;     // Keep original comments
  useEmojis: boolean;           // Use emoji representations
  compressionLevel: number;     // 1-10, higher = more compact
  targetLanguage: string;       // Output language preference
  preserveVariableNames: boolean; // Keep original variable names
}
```

## Integration Examples

### CLI Usage
```bash
# Translate English to GaiaScript
gaia-translate --mode=compress --input="function hello() { return 'world'; }"

# Translate GaiaScript to English
gaia-translate --mode=expand --input="F⟨你好⟩⟨w₁₂７ 'world';⟨/F⟩"

# Batch file translation
gaia-translate --mode=compress --file=input.js --output=output.gaia
```

### API Integration
```javascript
import { GaiaScriptTranslator } from '@gaia/translator';

const translator = new GaiaScriptTranslator({
  useEmojis: true,
  compressionLevel: 8
});

// Real-time translation
const compressed = translator.englishToGaia(userInput);
const expanded = translator.gaiaToEnglish(aiResponse);
```

### Web Interface Integration
```javascript
// Real-time bidirectional editor
class GaiaEditor {
  constructor() {
    this.translator = new GaiaScriptTranslator();
    this.setupSyncedEditors();
  }
  
  setupSyncedEditors() {
    this.englishEditor.onInput((text) => {
      const gaia = this.translator.englishToGaia(text);
      this.gaiaEditor.setValue(gaia);
    });
    
    this.gaiaEditor.onInput((text) => {
      const english = this.translator.gaiaToEnglish(text);
      this.englishEditor.setValue(english);
    });
  }
}
```

## Performance Considerations

### Token Efficiency
- Average compression ratio: 60-80% reduction in token count
- Kanji characters provide semantic density
- Emoji symbols offer visual recognition
- Symbol-based encoding minimizes parsing overhead

### Translation Speed
- Lexical analysis: O(n) where n = input length
- Pattern matching: O(log m) where m = pattern count
- Symbol substitution: O(1) lookup time
- Overall complexity: O(n log m)

### Memory Usage
- Dictionary size: ~50KB for core mappings
- Symbol tables: ~20KB for structural elements
- Runtime overhead: <1MB for full translator instance

## Error Handling

### Common Translation Errors
1. **Unmapped Symbols**: When input contains unrecognized patterns
2. **Structure Mismatch**: When GaiaScript structure is malformed
3. **Context Ambiguity**: When multiple translations are possible

### Error Recovery Strategies
```javascript
class TranslationError extends Error {
  constructor(message, context, suggestions) {
    super(message);
    this.context = context;
    this.suggestions = suggestions;
  }
}

// Usage
try {
  const result = translator.englishToGaia(input);
} catch (error) {
  if (error instanceof TranslationError) {
    console.log('Translation failed:', error.message);
    console.log('Context:', error.context);
    console.log('Suggestions:', error.suggestions);
  }
}
```

## Future Enhancements

### Planned Features
1. **AI-Assisted Translation**: Context-aware semantic translation
2. **Custom Dictionary Support**: User-defined symbol mappings
3. **Syntax Highlighting**: Real-time visual feedback
4. **Translation Confidence Scoring**: Quality metrics for translations
5. **Batch Processing**: High-performance bulk translation
6. **Plugin Architecture**: Extensible translation modules

### Language Extensions
- Support for additional programming languages
- Domain-specific vocabularies (math, science, business)
- Regional emoji variations
- Cultural context adaptations

## Contributing

### Translation Dictionary Updates
Contributors can extend the translation dictionaries by:
1. Adding new word mappings to `dictionaries/words.json`
2. Defining structural patterns in `patterns/structures.json`
3. Contributing emoji mappings in `symbols/emojis.json`

### Testing Translation Accuracy
```javascript
// Test framework integration
describe('GaiaScript Translation', () => {
  test('English function to GaiaScript', () => {
    const input = 'function test() { return true; }';
    const expected = 'F⟨測試⟩⟨w₁₂７ true;⟨/F⟩';
    expect(translator.englishToGaia(input)).toBe(expected);
  });
});
```

This translator system enables seamless bidirectional communication between human-readable English and ultra-compact GaiaScript, optimizing for both human comprehension and AI token efficiency.