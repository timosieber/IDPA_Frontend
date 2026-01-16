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

      try {
        const url = URL.createObjectURL(blob)
        urlRef.current = url

        const audio = new Audio(url)
        audioRef.current = audio

        audio.onloadeddata = () => {
          setState('playing')
          audio.play().catch(() => {
            setError('Wiedergabe fehlgeschlagen')
            setState('idle')
          })
        }

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setProgress(audio.currentTime / audio.duration)
          }
        }

        audio.onended = () => {
          setState('idle')
          setProgress(1)
          // Notify when playback ends (for voice conversation mode)
          if (onPlaybackEndedRef.current) {
            onPlaybackEndedRef.current()
          }
        }

        audio.onerror = () => {
          setError('Audio konnte nicht geladen werden')
          setState('idle')
        }

        audio.load()
      } catch {
        setError('Wiedergabe fehlgeschlagen')
        setState('idle')
      }
    },
    [cleanup]
  )

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
  }
}
