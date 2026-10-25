import { useNavigate } from 'react-router-dom';
import { mockUser } from '../lib/mock/user';
import { mockCycle } from '../lib/mock/cycle';
import { useTranslation } from '../i18n/index.jsx';
import CycleRing from '../components/CycleRing';
import QuickLogRow from '../components/QuickLogRow';
import TipsCard from '../components/TipsCard';
import TrendCard from '../components/TrendCard';
import LanguageToggle from '../components/LanguageToggle';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const handleMicClick = () => {
    navigate('/log');
  };

  return (
    <main className="w-full max-w-[430px] mx-auto min-h-screen bg-white relative flex flex-col pb-32">
      <header className="w-full px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-40 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <span className="material-symbols-outlined text-black text-[22px]">spa</span>
          </div>
          <div>
            <h1 className="text-[20px] font-black tracking-tight leading-none text-black">
              {t('home.greeting')}
            </h1>
            <p className="text-[11px] tracking-wide font-extrabold mt-0.5 opacity-80 text-black">
              {t('home.cycleDay')}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </header>

      <div className="px-5 flex flex-col gap-5 mt-1">
        <CycleRing currentDay={mockCycle.currentDay} periodInDays={mockCycle.periodInDays} />

        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-black text-black">{t('home.howFeeling')}</h2>
            <span className="text-[11px] font-extrabold text-black bg-[#F6D1C5] border-[2px] border-black rounded-full px-2 py-0.5">
              {t('home.dailyLog')}
            </span>
          </div>

          <QuickLogRow />

          <div className="w-full p-3.5 bg-white rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-between">
            <div className="flex flex-col pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-black text-black">{t('home.speakLanguage')}</span>
                <span className="w-2 h-2 rounded-full bg-[#EE8070] border-[1.5px] border-black"></span>
              </div>
              <p className="text-[13px] font-bold text-black opacity-85 leading-tight mt-0.5">
                {t('home.voiceExample')}
              </p>
            </div>
            <button
              aria-label="Record voice symptom log"
              onClick={handleMicClick}
              className="w-14 h-14 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center flex-shrink-0 cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-black text-[28px]">mic</span>
            </button>
          </div>
        </section>

        <TipsCard />

        <section className="w-full bg-[#F6D1C5] rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col gap-2.5 relative">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-black text-[20px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-black">{t('home.patternDetected')}</span>
              <p className="text-[15px] font-extrabold text-black leading-snug mt-0.5">{t('home.patternDesc')}</p>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <a className="inline-flex items-center gap-1 text-[13px] font-black text-black underline decoration-2 underline-offset-4 hover:opacity-80" href="#report-cta">
              {t('home.learnMore')}
            </a>
          </div>
        </section>

        <TrendCard />
      </div>

      <BottomNav />
    </main>
  );
}
