# fcuk.js v0.0.1

> Deterministic hash encoding with scattered vibes 🚀

Generate random-looking hashes with embedded secrets and custom tweaks. Everything is deterministic - no storage needed!

## Installation

```bash
npm install fcuk.js
```

## Quick Start

```javascript
import fcuk from 'fcuk.js';

// Generate hash
const hash = fcuk.you({
  secret: 'admin_access_granted',
  vibes: ['fcuk', '69', 'awesome'],
  sprinkles: 64
});

console.log(hash);
// Output: 4A7F2c9E1F2C8u9K3B4D6FcuK4a2f3b5c6d7e8f...

// Decode hash
const decoded = fcuk.me(hash);
console.log(decoded);
// Output: admin_access_granted
```

## API Reference

### fcuk.you(options)
Generate encoded hash with secret and vibes.

**Options:**
- `secret` (string, required) - The hidden payload
- `vibes` (array, optional) - Words/strings to scatter in hash
- `sprinkles` (number, optional, default: 64) - Hash length

**Returns:** Formatted hash string (mixedCase + l33t)

```javascript
const hash = fcuk.you({
  secret: 'token123',
  vibes: ['secret', 'fcuk'],
  sprinkles: 64
});
```

### fcuk.me(hash)
Decode hash back to secret.

**Parameters:**
- `hash` (string) - Encoded hash from fcuk.you()

**Returns:** Decoded secret string

```javascript
const decoded = fcuk.me(hash);
```

### fcuk.youWithTimeline(options)
Generate hash with debug timeline showing step-by-step encoding.

**Options:** Same as fcuk.you()

**Returns:** `{ hash, timeline }`

```javascript
const { hash, timeline } = fcuk.youWithTimeline({
  secret: 'data',
  vibes: ['cool']
});

console.log(timeline);
// {
//   step1_seed: 123456,
//   step2_secretEncoded: '...',
//   step3_randomHash: '...',
//   step4_vibesScattered: '...',
//   step5_rawHash: '...',
//   step6_formatted: '...'
// }
```

### fcuk.youPretty(hash)
Pretty print hash with ANSI colors to console.

```javascript
fcuk.youPretty(hash);
// Outputs colorized terminal output with highlighted vibes
```

## Features

✅ **Deterministic** - Same inputs always produce same output  
✅ **Scattered Tweaks** - Vibes are character-scattered, hard to find  
✅ **XOR Encoding** - Uses XOR cipher for encoding  
✅ **Default Formatting** - mixedCase + l33t by default  
✅ **No Storage** - Algorithm is stateless  
✅ **Browser & Node.js** - Works everywhere  

## Format Examples

**Input:**
```javascript
fcuk.you({
  secret: 'admin_access',
  vibes: ['fcuk', '69', 'awesome']
})
```

**Output (formatted with mixedCase + l33t):**
```
4A7F2c9E1F2C8u9K3B4D6F8a9S7E2c1R3e2Tfcuk4a2f3b5c6d7e8f
```

- Mixed case: `4A7F2c` vs `4a7f2c`
- l33t: `0=O, 1=I, 3=E, 4=A, 5=S, 7=T, 8=B`
- XOR encoded secret after `fcuk`

## Use Cases

- 🎮 Game token generation with easter eggs
- 🔐 Obfuscated user tokens (NOT for encryption)
- 🎨 Creative URL/ID generation
- 🎯 Puzzle/game mechanics
- 🕵️ Hidden message encoding

## Browser Usage

```html
<script src="https://unpkg.com/fcuk.js@0.0.1/dist/fcuk.min.js"></script>
<script>
  const hash = fcuk.you({ secret: 'hello' });
  console.log(hash);
</script>
```

## Not For Cryptography

⚠️ This library is for **obfuscation only**, not encryption. Do not use for securing sensitive data or passwords.

## License

MIT - Feel free to use and modify!

## Contributing

Issues and PRs welcome at https://github.com/yourusername/fcuk.js

---

Made with 💀 and chaos