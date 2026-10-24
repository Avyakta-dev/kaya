import { useTranslation } from '../i18n/index.jsx';
import { mockVoiceTranscription } from '../lib/mock/symptoms';
import LanguageToggle from '../components/LanguageToggle';
import BottomNav from '../components/BottomNav';

export default function Log() {
  const { t } = useTranslation();

  return (
    <main className="w-full max-w-[390px] min-h-[844px] bg-[#f9f9f9] flex flex-col relative pb-32">
      <header className="w-full px-5 pt-6 pb-2 flex items-center justify-between sticky top-0 z-40 bg-[#f9f9f9]">
        <button
          aria-label="Go back"
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
        <button className="bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] rounded-full px-3 py-1 flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform">
          <span className="text-[11px] text-black font-extrabold tracking-normal">EN | ಕನ್ನಡ | हिं</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col px-5 gap-6 pt-1">
        <section className="flex flex-col items-center justify-center mt-1">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-60 h-60 rounded-full border-[2.5px] border-dashed border-black bg-[#ffdbcf]/40 animate-pulse-slow"></div>
            <div className="absolute w-44 h-44 rounded-full border-[2.5px] border-black bg-[#feb198]/50 animate-pulse-delayed"></div>
            <button
              aria-label="Microphone record button"
              className="relative z-10 w-24 h-24 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-black text-[42px] font-bold" style={{ fontVariationSettings: 'FILL 1' }}>
                mic
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
              "{mockVoiceTranscription.original}" <span className="text-[#56423f] font-semibold">({mockVoiceTranscription.translation})</span>
            </p>
          </div>

          <div className="flex items-center gap-1 mb-2.5">
            <span className="material-symbols-outlined text-[#9d4235] text-[18px]" style={{ fontVariationSettings: 'FILL 1' }}>
              auto_awesome
            </span>
            <span className="text-[13px] text-black font-black">{t('log.detectedSummary')}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockVoiceTranscription.extracted.map((item, index) => (
              <div key={index} className="bg-[#feb198] border-[2.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-black font-black">{item.icon}</span>
                <span className="text-[11px] text-black font-black">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 mt-1">
          <button className="w-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3.5 px-4 font-black text-[15px] text-black flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
            <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
            <span>{t('log.confirmSave')}</span>
          </button>
          <button className="w-full bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3.5 px-4 font-black text-[15px] text-black flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
            <span className="material-symbols-outlined text-[20px] font-black">edit_note</span>
            <span>{t('log.editDetails')}</span>
          </button>
        </section>

        <footer className="flex items-center justify-center gap-1.5 text-center px-3 py-2">
          <span className="material-symbols-outlined text-[#56423f] text-[16px]">lock</span>
          <p className="text-[13px] text-[#56423f] font-bold">{t('log.privacy')}</p>
        </footer>
      </div>

      <BottomNav />

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
