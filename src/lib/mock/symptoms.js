export const mockSymptoms = [
  { id: 1, type: 'pain', label: 'Pain', icon: 'sentiment_dissatisfied' },
  { id: 2, type: 'mood', label: 'Mood', icon: 'mood' },
  { id: 3, type: 'flow', label: 'Flow', icon: 'water_drop' },
  { id: 4, type: 'sleep', label: 'Sleep', icon: 'bedtime' },
  { id: 5, type: 'fatigue', label: 'Fatigue', icon: 'battery_low' }
];

export const mockTodayLog = {
  date: 'Oct 22',
  cycleDay: 22,
  symptoms: [
    { type: 'cramps', severity: 4, location: 'abdominal' },
    { type: 'fatigue', severity: 3, notes: 'feeling tired' }
  ]
};

export const mockVoiceTranscription = {
  original: 'ಇವತ್ತು ಹೊಟ್ಟೆ ತುಂಬಾ ನೋವು ಇದೆ, ನಾಲ್ಕು ದಿನದಿಂದ ಇತ್ತು',
  translation: 'Severe cramps and lower abdominal pain today, feeling around 4 out of 5',
  extracted: [
    { type: 'symptom', value: 'Pain', icon: 'healing' },
    { type: 'severity', value: '4/5', icon: 'speed' },
    { type: 'area', value: 'Abdomen', icon: 'pin_drop' },
    { type: 'date', value: 'Today', icon: 'calendar_today' }
  ]
};
