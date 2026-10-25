export const FALLBACK_TRANSCRIPTS = {
  "kn-IN": "ಇವತ್ತು ತುಂಬಾ ಹೊಟ್ಟೆ ನೋವು ಇದೆ",
  "hi-IN": "आज पेट में बहुत दर्द है",
  "en-IN": "I have severe stomach pain today",
};

export function fallbackTranscript(language) {
  return FALLBACK_TRANSCRIPTS[language] || FALLBACK_TRANSCRIPTS["en-IN"];
}