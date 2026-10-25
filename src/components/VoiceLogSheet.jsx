import { useState, useEffect } from 'react';

const VOICE_STRINGS = {
  recording: 'Recording...',
  transcribing: 'Transcribing...',
  extracting: 'Extracting symptoms...',
  confirm: 'Confirm',
  edit: 'Edit',
  type: 'Type',
  severity: 'Severity',
  area: 'Area',
  save: 'Save',
  cancel: 'Cancel',
  detected: 'Detected',
  pain: 'Pain',
  mood: 'Mood',
  flow: 'Flow',
  sleep: 'Sleep',
  fatigue: 'Fatigue',
  other: 'Other',
  abdomen: 'Abdomen',
  head: 'Head',
  back: 'Back',
  breast: 'Breast',
  legs: 'Legs',
  none: 'None',
  success: 'Logged successfully!',
};

const TYPE_OPTIONS = ['pain', 'mood', 'flow', 'sleep', 'fatigue', 'other'];
const AREA_OPTIONS = ['abdomen', 'head', 'back', 'breast', 'legs', null];

export default function VoiceLogSheet({ isOpen, onClose, onConfirm, audioData, mimeType, recordingState, onStopRecording, onNavigateToCalendar }) {
  const [step, setStep] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const strings = VOICE_STRINGS;

  useEffect(() => {
    if (!isOpen) {
      setStep('idle');
      setTranscript('');
      setEntries([]);
      setEditingEntry(null);
      setShowSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (audioData && isOpen && step === 'idle' && recordingState === 'recorded') {
      processAudio();
    }
  }, [audioData, isOpen, step, recordingState]);

  const processAudio = async () => {
    setStep('transcribing');

    try {
      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: audioData,
          mimeType,
          language: 'en-IN',
        }),
      });

      if (!transcribeRes.ok) {
        throw new Error(`Transcribe failed: ${transcribeRes.status}`);
      }

      const transcribeData = await transcribeRes.json();
      setTranscript(transcribeData.transcript);

      setStep('extracting');

      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcribeData.transcript,
          language: 'en-IN',
        }),
      });

      if (!extractRes.ok) {
        throw new Error(`Extract failed: ${extractRes.status}`);
      }

      const extractData = await extractRes.json();
      setEntries(extractData.entries);
      setStep('confirm');
    } catch (err) {
      console.error('Voice processing error:', err);
      // Fallback: use keyword extraction on client side
      setTranscript('Could not transcribe audio');
      setEntries([{
        date: new Date().toISOString().split('T')[0],
        type: 'other',
        severity: 3,
        area: null,
        source: 'voice',
        note: 'Transcription failed',
      }]);
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    onConfirm(entries);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      // Don't navigate to calendar - let the user click the Confirm Save button in Log page
    }, 1500);
  };

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry, original: entry });
  };

  const handleSaveEdit = () => {
    setEntries((prev) =>
      prev.map((e) => (e === editingEntry.original ? editingEntry : e))
    );
    setEditingEntry(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[430px] bg-white rounded-t-[24px] border-t-[2.5px] border-black shadow-[0_-4px_0px_#000000] p-5">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-black text-[32px]">check</span>
            </div>
            <p className="text-[20px] font-black text-black">{strings.success}</p>
          </div>
        ) : step === 'confirm' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-black text-black">{strings.detected}</h3>
              <button onClick={onClose} className="text-black">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="bg-[#F6D1C5] rounded-[16px] border-[2.5px] border-black p-4">
              <p className="text-[15px] font-bold text-black leading-snug">{transcript}</p>
            </div>

            {entries.map((entry, idx) => (
              <div key={idx} className="bg-white rounded-[16px] border-[2.5px] border-black shadow-[3px_3px_0px_#000000] p-4">
                {editingEntry && editingEntry.original === entry ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[13px] font-black text-black mb-2 block">{strings.type}</label>
                      <select
                        value={editingEntry.type}
                        onChange={(e) => setEditingEntry({ ...editingEntry, type: e.target.value })}
                        className="w-full bg-white border-[2.5px] border-black rounded-[12px] px-3 py-2 text-[15px] font-bold text-black"
                      >
                        {TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {strings[opt] || opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[13px] font-black text-black mb-2 block">{strings.severity}</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={editingEntry.severity}
                        onChange={(e) => setEditingEntry({ ...editingEntry, severity: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[13px] font-bold text-black mt-1">
                        <span>1</span>
                        <span>{editingEntry.severity}</span>
                        <span>5</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[13px] font-black text-black mb-2 block">{strings.area}</label>
                      <select
                        value={editingEntry.area || 'none'}
                        onChange={(e) =>
                          setEditingEntry({ ...editingEntry, area: e.target.value === 'none' ? null : e.target.value })
                        }
                        className="w-full bg-white border-[2.5px] border-black rounded-[12px] px-3 py-2 text-[15px] font-bold text-black"
                      >
                        <option value="none">{strings.none}</option>
                        {AREA_OPTIONS.filter(Boolean).map((opt) => (
                          <option key={opt} value={opt}>
                            {strings[opt] || opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-[#EE8070] border-[2.5px] border-black rounded-full px-4 py-2 text-[15px] font-black text-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      >
                        {strings.save}
                      </button>
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="flex-1 bg-white border-[2.5px] border-black rounded-full px-4 py-2 text-[15px] font-black text-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      >
                        {strings.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#EE8070] border-[2px] border-black rounded-full px-2 py-0.5 text-[11px] font-black text-black">
                          {strings[entry.type] || entry.type}
                        </span>
                        <span className="text-[13px] font-bold text-black">
                          {strings.severity}: {entry.severity}/5
                        </span>
                      </div>
                      {entry.area && (
                        <span className="text-[13px] font-bold text-black opacity-80">
                          {strings[entry.area] || entry.area}
                        </span>
                      )}
                      <span className="text-[13px] font-bold text-black opacity-60">{entry.date}</span>
                    </div>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-black active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-[#EE8070] border-[2.5px] border-black rounded-full px-4 py-3 text-[15px] font-black text-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {strings.confirm}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white border-[2.5px] border-black rounded-full px-4 py-3 text-[15px] font-black text-black shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {strings.cancel}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {recordingState === 'recording' ? (
              <>
                <button
                  onClick={onStopRecording}
                  className="w-20 h-20 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center mb-4 animate-pulse active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <span className="material-symbols-outlined text-black text-[40px]">stop</span>
                </button>
                <p className="text-[20px] font-black text-black">{strings.recording}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-black text-[32px]">mic</span>
                </div>
                <p className="text-[20px] font-black text-black">
                  {step === 'transcribing' && strings.transcribing}
                  {step === 'extracting' && strings.extracting}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
