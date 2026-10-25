import { speechToText } from "./_lib/sarvam.js";
import { fallbackTranscript } from "./_lib/fallbacks.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { audio, mimeType = "audio/webm", language = "kn-IN" } = req.body || {};
  if (!audio) {
    return res.status(400).json({ error: "audio (base64) is required" });
  }

  try {
    const buf = Buffer.from(audio, "base64");
    const out = await speechToText({
      audioBuffer: buf,
      mimeType,
      languageCode: language,
    });
    return res.status(200).json({
      transcript: out.transcript,
      language: out.language_code || language,
      source: "sarvam",
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      transcript: fallbackTranscript(language),
      language,
      source: "fallback",
      warning: err.message,
    });
  }
}