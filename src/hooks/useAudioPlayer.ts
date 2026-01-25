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

// Shared audio element for iOS - reusing the same element helps with autoplay
let sharedAudioElement: HTMLAudioElement | null = null
let audioUnlocked = false

// Get or create the shared audio element
function getSharedAudioElement(): HTMLAudioElement {
  if (!sharedAudioElement) {
    sharedAudioElement = new Audio()
    sharedAudioElement.setAttribute('playsinline', 'true')
    sharedAudioElement.setAttribute('webkit-playsinline', 'true')
    // Preload setting helps on iOS
    sharedAudioElement.preload = 'auto'
  }
  return sharedAudioElement
}

// Unlock audio playback on iOS - must be called from a user gesture
export async function unlockIOSAudio(): Promise<void> {
  if (audioUnlocked) {
    console.log('[AudioPlayer] Audio already unlocked')
    return
  }

  console.log('[AudioPlayer] Attempting to unlock iOS audio...')

  try {
    const audio = getSharedAudioElement()

    // Create a tiny silent WAV and play it
    // This "warms up" the audio element for future use
    const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    audio.src = silentWav
    audio.volume = 0.01 // Very quiet but not zero (iOS ignores volume=0)

    // Play and immediately pause
    const playPromise = audio.play()
    if (playPromise) {
      await playPromise
    }
    audio.pause()
    audio.currentTime = 0
    audio.volume = 1 // Reset volume for actual playback

    audioUnlocked = true
    console.log('[AudioPlayer] iOS audio unlocked successfully')
  } catch (e) {
    console.warn('[AudioPlayer] Failed to unlock iOS audio:', e)
    // Still mark as unlocked to prevent retry spam
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

        // Use the shared audio element on iOS for better autoplay support
        const audio = getSharedAudioElement()
        audioRef.current = audio

        // Set up event handlers
        const playPromise = new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            console.log('[AudioPlayer] Audio ready, attempting play...')
            setState('playing')
            audio.play()
              .then(() => {
                console.log('[AudioPlayer] Playback started successfully')
                resolve()
              })
              .catch((playError) => {
                console.warn('[AudioPlayer] Autoplay blocked:', playError)
                setError('Tippen Sie zum Abspielen')
                setState('idle')
                if (onPlaybackEndedRef.current) {
                  onPlaybackEndedRef.current()
                }
                reject(playError)
              })
            audio.removeEventListener('canplaythrough', onCanPlay)
          }

          const onError = (e: Event) => {
            console.error('[AudioPlayer] Audio load error:', e)
            setError('Audio konnte nicht geladen werden')
            setState('idle')
            audio.removeEventListener('error', onError)
            reject(new Error('Audio load error'))
          }

          audio.addEventListener('canplaythrough', onCanPlay, { once: true })
          audio.addEventListener('error', onError, { once: true })
        })

        const onTimeUpdate = () => {
          if (audio.duration) {
            setProgress(audio.currentTime / audio.duration)
          }
        }

        const onEnded = () => {
          console.log('[AudioPlayer] Playback ended')
          setState('idle')
          setProgress(1)
          audio.removeEventListener('timeupdate', onTimeUpdate)
          audio.removeEventListener('ended', onEnded)
          if (onPlaybackEndedRef.current) {
            onPlaybackEndedRef.current()
          }
        }

        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('ended', onEnded)

        // Set source and load
        audio.src = url
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
