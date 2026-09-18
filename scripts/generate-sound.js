const fs = require('fs');
const path = require('path');

function createKeyClickWav(outputPath) {
  const sampleRate = 44100;
  const duration = 0.055; // 55ms
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk 1 size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate (sampleRate * numChannels * bitsPerSample/8)
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Envelope
    const clickEnv = Math.exp(-t / 0.004); // high transient click decays in 4ms
    const bodyEnv = Math.exp(-t / 0.018);  // body thock decays in 18ms
    
    // Click component: noise + high transient
    const noise = (Math.random() * 2 - 1) * clickEnv * 0.35;
    const clickFreq = 3400;
    const click = Math.sin(2 * Math.PI * clickFreq * t) * clickEnv * 0.45;
    
    // Thock component: pitch drop from 520Hz down to 280Hz
    const currentFreq = 280 + (520 - 280) * Math.exp(-t / 0.01);
    const thock = Math.sin(2 * Math.PI * currentFreq * t) * bodyEnv * 0.55;
    
    // Combined
    let sample = (noise + click + thock);
    // Soft clip
    sample = Math.max(-1, Math.min(1, sample));
    
    // Scale to 16-bit signed int
    const intVal = Math.round(sample * 32767 * 0.95);
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated ${outputPath} (${buffer.length} bytes)`);
}

createKeyClickWav(path.join(__dirname, '..', 'assets', 'sounds', 'keyclick.wav'));
