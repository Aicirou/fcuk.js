/**
 * fcuk.js v0.0.1
 * Deterministic hash encoding with scattered vibes
 */

class Fcuk {
  constructor() {
    this.l33tMap = {
      'o': 'O', 'i': 'I', 'e': 'E', 'a': 'A', 's': 'S', 't': 'T', 'b': 'B'
    };
  }

  // Generate seed from string
  generateSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Simple XOR encoding
  xorEncode(text, key) {
    const keyChars = key.split('').map(c => c.charCodeAt(0));
    return text.split('').map((char, i) => {
      const keyChar = keyChars[i % keyChars.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    }).join('');
  }

  // Generate random-looking hash from seed
  generateRandomHash(seed, length) {
    const chars = '0123456789abcdef';
    let result = '';
    let current = seed;
    
    for (let i = 0; i < length; i++) {
      current = (current * 1664525 + 1013904223) & 0xffffffff;
      result += chars[Math.abs(current) % chars.length];
    }
    
    return result;
  }

  // Scatter vibes into hash at deterministic positions
  scatterVibes(hash, vibes, seed) {
    if (!vibes || vibes.length === 0) return hash;
    
    let result = hash.split('');
    let current = seed;
    
    vibes.forEach(vibe => {
      const vibeChars = vibe.split('');
      vibeChars.forEach(char => {
        current = (current * 1664525 + 1013904223) & 0xffffffff;
        const pos = Math.abs(current) % result.length;
        result[pos] = char;
      });
    });
    
    return result.join('');
  }

  // Score how likely a string is to be a real secret
  scoreSecretQuality(text) {
    let score = 0;
    
    // Base score for reasonable length
    if (text.length >= 3 && text.length <= 50) score += 10;
    if (text.length > 50) score += 5; // Long secrets get some bonus but not as much
    
    // Heavy bonus for spaces (indicates real phrases/sentences)
    const spaces = (text.match(/\s/g) || []).length;
    score += spaces * 20;
    
    // Bonus for vowels (indicates real words)
    const vowels = (text.match(/[aeiouAEIOU]/g) || []).length;
    score += vowels * 2;
    
    // Bonus for letters in general
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    score += letters;
    
    // Bonus for common letter patterns
    if (/\b(the|and|for|are|but|not|you|all|can|had|her|was|one|our|out|day|get|has|him|his|how|its|may|new|now|old|see|two|way|who|boy|did|man|new|now|old|see|way|test|user|admin|password|token)\b/i.test(text)) {
      score += 25; // Common English words and tech terms
    }
    
    // Don't heavily penalize special characters - they're common in passwords/tokens
    const specialChars = (text.match(/[^\w\s]/g) || []).length;
    if (specialChars > 0 && letters > 0) score += 5; // Mixed content is good
    
    // Penalty for too many non-ASCII or control characters (indicates wrong decoding)
    const nonPrintable = (text.match(/[^\x20-\x7E]/g) || []).length;
    score -= nonPrintable * 5;
    
    // Penalty for pure repetition
    const uniqueChars = new Set(text).size;
    if (uniqueChars < Math.max(3, text.length / 5)) score -= 10;
    
    // Penalty for looking like random hex
    if (/^[0-9a-f]+$/i.test(text) && text.length > 8) score -= 15;
    
    return score;
  }

  // Apply mixed case and l33t formatting
  formatHash(hash) {
    return hash.split('').map((char, i) => {
      // Apply l33t speak
      const l33tChar = this.l33tMap[char.toLowerCase()];
      if (l33tChar) char = l33tChar;
      
      // Apply mixed case (deterministic based on position)
      if (i % 3 === 0 && /[a-z]/i.test(char)) {
        char = char.toUpperCase();
      } else if (i % 4 === 1 && /[a-z]/i.test(char)) {
        char = char.toLowerCase();
      }
      
      return char;
    }).join('');
  }

  // Main encoding function
  you(options = {}) {
    const { secret, vibes = [], sprinkles = 64 } = options;
    
    if (!secret) {
      throw new Error('Secret is required');
    }

    // Step 1: Generate deterministic seed
    const seed = this.generateSeed(secret + (vibes.join('') || ''));
    
    // Step 2: XOR encode the secret and convert to hex
    const encodedSecret = Buffer.from(this.xorEncode(secret, 'fcuk')).toString('hex');
    
    // Step 3: Generate base random hash (leave space for encoded secret at end)
    const baseLength = Math.max(sprinkles - encodedSecret.length - vibes.join('').length, 16);
    const randomHash = this.generateRandomHash(seed, baseLength);
    
    // Step 4: Append encoded secret to end for easier extraction
    const withSecret = randomHash + encodedSecret;
    
    // Step 5: Scatter vibes into the hash (but preserve secret at end)
    const secretStart = withSecret.length - encodedSecret.length;
    const hashPart = withSecret.slice(0, secretStart);
    const secretPart = withSecret.slice(secretStart);
    
    const withVibes = this.scatterVibes(hashPart, vibes, seed) + secretPart;
    
    // Step 6: Ensure exact length
    const rawHash = withVibes.slice(0, sprinkles);
    
    // Step 7: Apply formatting
    return this.formatHash(rawHash);
  }

  // Decoding function
  me(hash) {
    if (!hash) {
      throw new Error('Hash is required');
    }

    // Reverse the formatting to get closer to raw hash
    let rawHash = hash.toLowerCase();
    
    // Reverse l33t speak mapping
    Object.keys(this.l33tMap).forEach(key => {
      const l33tChar = this.l33tMap[key].toLowerCase();
      const regex = new RegExp(l33tChar, 'g');
      rawHash = rawHash.replace(regex, key);
    });

    // Find the secret by trying different hex lengths
    // Start from reasonable lengths and prioritize clean ASCII
    let bestCandidate = '';
    let bestScore = -1;
    
    // Try different hex segment lengths from the end (where we put the secret)
    for (let hexLen = 8; hexLen <= Math.min(100, rawHash.length); hexLen += 2) {
      try {
        // Extract hex from end of hash
        const hexPart = rawHash.slice(-hexLen);
        if (hexPart.match(/^[0-9a-f]+$/)) {
          const decoded = Buffer.from(hexPart, 'hex').toString();
          const unxored = this.xorEncode(decoded, 'fcuk');
          
          // Check if result looks like a valid secret (only printable ASCII)
          if (unxored.match(/^[\x20-\x7E]+$/)) {
            // Score based on likelihood of being the intended secret
            let score = 0;
            
            // Base score proportional to length (longer secrets are often more complete)
            score += unxored.length * 3;
            
            // Bonus for starting with a letter (common for real secrets)
            if (/^[a-zA-Z]/.test(unxored)) score += 20;
            
            // Bonus for containing vowels (indicates real words)
            const vowels = (unxored.match(/[aeiouAEIOU]/g) || []).length;
            score += vowels * 5;
            
            // Bonus for spaces (indicates phrases)
            const spaces = (unxored.match(/\s/g) || []).length;
            score += spaces * 15;
            
            // Bonus for mixed alphanumeric content
            const hasLetters = /[a-zA-Z]/.test(unxored);
            const hasNumbers = /[0-9]/.test(unxored);
            if (hasLetters && hasNumbers) score += 10;
            
            // Penalty for pure repetition (like "aaaa")
            const uniqueChars = new Set(unxored).size;
            if (uniqueChars < Math.max(2, unxored.length / 3)) score -= 20;
            
            if (score > bestScore) {
              bestCandidate = unxored;
              bestScore = score;
            }
          }
        }
      } catch (e) {
        // Continue trying
      }
    }
    console.log('Best score:', bestScore);
    return bestCandidate;

  }

  // Generate with timeline for debugging
  youWithTimeline(options = {}) {
    const { secret, vibes = [], sprinkles = 64 } = options;
    
    if (!secret) {
      throw new Error('Secret is required');
    }

    const timeline = {};

    // Step 1: Generate deterministic seed
    const seed = this.generateSeed(secret + (vibes.join('') || ''));
    timeline.step1_seed = seed;
    
    // Step 2: XOR encode the secret and convert to hex
    const encodedSecret = Buffer.from(this.xorEncode(secret, 'fcuk')).toString('hex');
    timeline.step2_secretEncoded = encodedSecret;
    
    // Step 3: Generate base random hash (leave space for encoded secret at end)
    const baseLength = Math.max(sprinkles - encodedSecret.length - vibes.join('').length, 16);
    const randomHash = this.generateRandomHash(seed, baseLength);
    timeline.step3_randomHash = randomHash;
    
    // Step 4: Append encoded secret to end for easier extraction
    const withSecret = randomHash + encodedSecret;
    timeline.step4_withSecret = withSecret;
    
    // Step 5: Scatter vibes into the hash (but preserve secret at end)
    const secretStart = withSecret.length - encodedSecret.length;
    const hashPart = withSecret.slice(0, secretStart);
    const secretPart = withSecret.slice(secretStart);
    
    const withVibes = this.scatterVibes(hashPart, vibes, seed) + secretPart;
    timeline.step5_vibesScattered = withVibes;
    
    // Step 6: Ensure exact length
    const rawHash = withVibes.slice(0, sprinkles);
    timeline.step6_rawHash = rawHash;
    
    // Step 7: Apply formatting
    const formatted = this.formatHash(rawHash);
    timeline.step7_formatted = formatted;

    return { hash: formatted, timeline };
  }

  // Pretty print with colors
  youPretty(hash) {
    if (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) {
      // ANSI colors for terminal
      const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m'
      };

      let coloredHash = '';
      for (let i = 0; i < hash.length; i++) {
        const char = hash[i];
        if (/[0-9]/.test(char)) {
          coloredHash += colors.cyan + char + colors.reset;
        } else if (/[A-Z]/.test(char)) {
          coloredHash += colors.yellow + char + colors.reset;
        } else if (/[a-z]/.test(char)) {
          coloredHash += colors.green + char + colors.reset;
        } else {
          coloredHash += colors.magenta + char + colors.reset;
        }
      }

      console.log(colors.bright + 'Hash: ' + colors.reset + coloredHash);
    } else {
      console.log('Hash:', hash);
    }
  }
}

// Create singleton instance
const fcuk = new Fcuk();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = fcuk;
} else if (typeof window !== 'undefined') {
  // Browser
  window.fcuk = fcuk;
}
