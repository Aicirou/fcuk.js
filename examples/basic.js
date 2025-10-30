const fcuk = require('../src/index.js');

// Example 1: Basic encoding
console.log('=== Basic Encoding ===');
const hash1 = fcuk.you({
  secret: 'admin_access_granted',
  vibes: ['fcuk', '69', 'secret'],
  sprinkles: 64
});
console.log('Hash:', hash1);
console.log('Decoded:', fcuk.me(hash1));

// Example 2: With timeline
console.log('\n=== With Timeline ===');
const { hash: hash2, timeline } = fcuk.youWithTimeline({
  secret: 'user:12345',
  vibes: ['awesome', 'cool']
});
console.log('Hash:', hash2);
console.log('Timeline:', timeline);

// Example 3: Pretty print
console.log('\n=== Pretty Print ===');
fcuk.youPretty(hash2);

// Example 4: Different secrets
console.log('\n=== Multiple Secrets ===');
['token1', 'token2', 'token3'].forEach(secret => {
  const h = fcuk.you({ secret, vibes: ['test'] });
  console.log(`${secret} => ${h}`);
});

/* Expected Output:

=== Basic Encoding ===
Hash: 94BEc0FE9CT6ReES07071802083C1408050606183904070A0817100f
Decoded: admin_access_granted

=== With Timeline ===
Hash: 7afC5oB0mO74E6d8761clEB01e9A3aOc9131010195C5247585256
Timeline: {
  step1_seed: 1478830056,
  step2_secretEncoded: '131010195c5247585256',
  step3_randomHash: '7afc5eb01e74d6d8761cbeb01e943ad89',
  step4_withSecret: '7afc5eb01e74d6d8761cbeb01e943ad89131010195c5247585256',
  step5_vibesScattered: '7afc5ob0mo74e6d8761cleb01e9a3aoc9131010195c5247585256',
  step6_rawHash: '7afc5ob0mo74e6d8761cleb01e9a3aoc9131010195c5247585256',
  step7_formatted: '7afC5oB0mO74E6d8761clEB01e9A3aOc9131010195C5247585256'
}

=== Pretty Print ===
Hash: 7afC5oB0mO74E6d8761clEB01e9A3aOc9131010195C5247585256

=== Multiple Secrets ===
token1 => 14T2Bs127Cd6389AftBEB01E7cdAd896fC52E01E94DA3896120C1e0E0852
token2 => Eb0FE9CdA389AfcTS501E7cd6d8E61TBEB0129cDA3896145120C1e0E0851
token3 => BeB0fe94dAd87af4BeB0f274363S9aFcT250Fe9C36DT9AEc120C1e0E0850

*/
