import { useState, useRef, useCallback, useEffect } from 'react'

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused'

export interface AudioPlayerResult {
  state: PlaybackState
  play: (audioData: string, contentType: string) => Promise<void>
  playBlob: (blob: Blob) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  progress: number // 0-1
  error: string | null
  unlockAudio: () => Promise<void> // Call on user interaction to unlock iOS audio
}

// Shared audio context for iOS unlock
let audioUnlocked = false

// Unlock audio playback on iOS - must be called from a user gesture
export async function unlockIOSAudio(): Promise<void> {
  if (audioUnlocked) {
    console.log('[AudioPlayer] Audio already unlocked')
    return
  }

  console.log('[AudioPlayer] Attempting to unlock iOS audio...')

  try {
    // Method 1: Use AudioContext with a silent oscillator
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioContextClass()

    // Create a silent oscillator and play it briefly
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    gainNode.gain.value = 0 // Silent
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.start(0)
    oscillator.stop(ctx.currentTime + 0.001) // Stop after 1ms

    // Resume if suspended
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    // Method 2: Also try with Audio element as backup
    const audio = new Audio()
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    // Create a tiny valid WAV file (silence, 1 sample)
    const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
    audio.src = silentWav
    audio.volume = 0

    try {
      await audio.play()
      audio.pause()
    } catch {
      // Ignore errors from Audio element method
      console.log('[AudioPlayer] Audio element method failed, but AudioContext may have worked')
    }

    audioUnlocked = true
    console.log('[AudioPlayer] iOS audio unlocked successfully')
  } catch (e) {
    console.warn('[AudioPlayer] Failed to unlock iOS audio:', e)
    // Still mark as attempted to avoid retry spam
    audioUnlocked = true
  }
}

export function useAudioPlayer(onPlaybackEnded?: () => void): AudioPlayerResult {
  const onPlaybackEndedRef = useRef(onPlaybackEnded)
  onPlaybackEndedRef.current = onPlaybackEnded
  const [state, setState] = useState<PlaybackState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setProgress(0)
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const playBlob = useCallback(
    async (blob: Blob) => {
      cleanup()
      setError(null)
      setState('loading')

      console.log('[AudioPlayer] Playing blob, size:', blob.size, 'type:', blob.type)

      try {
        const url = URL.createObjectURL(blob)
        urlRef.current = url

        const audio = new Audio(url)
        audioRef.current = audio

        // iOS Safari requires user interaction for autoplay
        // Set up attributes to maximize compatibility
        audio.setAttribute('playsinline', 'true')
        audio.setAttribute('webkit-playsinline', 'true')

        // Use canplaythrough for better iOS compatibility
        const playPromise = new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => {
            console.log('[AudioPlayer] Audio ready, attempting play...')
            setState('playing')
            // Play immediately when ready - this works better on iOS
            audio.play()
              .then(() => {
                console.log('[AudioPlayer] Playback started successfully')
                resolve()
              })
              .catch((playError) => {
                console.warn('[AudioPlayer] Autoplay blocked:', playError)
                // On iOS, autoplay might be blocked - notify user
                setError('Tippen Sie zum Abspielen')
                setState('idle')
                if (onPlaybackEndedRef.current) {
                  onPlaybackEndedRef.current()
                }
                reject(playError)
              })
          }

          audio.onerror = (e) => {
            console.error('[AudioPlayer] Audio load error:', e)
            setError('Audio konnte nicht geladen werden')
            setState('idle')
            reject(new Error('Audio load error'))
          }
        })

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setProgress(audio.currentTime / audio.duration)
          }
        }

        audio.onended = () => {
          console.log('[AudioPlayer] Playback ended')
          setState('idle')
          setProgress(1)
          // Notify when playback ends (for voice conversation mode)
          if (onPlaybackEndedRef.current) {
            onPlaybackEndedRef.current()
          }
        }

        audio.load()
        await playPromise
      } catch {
        // Error already handled in promise
      }
    },
    [cleanup]
  )

  // Function to unlock audio on iOS - should be called on user tap
  const unlockAudio = useCallback(async () => {
    await unlockIOSAudio()
  }, [])

  const play = useCallback(
    async (audioData: string, contentType: string) => {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(audioData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: contentType })

        await playBlob(blob)
      } catch {
        setError('Audio-Daten ungültig')
        setState('idle')
      }
    },
    [playBlob]
  )

  const pause = useCallback(() => {
    if (audioRef.current && state === 'playing') {
      audioRef.current.pause()
      setState('paused')
    }
  }, [state])

  const resume = useCallback(() => {
    if (audioRef.current && state === 'paused') {
      audioRef.current.play()
      setState('playing')
    }
  }, [state])

  const stop = useCallback(() => {
    cleanup()
    setState('idle')
  }, [cleanup])

  return {
    state,
    play,
    playBlob,
    pause,
    resume,
    stop,
    progress,
    error,
    unlockAudio,
  }
}
