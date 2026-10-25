const BASE = "https://api.sarvam.ai";

const EXT = {
  "audio/wav": "wav",
  "audio/mpeg": "mp3",
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
};

export async function speechToText({ audioBuffer, mimeType, languageCode }) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([audioBuffer], { type: mimeType }),
    `audio.${EXT[mimeType] || "wav"}`
  );
  form.append("model", process.env.SARVAM_STT_MODEL || "saaras:v3");
  form.append("mode", "transcribe");
  form.append("language_code", languageCode || "unknown");

  const res = await fetch(`${BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": process.env.SARVAM_API_KEY },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Sarvam STT ${res.status}: ${await res.text()}`);
  }
  return res.json(); // { transcript, language_code, ... }
}