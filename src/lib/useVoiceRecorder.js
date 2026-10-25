import { useState, useRef, useCallback } from 'react';

const VOICE_STRINGS = {
  en: {
    recording: 'Recording...',
    permissionDenied: 'Microphone access denied. Log by tapping instead.',
    error: 'Something went wrong. Please try again.',
  },
  kn: {
    recording: 'ಧ್ವನಿ ಮುಗಿಸುವಿಕೆ...',
    permissionDenied: 'ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬದಲಾಗಿ ಟ್ಯಾಪ್ ಮಾಡಿ.',
    error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  },
  hi: {
    recording: 'रिकॉर्डिंग...',
    permissionDenied: 'माइक्रोफोन एक्सेस निषेधित। इसके बजाय टैप करें।',
    error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
  },
};

export function useVoiceRecorder(language = 'en') {
  const [state, setState] = useState('idle');
  const [audioData, setAudioData] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  const pickMimeType = useCallback(() => {
    const preferred = 'audio/webm;codecs=opus';
    const fallback = 'audio/mp4';

    if (MediaRecorder.isTypeSupported(preferred)) {
      return { full: preferred, clean: 'audio/webm' };
    }
    if (MediaRecorder.isTypeSupported(fallback)) {
      return { full: fallback, clean: 'audio/mp4' };
    }
    return { full: 'audio/webm', clean: 'audio/webm' };
  }, []);

  const blobToBase64 = useCallback((blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState('recording');
      setError(null);
      setRecordingTime(0);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const { full: fullMime, clean: cleanMime } = pickMimeType();
      setMimeType(cleanMime);

      const mediaRecorder = new MediaRecorder(stream, { mimeType: fullMime });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: cleanMime });
        const base64 = await blobToBase64(blob);
        setAudioData(base64);
        setState('recorded');
      };

      mediaRecorder.start(100);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (next >= 20) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(VOICE_STRINGS[language]?.permissionDenied || VOICE_STRINGS.en.permissionDenied);
      } else {
        setError(VOICE_STRINGS[language]?.error || VOICE_STRINGS.en.error);
      }
      setState('error');
      stopRecording();
    }
  }, [language, pickMimeType, blobToBase64, stopRecording]);

  const reset = useCallback(() => {
    setState('idle');
    setAudioData(null);
    setMimeType(null);
    setError(null);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  return {
    state,
    audioData,
    mimeType,
    error,
    recordingTime,
    startRecording,
    stopRecording,
    reset,
  };
}
