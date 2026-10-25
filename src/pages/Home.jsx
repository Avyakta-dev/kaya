import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockUser } from '../lib/mock/user';
import { mockCycle } from '../lib/mock/cycle';
import { useTranslation } from '../i18n/index.jsx';
import { getUser } from '../lib/api.js';
import CycleRing from '../components/CycleRing';
import QuickLogRow from '../components/QuickLogRow';
import TipsCard from '../components/TipsCard';
import TrendCard from '../components/TrendCard';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cycleInfo, setCycleInfo] = useState({ currentDay: 22, phase: 'luteal', periodInDays: 6, cycleLength: 30 });

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // Demo mode: Use localStorage data
        const name = localStorage.getItem('userName') || mockUser.name;
        const lifeStage = localStorage.getItem('userLifeStage') || mockUser.lifeStage;
        const age = parseInt(localStorage.getItem('userAge')) || mockUser.age;
        setUser({ name, lifeStage, age });
      } else {
        setUser(mockUser);
      }
      setLoading(false);
    };

    // Calculate cycle day based on actual log data
    // Last period: Oct 10-15, 2026
    // Today: Oct 25, 2026
    // Next period expected: Nov 7, 2026 (based on 30-day cycle)
    const calculateCycleDay = () => {
      const lastPeriodStart = new Date('2026-10-10');
      const today = new Date('2026-10-25');
      const daysSincePeriodStart = Math.floor((today - lastPeriodStart) / (1000 * 60 * 60 * 24));

      // Cycle day is days since period started + 1
      const currentDay = daysSincePeriodStart + 1; // Day 16

      // Calculate days until next period
      const nextPeriod = new Date('2026-11-07');
      const daysUntilPeriod = Math.floor((nextPeriod - today) / (1000 * 60 * 60 * 24)); // 13 days

      // Determine phase based on cycle day
      // Assuming 30-day cycle: Follicular (1-14), Ovulation (15-17), Luteal (18-30)
      let phase = 'ovulation';
      if (currentDay <= 14) phase = 'follicular';
      else if (currentDay <= 17) phase = 'ovulation';
      else phase = 'luteal';

      setCycleInfo({
        currentDay,
        phase,
        periodInDays: daysUntilPeriod,
        cycleLength: 30
      });
    };

    calculateCycleDay();
    fetchUser();
  }, []);

  const handleMicClick = () => {
    navigate('/calendar');
  };

  const handlePatternClick = () => {
    navigate('/insights');
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[#9d4235] text-[48px]">refresh</span>
    </div>;
  }

  return (
    <main className="w-full max-w-[430px] mx-auto min-h-screen bg-white relative flex flex-col pb-32">
      <header className="w-full px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-40 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <span className="material-symbols-outlined text-black text-[22px]">spa</span>
          </div>
          <div>
            <h1 className="text-[20px] font-black tracking-tight leading-none text-black">
              {t('home.greeting', { name: user?.name || 'User' })}
            </h1>
            <p className="text-[11px] tracking-wide font-extrabold mt-0.5 opacity-80 text-black">
              Cycle Day {cycleInfo.currentDay} · {cycleInfo.phase.charAt(0).toUpperCase() + cycleInfo.phase.slice(1)} Phase
            </p>
          </div>
        </div>
      </header>

      <div className="px-5 flex flex-col gap-5 mt-1">
        <CycleRing currentDay={cycleInfo.currentDay} periodInDays={cycleInfo.periodInDays} cycleLength={cycleInfo.cycleLength} phase={cycleInfo.phase} />

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
                View calendar & add logs
              </p>
            </div>
            <button
              aria-label="Go to calendar"
              onClick={handleMicClick}
              className="w-14 h-14 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center flex-shrink-0 cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-black text-[28px]">calendar_month</span>
            </button>
          </div>
        </section>

        <TipsCard phase={cycleInfo.phase} />

        <section
          onClick={handlePatternClick}
          className="w-full bg-[#F6D1C5] rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col gap-2.5 relative cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-black text-[20px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-black">{t('home.patternDetected')}</span>
              <p className="text-[15px] font-extrabold text-black leading-snug mt-0.5">Your cycles varied by 7 days over 3 months. Worth discussing with a doctor.</p>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <span className="inline-flex items-center gap-1 text-[13px] font-black text-black underline decoration-2 underline-offset-4">
              {t('home.learnMore')}
            </span>
          </div>
        </section>

        <TrendCard painTrends={null} timeframe="3months" />
      </div>

      <BottomNav />

      {/* Debug: Reset onboarding - remove in production */}
      <button
        onClick={handleResetOnboarding}
        className="fixed bottom-20 right-4 text-[10px] text-black/30 hover:text-black"
        title="Reset onboarding"
      >
        Reset
      </button>
    </main>
  );
}
