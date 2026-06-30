/**
 * sound.ts
 * ------------------------------------------------------------------
 * Tiny, dependency-free sound effects built on the Web Audio API.
 * No audio files to bundle or fetch — every "blip" is synthesized
 * on the fly. Effects are intentionally short and cartoonish.
 */

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedContext) sharedContext = new AudioCtx();
  return sharedContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  startGain: number,
  glideTo?: number
): void {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (glideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(glideTo, ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(startGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

/** A little "boing" when the button dodges the cursor. */
export function playDodgeSound(): void {
  playTone(320, 0.12, "triangle", 0.05, 220);
}

/** A cheerful chime when the player picks the expected (static) answer. */
export function playCorrectPathSound(): void {
  playTone(523.25, 0.15, "sine", 0.07, 783.99);
}

/** A triumphant fanfare-ish blip when the player actually catches the runaway answer. */
export function playCatchSound(): void {
  const ctx = getContext();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.18, "square", 0.05), i * 80);
  });
}

/** A soft button-press click for general UI feedback. */
export function playClickSound(): void {
  playTone(200, 0.06, "square", 0.04);
}
