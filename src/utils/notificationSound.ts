// Web Audio API synthesizer for real-time notification alerts
class NotificationSoundEngine {
  private audioCtx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx && AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  // Play a modern, crystal-clear social notification chime
  public playChime(type: 'like' | 'friend' | 'community' | 'default' = 'default') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);

      if (type === 'like') {
        // High, joyful double-ping for likes
        this.playTone(ctx, gainNode, 659.25, now, 0.14, 0.18); // E5
        this.playTone(ctx, gainNode, 880.00, now + 0.08, 0.22, 0.2); // A5
      } else if (type === 'friend') {
        // Welcoming friendly chord for friend requests
        this.playTone(ctx, gainNode, 523.25, now, 0.16, 0.2); // C5
        this.playTone(ctx, gainNode, 659.25, now + 0.07, 0.18, 0.2); // E5
        this.playTone(ctx, gainNode, 783.99, now + 0.14, 0.25, 0.22); // G5
      } else if (type === 'community') {
        // Rich, energetic triple-chime for community interactions
        this.playTone(ctx, gainNode, 587.33, now, 0.15, 0.18); // D5
        this.playTone(ctx, gainNode, 739.99, now + 0.09, 0.18, 0.2); // F#5
        this.playTone(ctx, gainNode, 880.00, now + 0.18, 0.25, 0.22); // A5
      } else {
        // Standard notification
        this.playTone(ctx, gainNode, 587.33, now, 0.15, 0.2);
        this.playTone(ctx, gainNode, 880.00, now + 0.09, 0.24, 0.2);
      }
    } catch (e) {
      // Audio autoplay policy catch - fails gracefully without interrupting UI
    }
  }

  private playTone(
    ctx: AudioContext,
    masterGain: GainNode,
    freq: number,
    startTime: number,
    duration: number,
    volume: number
  ) {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Smooth envelope attack and exponential decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const notificationAudio = new NotificationSoundEngine();
