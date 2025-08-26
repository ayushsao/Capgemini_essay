// Sound Service for Chatbot Effects
// Provides realistic audio feedback for chat interactions

class SoundService {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialize AudioContext only in browser environment
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext not supported:', error);
      }
    }
  }

  // Enable/disable sounds
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Create and play a popping sound effect
  async playPopSound(frequency: number = 800, duration: number = 150) {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Create envelope for pop effect
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);

      // Play sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error playing pop sound:', error);
    }
  }

  // Play message sent sound (higher pitch pop)
  async playMessageSent() {
    await this.playPopSound(900, 120);
  }

  // Play message received sound (lower pitch pop)
  async playMessageReceived() {
    await this.playPopSound(600, 180);
  }

  // Play typing indicator sound (subtle tick)
  async playTypingTick() {
    await this.playPopSound(1200, 50);
  }

  // Play notification sound (double pop)
  async playNotification() {
    await this.playPopSound(800, 100);
    setTimeout(() => this.playPopSound(1000, 100), 150);
  }

  // Play streaming chunk sound (very subtle)
  async playStreamingChunk() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Resume AudioContext if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Very subtle tick for streaming
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1400, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.03);
    } catch (error) {
      console.warn('Error playing streaming sound:', error);
    }
  }

  // Create realistic keyboard typing sounds
  async playKeyboardType() {
    const frequencies = [800, 850, 900, 950, 1000];
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    await this.playPopSound(randomFreq, 80);
  }

  // Play success sound (ascending notes)
  async playSuccess() {
    const notes = [523, 659, 784]; // C, E, G
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playPopSound(notes[i], 200), i * 150);
    }
  }

  // Play error sound (descending notes)
  async playError() {
    const notes = [784, 659, 523]; // G, E, C
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => this.playPopSound(notes[i], 250), i * 100);
    }
  }

  // Play bubble pop sound
  async playBubblePop() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Bubble pop effect with frequency sweep
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.4, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing bubble pop:', error);
    }
  }

  // Clean up resources
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Create singleton instance
export const soundService = new SoundService();

// Export individual functions for convenience
export const playPopSound = (frequency?: number, duration?: number) => 
  soundService.playPopSound(frequency, duration);

export const playMessageSent = () => soundService.playMessageSent();
export const playMessageReceived = () => soundService.playMessageReceived();
export const playTypingTick = () => soundService.playTypingTick();
export const playNotification = () => soundService.playNotification();
export const playStreamingChunk = () => soundService.playStreamingChunk();
export const playKeyboardType = () => soundService.playKeyboardType();
export const playSuccess = () => soundService.playSuccess();
export const playError = () => soundService.playError();
export const playBubblePop = () => soundService.playBubblePop();

export const setSoundEnabled = (enabled: boolean) => soundService.setEnabled(enabled);

export default soundService;
