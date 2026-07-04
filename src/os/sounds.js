/**
 * @fileId 75e29489-901d-4e61-a3f7-ff45acd3313d
 * @module CivicOS/src/os/sounds.js
 * @description WebAudio UI sounds — window open/close beeps, lazy AudioContext.
 */

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctx();
  }
  return audioContext;
}

function playTone(freqFrom, freqTo, volume) {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(freqFrom, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(freqTo, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime((volume / 100) * 0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.08);
  } catch { /* AudioContext unavailable */ }
}

export function playOpenBeep(volume) {
  playTone(523, 659, volume);
}

export function playCloseBeep(volume) {
  playTone(659, 523, volume);
}
