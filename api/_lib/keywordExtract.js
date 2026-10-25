export function keywordExtract(transcript, today) {
  const lower = transcript.toLowerCase();

  const typeKeywords = {
    pain: ["pain", "cramp", "ache", "dard", "दर्द", "ನೋವು"],
    fatigue: ["tired", "fatigue", "weak", "थक", "कमज़ोर", "सुस्तु", "ಆಯಾಸ"],
    sleep: ["sleep", "insomnia", "नींद", "निद्रा", "ನಿದ್ರೆ"],
    mood: ["mood", "sad", "anxious", "irritable", "उदास", "चिड़चिड़", "बेसर", "कोप", "ಬೇಸರ", "ಕೋಪ"],
    flow: ["bleeding", "flow", "heavy", "खून", "रक्त", "रक्तस्राव", "ರಕ್ತ", "ರಕ್ತಸ್ರಾವ"],
  };

  const areaKeywords = {
    abdomen: ["stomach", "abdomen", "belly", "पेट", "ಹೊಟ್ಟೆ"],
    head: ["head", "सिर", "तले", "ತಲೆ"],
    back: ["back", "पीठ", "कमर", "बैक", "बैक्", "बेन्नु", "ಬೆನ್ನು", "ಸೊಂಟ"],
  };

  const intensityKeywords = ["very", "severe", "extreme", "bahut", "बहुत", "ತುಂಬಾ"];

  let type = "other";
  for (const [typeValue, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      type = typeValue;
      break;
    }
  }

  let area = null;
  for (const [areaValue, keywords] of Object.entries(areaKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      area = areaValue;
      break;
    }
  }

  const severity = intensityKeywords.some((kw) => lower.includes(kw)) ? 4 : 3;

  return [
    {
      date: today,
      type,
      severity,
      area,
      source: "voice",
      note: transcript,
    },
  ];
}
