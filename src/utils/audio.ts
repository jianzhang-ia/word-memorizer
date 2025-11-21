// Professional audio manager using Web Audio API
// Generates rich, satisfying sound effects for the word memorizer app

class AudioManager {
    private ctx: AudioContext | null = null;

    private getContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.ctx;
    }

    /**
     * Initialize audio context on first user interaction
     * Required for mobile browsers
     */
    initialize() {
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {
            // Ignore errors during initialization
        }
    }

    /**
     * Play a crisp, mechanical typewriter key sound
     * Multi-layered for richness
     */
    playKeySound() {
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            // Create multiple oscillators for a richer sound
            const now = ctx.currentTime;

            // Main click
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(800, now);
            osc1.frequency.exponentialRampToValueAtTime(200, now + 0.03);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.03);

            // Harmonic layer
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1200, now);
            osc2.frequency.exponentialRampToValueAtTime(300, now + 0.02);
            gain2.gain.setValueAtTime(0.04, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.02);
        } catch (e) {
            // Silently fail if audio context unavailable
        }
    }

    /**
     * Play a celebratory success sound
     * Upward arpeggio with warm tones
     */
    playSuccessSound() {
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)

            notes.forEach((freq, i) => {
                const startTime = now + (i * 0.08);

                // Main tone
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.4);

                // Harmonic richness
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();

                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(freq * 2, startTime);

                gain2.gain.setValueAtTime(0, startTime);
                gain2.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
                gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                osc2.connect(gain2);
                gain2.connect(ctx.destination);

                osc2.start(startTime);
                osc2.stop(startTime + 0.3);
            });
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Play a gentle error sound
     * Brief descending tone, informative not harsh
     */
    playErrorSound() {
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            // Main error tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);

            // Subtle low frequency for texture
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(180, now);
            osc2.frequency.linearRampToValueAtTime(100, now + 0.12);

            gain2.gain.setValueAtTime(0.06, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc2.start(now);
            osc2.stop(now + 0.12);
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Play a subtle mode switch/transition sound
     * Gentle frequency sweep
     */
    playModeSwitchSound() {
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {
            // Silently fail
        }
    }
}

export const audioManager = new AudioManager();
