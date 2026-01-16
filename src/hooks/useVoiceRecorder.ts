import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing'

// Configuration for auto-send on silence
const SILENCE_THRESHOLD = 0.05 // Audio level below this is considered silence
const SILENCE_DURATION_MS = 1500 // Send after 1.5 seconds of silence
const MIN_RECORDING_MS = 500 // Minimum recording time before auto-send

export interface VoiceRecorderResult {
  state: RecordingState
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  cancelRecording: () => void
  error: string | null
  audioLevel: number // 0-1 for visualizing audio input
  onAutoSend?: () => void // Callback when silence is detected
}

export function useVoiceRecorder(onAutoSend?: () => void): VoiceRecorderResult {
  const [state, setState] = useState<RecordingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationRef = useRef<number | null>(null)

  // Auto-send on silence detection
  const silenceStartRef = useRef<number | null>(null)
  const recordingStartRef = useRef<number | null>(null)
  const onAutoSendRef = useRef(onAutoSend)
  onAutoSendRef.current = onAutoSend

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    mediaRecorderRef.current = null
    analyserRef.current = null
    chunksRef.current = []
    setAudioLevel(0)
  }, [])

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    const level = Math.min(1, average / 128)
    setAudioLevel(level)

    // Auto-send on silence detection
    const now = Date.now()
    const recordingDuration = recordingStartRef.current ? now - recordingStartRef.current : 0

    if (level < SILENCE_THRESHOLD) {
      // Start tracking silence
      if (silenceStartRef.current === null) {
        silenceStartRef.current = now
      } else if (
        recordingDuration >= MIN_RECORDING_MS &&
        now - silenceStartRef.current >= SILENCE_DURATION_MS
      ) {
        // Silence detected for long enough, trigger auto-send
        if (onAutoSendRef.current) {
          onAutoSendRef.current()
          return // Stop the animation loop
        }
      }
    } else {
      // Reset silence tracking when audio is detected
      silenceStartRef.current = null
    }

    animationRef.current = requestAnimationFrame(updateAudioLevel)
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    setState('recording')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      // Set up audio analyser for level visualization
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser
      recordingStartRef.current = Date.now()
      silenceStartRef.current = null
      updateAudioLevel()

      // Create MediaRecorder with best available codec
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
    } catch (err) {
      cleanup()
      setState('idle')

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Mikrofonzugriff verweigert. Bitte erlauben Sie den Zugriff.')
        } else if (err.name === 'NotFoundError') {
          setError('Kein Mikrofon gefunden.')
        } else {
          setError('Mikrofon konnte nicht gestartet werden.')
        }
      } else {
        setError('Aufnahme fehlgeschlagen.')
      }
    }
  }, [cleanup, updateAudioLevel])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        cleanup()
        setState('idle')
        resolve(null)
        return
      }

      setState('processing')

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType })
        cleanup()
        setState('idle')
        resolve(blob)
      }

      mediaRecorder.stop()
    })
  }, [cleanup])

  const cancelRecording = useCallback(() => {
    cleanup()
    setState('idle')
  }, [cleanup])

  return {
    state,
    startRecording,
    stopRecording,
    cancelRecording,
    error,
    audioLevel,
  }
}
