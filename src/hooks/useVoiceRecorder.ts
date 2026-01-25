import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing'

// Configuration for auto-send on silence
const SILENCE_THRESHOLD = 0.05 // Audio level below this is considered silence
const SILENCE_DURATION_MS = 1500 // Send after 1.5 seconds of silence
const MIN_RECORDING_MS = 500 // Minimum recording time before auto-send

// Audio format magic bytes for validation
const WEBM_MAGIC = [0x1a, 0x45, 0xdf, 0xa3] // WebM/EBML header
const MP4_FTYP_MAGIC = [0x66, 0x74, 0x79, 0x70] // "ftyp" at offset 4 for MP4/M4A

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
    if (!analyserRef.current || !audioContextRef.current) return

    // Check if AudioContext is running (important for iOS)
    if (audioContextRef.current.state !== 'running') {
      // Try to resume if suspended
      audioContextRef.current.resume().catch(() => {})
      animationRef.current = requestAnimationFrame(updateAudioLevel)
      return
    }

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount

    // Try frequency data first (more visual), fall back to time domain (more reliable on iOS)
    const frequencyData = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(frequencyData)
    let average = frequencyData.reduce((a, b) => a + b, 0) / bufferLength

    // If frequency data is all zeros (iOS issue), use time domain data
    if (average === 0) {
      const timeDomainData = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(timeDomainData)
      // Time domain data centers around 128, calculate deviation
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        const deviation = Math.abs((timeDomainData[i] ?? 128) - 128)
        sum += deviation
      }
      average = sum / bufferLength * 2 // Scale up for visibility
    }

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
      // Use webkitAudioContext for iOS Safari compatibility
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext

      // iOS Safari requires explicit resume after user interaction
      // Wait until it's actually running
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      // Double-check and wait for running state (iOS sometimes needs this)
      if (audioContext.state !== 'running') {
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (audioContext.state === 'running') {
              resolve()
            } else {
              audioContext.resume().then(() => {
                setTimeout(checkState, 50)
              }).catch(() => resolve())
            }
          }
          // Timeout after 500ms
          setTimeout(resolve, 500)
          checkState()
        })
      }

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.3 // Faster response
      source.connect(analyser)
      analyserRef.current = analyser
      recordingStartRef.current = Date.now()
      silenceStartRef.current = null

      // Start audio level updates
      updateAudioLevel()

      // Determine best supported MIME type for the platform
      // Safari/iOS doesn't support WebM, use mp4 or fallback
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Safari/iOS fallback
        mimeType = 'audio/mp4'
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Last resort fallback
        mimeType = ''  // Let browser choose default
      }

      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000, // 128kbps - forces fresh encoding
      }
      if (mimeType) {
        recorderOptions.mimeType = mimeType
      }

      const mediaRecorder = new MediaRecorder(stream, recorderOptions)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Start with a large timeslice to get data periodically but maintain container integrity
      // This ensures we get proper EBML headers while not waiting forever
      mediaRecorder.start(30000) // Get data every 30 seconds max
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

      // Request any remaining data before stopping
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.requestData()
      }

      mediaRecorder.onstop = async () => {
        // Give a small delay to ensure all data is collected
        await new Promise((r) => setTimeout(r, 50))

        const mimeType = mediaRecorder.mimeType
        const blob = new Blob(chunksRef.current, { type: mimeType })

        // Validate audio format based on actual content
        const headerBytes = new Uint8Array(await blob.slice(0, 8).arrayBuffer())
        const isWebM = WEBM_MAGIC.every((b, i) => headerBytes[i] === b)
        const isMP4 = MP4_FTYP_MAGIC.every((b, i) => headerBytes[i + 4] === b) // ftyp at offset 4

        if (!isWebM && !isMP4 && blob.size > 0) {
          // Log for debugging but don't treat as error - browser may use other formats
          console.debug('Audio format:', mimeType, 'header bytes:', Array.from(headerBytes).map(b => b.toString(16)).join(' '))
        }

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
