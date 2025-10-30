const fcuk = require('./src/index.js');

console.log('🧪 Testing fcuk.js...\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Test 1: Basic encoding and decoding
test('Basic encoding and decoding', () => {
  const secret = 'hello world';
  const hash = fcuk.you({ secret });
  const decoded = fcuk.me(hash);
  
  if (typeof hash !== 'string') throw new Error('Hash should be string');
  if (hash.length !== 64) throw new Error('Default hash length should be 64');
  if (decoded !== secret) throw new Error(`Expected "${secret}", got "${decoded}"`);
});

// Test 2: Deterministic behavior
test('Deterministic behavior', () => {
  const secret = 'test123';
  const vibes = ['fcuk', '69'];
  
  const hash1 = fcuk.you({ secret, vibes });
  const hash2 = fcuk.you({ secret, vibes });
  
  if (hash1 !== hash2) throw new Error('Same inputs should produce same output');
});

// Test 3: Different secrets produce different hashes
test('Different secrets produce different hashes', () => {
  const hash1 = fcuk.you({ secret: 'secret1' });
  const hash2 = fcuk.you({ secret: 'secret2' });
  
  if (hash1 === hash2) throw new Error('Different secrets should produce different hashes');
});

// Test 4: Custom length
test('Custom hash length', () => {
  const hash = fcuk.you({ secret: 'test', sprinkles: 32 });
  
  if (hash.length !== 32) throw new Error(`Expected length 32, got ${hash.length}`);
});

// Test 5: Vibes integration
test('Vibes integration', () => {
  const vibes = ['awesome', 'cool'];
  const hash = fcuk.you({ secret: 'test', vibes });
  
  // Check if vibes characters appear in hash
  const hasVibeChars = vibes.some(vibe => 
    vibe.split('').some(char => hash.includes(char))
  );
  
  if (!hasVibeChars) throw new Error('Hash should contain some vibe characters');
});

// Test 6: Timeline functionality
test('Timeline functionality', () => {
  const { hash, timeline } = fcuk.youWithTimeline({ secret: 'test' });
  
  if (!timeline.step1_seed) throw new Error('Timeline should have step1_seed');
  if (!timeline.step7_formatted) throw new Error('Timeline should have step7_formatted');
  if (timeline.step7_formatted !== hash) throw new Error('Timeline final step should match hash');
});

// Test 7: Error handling
test('Error handling for missing secret', () => {
  try {
    fcuk.you({});
    throw new Error('Should have thrown error for missing secret');
  } catch (error) {
    if (!error.message.includes('Secret is required')) {
      throw new Error('Wrong error message');
    }
  }
});

// Test 8: Pretty print doesn't crash
test('Pretty print functionality', () => {
  const hash = fcuk.you({ secret: 'test' });
  
  // Capture console.log output
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => { output += args.join(' '); };
  
  fcuk.youPretty(hash);
  
  console.log = originalLog;
  
  if (!output.includes('Hash:')) throw new Error('Pretty print should output hash');
});

// Test 9: Long secret handling
test('Long secret handling', () => {
  const longSecret = 'a'.repeat(100);
  const hash = fcuk.you({ secret: longSecret });
  const decoded = fcuk.me(hash);
  
  if (decoded !== longSecret) throw new Error('Long secret should be encoded/decoded correctly');
});

// Test 10: Special characters in secret
test('Special characters in secret', () => {
  const secret = 'test@#$%^&*()_+-=[]{}|;:,.<>?';
  const hash = fcuk.you({ secret });
  const decoded = fcuk.me(hash);
  
  if (decoded !== secret) throw new Error('Special characters should be handled correctly');
});

console.log(`\n🏁 Tests completed: ${passed}/${total} passed`);

if (passed === total) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('💥 Some tests failed!');
  process.exit(1);
}