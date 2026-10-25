import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';
import { useVoiceRecorder } from '../lib/useVoiceRecorder';
import { saveLog } from '../lib/api';
import { mockVoiceTranscription } from '../lib/mock/symptoms';
import BottomNav from '../components/BottomNav';
import VoiceLogSheet from '../components/VoiceLogSheet';

export default function Log() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'manual'
  const [isVoiceSheetOpen, setIsVoiceSheetOpen] = useState(false);
  const [transcribedData, setTranscribedData] = useState(null);
  const [confirmedEntries, setConfirmedEntries] = useState(null);

  // Manual input state
  const [manualEntry, setManualEntry] = useState({
    date: '2026-10-25', // Demo today
    type: 'pain',
    severity: 3,
    area: 'abdomen',
    note: ''
  });

  const {
    state: recordingState,
    audioData,
    mimeType,
    startRecording,
    stopRecording,
    reset: resetRecording,
  } = useVoiceRecorder();

  const handleMicClick = () => {
    if (recordingState === 'recording') {
      stopRecording();
    } else {
      setIsVoiceSheetOpen(true);
      startRecording();
    }
  };

  const handleVoiceSheetClose = () => {
    if (recordingState === 'recording') {
      stopRecording();
    }
    setIsVoiceSheetOpen(false);
    setTimeout(() => resetRecording(), 100);
  };

  const handleVoiceConfirm = async (entries) => {
    setConfirmedEntries(entries);

    const extracted = [];
    entries.forEach(e => {
      extracted.push({ type: 'symptom', value: e.type.charAt(0).toUpperCase() + e.type.slice(1), icon: 'healing' });
      extracted.push({ type: 'severity', value: `${e.severity}/5`, icon: 'speed' });
      if (e.area) {
        extracted.push({ type: 'area', value: e.area.charAt(0).toUpperCase() + e.area.slice(1), icon: 'pin_drop' });
      }
      extracted.push({ type: 'date', value: e.date, icon: 'calendar_today' });
    });

    setTranscribedData({
      original: entries[0]?.note || '',
      extracted
    });
  };

  const handleManualSave = async () => {
    const entry = {
      id: Date.now(),
      date: manualEntry.date,
      type: manualEntry.type,
      severity: manualEntry.severity,
      area: manualEntry.area,
      source: 'manual',
      note: manualEntry.note
    };

    try {
      // Demo mode: Try to save via API, if it fails just log and navigate
      await saveLog(entry);
    } catch (err) {
      console.log('Demo mode: Log saved locally', entry);
    }

    // Save to localStorage for demo
    const existingLogs = JSON.parse(localStorage.getItem('userLogs') || '[]');
    existingLogs.push(entry);
    localStorage.setItem('userLogs', JSON.stringify(existingLogs));

    navigate('/calendar');
  };

  return (
    <main className="w-full max-w-[390px] min-h-[844px] bg-[#f9f9f9] flex flex-col relative pb-32">
      <header className="w-full px-5 pt-6 pb-2 flex items-center justify-between sticky top-0 z-40 bg-[#f9f9f9]">
        <button
          aria-label="Go back"
          onClick={() => navigate('/calendar')}
          className="w-11 h-11 rounded-full bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
        >
          <span className="material-symbols-outlined text-black text-[22px] font-bold">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#9d4235] text-[26px]" style={{ fontVariationSettings: 'FILL 1' }}>
            spa
          </span>
          <div className="flex flex-col items-center">
            <span className="text-[20px] font-black text-black tracking-tight leading-none">Kaya</span>
            <span className="text-[11px] text-[#56423f] font-bold leading-tight">{t('log.title')}</span>
          </div>
        </div>
        <div className="w-11 h-11" aria-hidden="true"></div>
      </header>

      <div className="flex-1 flex flex-col px-5 gap-6 pt-1">
        {/* Input Mode Toggle */}
        <section className="flex bg-white border-[2.5px] border-black rounded-full p-1 shadow-[3px_3px_0px_#000000]">
          <button
            onClick={() => setInputMode('voice')}
            className={`flex-1 py-2 px-4 rounded-full text-[13px] font-black transition-all ${
              inputMode === 'voice'
                ? 'bg-[#EE8070] border-[2px] border-black shadow-[2px_2px_0px_#000000]'
                : 'bg-transparent hover:bg-[#f3f3f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] align-middle mr-1">mic</span>
            Voice
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 py-2 px-4 rounded-full text-[13px] font-black transition-all ${
              inputMode === 'manual'
                ? 'bg-[#EE8070] border-[2px] border-black shadow-[2px_2px_0px_#000000]'
                : 'bg-transparent hover:bg-[#f3f3f3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] align-middle mr-1">edit</span>
            Manual
          </button>
        </section>

        {inputMode === 'voice' ? (
          <section className="flex flex-col items-center justify-center mt-1">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-60 h-60 rounded-full border-[2.5px] border-dashed border-black bg-[#ffdbcf]/40 animate-pulse-slow"></div>
            <div className="absolute w-44 h-44 rounded-full border-[2.5px] border-black bg-[#feb198]/50 animate-pulse-delayed"></div>
            <button
              aria-label="Microphone record button"
              onClick={handleMicClick}
              className={`relative z-10 w-24 h-24 rounded-full bg-[#EE8070] border-[2.5px] border-black flex items-center justify-center active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer ${
                recordingState === 'recording' ? 'animate-pulse' : ''
              }`}
            >
              <span className="material-symbols-outlined text-black text-[42px] font-bold" style={{ fontVariationSettings: 'FILL 1' }}>
                {recordingState === 'recording' ? 'stop' : 'mic'}
              </span>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2.5 bg-white border-[2.5px] border-black rounded-full px-4 py-1.5 shadow-[2px_2px_0px_#000000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EE8070] border-[1.5px] border-black animate-ping"></span>
            <span className="text-[13px] text-black font-black">{t('log.listening')}</span>
            <div className="flex items-center gap-0.5 ml-1 h-5">
              <span className="w-1 bg-black rounded-full waveform-bar" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 bg-black rounded-full waveform-bar" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1 bg-black rounded-full waveform-bar" style={{ animationDelay: '0.5s' }}></span>
              <span className="w-1 bg-black rounded-full waveform-bar" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>

          <div className="mt-3 text-center px-2">
            <p className="text-[15px] font-extrabold text-black">{t('log.tapSpeak')}</p>
            <p className="text-[13px] text-[#56423f] font-bold mt-1 leading-snug">{t('log.voiceExamples')}</p>
          </div>
        </section>
        ) : (
          <section className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[24px] p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-black">Date</label>
              <input
                type="date"
                value={manualEntry.date}
                onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
                className="w-full bg-[#f9f9f9] border-[2.5px] border-black rounded-xl px-4 py-3 text-[15px] font-bold text-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-black">Symptom Type</label>
              <select
                value={manualEntry.type}
                onChange={(e) => setManualEntry({ ...manualEntry, type: e.target.value })}
                className="w-full bg-[#f9f9f9] border-[2.5px] border-black rounded-xl px-4 py-3 text-[15px] font-bold text-black"
              >
                <option value="pain">Pain</option>
                <option value="mood">Mood</option>
                <option value="flow">Flow</option>
                <option value="sleep">Sleep</option>
                <option value="fatigue">Fatigue</option>
                <option value="bloating">Bloating</option>
                <option value="headache">Headache</option>
                <option value="nausea">Nausea</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-black">Severity: {manualEntry.severity}/5</label>
              <input
                type="range"
                min="1"
                max="5"
                value={manualEntry.severity}
                onChange={(e) => setManualEntry({ ...manualEntry, severity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] font-bold text-black">
                <span>1 (Mild)</span>
                <span>5 (Severe)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-black">Area</label>
              <select
                value={manualEntry.area || 'none'}
                onChange={(e) => setManualEntry({ ...manualEntry, area: e.target.value === 'none' ? '' : e.target.value })}
                className="w-full bg-[#f9f9f9] border-[2.5px] border-black rounded-xl px-4 py-3 text-[15px] font-bold text-black"
              >
                <option value="abdomen">Abdomen</option>
                <option value="head">Head</option>
                <option value="back">Back</option>
                <option value="breast">Breast</option>
                <option value="legs">Legs</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-black text-black">Notes (Optional)</label>
              <textarea
                value={manualEntry.note}
                onChange={(e) => setManualEntry({ ...manualEntry, note: e.target.value })}
                placeholder="Add any additional details..."
                className="w-full bg-[#f9f9f9] border-[2.5px] border-black rounded-xl px-4 py-3 text-[15px] font-bold text-black resize-none"
                rows="3"
              />
            </div>
          </section>
        )}

        {inputMode === 'voice' && (
          <section className="bg-[#ffdbcf] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[24px] p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black text-[18px]">graphic_eq</span>
                <span className="text-[11px] uppercase tracking-wider text-black font-black">{t('log.transcribed')}</span>
              </div>
              <span className="bg-white text-black border-[2px] border-black rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide">
                {t('log.autoDetected')}
              </span>
            </div>

            <div className="bg-white border-[2.5px] border-black rounded-xl p-3 mb-4 shadow-[2px_2px_0px_#000000]">
              <p className="text-[13px] text-black font-extrabold leading-relaxed">
                "{transcribedData?.original || mockVoiceTranscription.original}"
              </p>
            </div>

            <div className="flex items-center gap-1 mb-2.5">
              <span className="material-symbols-outlined text-[#9d4235] text-[18px]" style={{ fontVariationSettings: 'FILL 1' }}>
                auto_awesome
              </span>
              <span className="text-[13px] text-black font-black">{t('log.detectedSummary')}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(transcribedData?.extracted || mockVoiceTranscription.extracted).map((item, index) => (
                <div key={index} className="bg-[#feb198] border-[2.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-black font-black">{item.icon}</span>
                  <span className="text-[11px] text-black font-black">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3 mt-1">
          {inputMode === 'voice' ? (
            <>
              <button
                onClick={async () => {
                  if (confirmedEntries) {
                    try {
                      for (const entry of confirmedEntries) {
                        await saveLog(entry);
                      }
                    } catch (err) {
                      console.log('Demo mode: Voice log saved locally', confirmedEntries);
                    }

                    // Save to localStorage for demo
                    const existingLogs = JSON.parse(localStorage.getItem('userLogs') || '[]');
                    confirmedEntries.forEach(entry => {
                      existingLogs.push({ ...entry, id: Date.now() + Math.random() });
                    });
                    localStorage.setItem('userLogs', JSON.stringify(existingLogs));

                    // Navigate to calendar after saving to see the log
                    navigate('/calendar');
                  } else {
                    // If no entries, just navigate to calendar
                    navigate('/calendar');
                  }
                }}
                className="w-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3.5 px-4 font-black text-[15px] text-black flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
                <span>{t('log.confirmSave')}</span>
              </button>
              <button
                onClick={() => {
                  setTranscribedData(null);
                  setConfirmedEntries(null);
                }}
                className="w-full bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3.5 px-4 font-black text-[15px] text-black flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined text-[20px] font-black">edit_note</span>
                <span>{t('log.editDetails')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleManualSave}
              className="w-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3.5 px-4 font-black text-[15px] text-black flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
              <span>Save Log</span>
            </button>
          )}
        </section>

        <footer className="flex items-center justify-center gap-1.5 text-center px-3 py-2">
          <span className="material-symbols-outlined text-[#56423f] text-[16px]">lock</span>
          <p className="text-[13px] text-[#56423f] font-bold">{t('log.privacy')}</p>
        </footer>
      </div>

      <BottomNav />

      <VoiceLogSheet
        isOpen={isVoiceSheetOpen}
        onClose={handleVoiceSheetClose}
        onConfirm={handleVoiceConfirm}
        audioData={audioData}
        mimeType={mimeType}
        recordingState={recordingState}
        onStopRecording={stopRecording}
        onNavigateToCalendar={() => navigate('/calendar')}
      />

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.92); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.92); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-delayed {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 0.75s;
        }
        .waveform-bar {
          animation: sound-bounce 1.2s ease-in-out infinite alternate;
        }
        @keyframes sound-bounce {
          0% { height: 6px; }
          100% { height: 22px; }
        }
      `}</style>
    </main>
  );
}
