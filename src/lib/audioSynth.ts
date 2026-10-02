/**
 * Web Audio API Synthesizer & Sound Effects Generator
 * Enables full audio playback for music quiz challenges and UI interactions without requiring external mp3 files.
 */

class SoundController {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private isMuted: boolean = false
  private currentMelodyStop: (() => void) | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.12
    }
    if (this.isMuted && this.currentMelodyStop) {
      this.currentMelodyStop()
    }
    return this.isMuted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  // Play simple UI tone (hover/click)
  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.12, gainValue: number = 0.08) {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(gainValue, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio context may not be allowed before user interaction
    }
  }

  // Play UI Sound FX
  public playClick() {
    this.playTone(880, 'sine', 0.08, 0.06)
  }

  public playHover() {
    this.playTone(587.33, 'triangle', 0.06, 0.03)
  }

  public playSuccess() {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.35, 0.1)
      }, idx * 80)
    })
  }

  public playError() {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [370, 311.13] // F#4 -> Eb4
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.25, 0.08)
      }, idx * 120)
    })
  }

  public playVinylDrop() {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      // Low rumble + sweep
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.5)
    } catch {
      // Ignore
    }
  }

  // Stop any active melody playback
  public stopMelody() {
    if (this.currentMelodyStop) {
      this.currentMelodyStop()
      this.currentMelodyStop = null
    }
  }

  // Play synthesized melody sequences for the music quiz
  public playSongMelody(melodyNotes: { note: number; dur: number; type?: OscillatorType }[], onFinish?: () => void) {
    if (this.isMuted) {
      if (onFinish) onFinish()
      return
    }

    this.stopMelody()

    const ctx = this.getContext()
    if (!ctx) {
      if (onFinish) onFinish()
      return
    }

    let isCancelled = false
    const activeOscillators: OscillatorNode[] = []

    let accumulatedTime = 0

    melodyNotes.forEach((item) => {
      const startTime = ctx.currentTime + accumulatedTime
      const duration = item.dur

      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.type = item.type || 'triangle'
        osc.frequency.setValueAtTime(item.note, startTime)

        // Subtle low-pass warm filter
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2200, startTime)

        // Envelope: quick attack, sustained body, decay
        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03)
        gain.gain.setValueAtTime(0.12, startTime + duration * 0.8)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + duration)

        activeOscillators.push(osc)
      } catch {
        // Safe catch
      }

      accumulatedTime += duration
    })

    const timerId = setTimeout(() => {
      if (!isCancelled && onFinish) {
        onFinish()
      }
    }, accumulatedTime * 1000 + 100)

    this.currentMelodyStop = () => {
      isCancelled = true
      clearTimeout(timerId)
      activeOscillators.forEach((osc) => {
        try {
          osc.stop()
        } catch {
          // Ignore
        }
      })
    }
  }
}

export const sound = new SoundController()
