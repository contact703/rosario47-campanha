// Proxy de TTS (ElevenLabs) — a chave fica no SERVIDOR (env), nunca no client.
const express = require('express');
const router = express.Router();

const VOICE = process.env.ELEVEN_VOICE_ID || 'pqHfZKP75CvOlQylNhV4'; // Antonio (BR)
const MODEL = process.env.ELEVEN_MODEL || 'eleven_turbo_v2_5';

router.post('/', async (req, res) => {
  const key = process.env.ELEVEN_API_KEY;
  if (!key) return res.status(503).json({ error: 'Voz não configurada.' });
  const text = String((req.body && req.body.text) || '')
    .replace(/[*_#`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2500);
  if (!text) return res.status(400).json({ error: 'Texto vazio.' });
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/stream`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
      }),
    });
    if (!r.ok) {
      console.error('[tts] eleven', r.status);
      return res.status(502).json({ error: 'Falha ao gerar a voz.' });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    console.error('[tts]', e && e.message);
    res.status(500).json({ error: 'Erro na voz.' });
  }
});

module.exports = router;
