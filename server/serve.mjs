import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Configuration
const PORT = process.env.PORT || 5173
const INTERNAL_BACKEND_URL = process.env.INTERNAL_BACKEND_URL || 'http://idpa_backend.railway.internal:4000'

// Basic JSON parsing for API proxy
app.use('/api', express.json({ limit: '1mb' }))

// Very small proxy for /api/* to internal backend URL
app.use('/api', async (req, res) => {
  try {
    const targetUrl = INTERNAL_BACKEND_URL + req.originalUrl

    const headers = { ...req.headers }
    // Remove hop-by-hop headers
    delete headers['host']
    delete headers['content-length']

    const init = {
      method: req.method,
      headers,
      redirect: 'manual',
    }

    if (!['GET', 'HEAD'].includes(req.method)) {
      // If body was parsed by express.json, forward JSON; otherwise raw is not handled here
      if (req.is('application/json') && req.body !== undefined) {
        init.body = JSON.stringify(req.body)
      } else {
        // Fallback: read raw body
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        init.body = Buffer.concat(chunks)
      }
    }

    const response = await fetch(targetUrl, init)
    // Forward status and headers
    res.status(response.status)
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return
      res.setHeader(key, value)
    })
    const buffer = Buffer.from(await response.arrayBuffer())
    res.send(buffer)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Proxy-Fehler'
    res.status(502).json({ error: msg })
  }
})

// Serve static files from dist
const distDir = path.resolve(__dirname, '..', 'dist')
app.use(express.static(distDir, { index: false }))

// SPA fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Frontend server listening on :${PORT} (proxy -> ${INTERNAL_BACKEND_URL})`)
})

