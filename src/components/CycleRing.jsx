import { useTranslation } from '../i18n/index.jsx';

export default function CycleRing({ currentDay, periodInDays, cycleLength = 30, phase = 'luteal' }) {
  const { t } = useTranslation();

  // Calculate actual period days text
  const getPeriodText = () => {
    if (periodInDays === 0) return 'Period today';
    if (periodInDays === 1) return 'Period in 1 day';
    return `Period in ${periodInDays} days`;
  };

  // Get phase-specific suggestion
  const getPhaseSuggestion = () => {
    if (phase === 'follicular') return 'Energy increasing';
    if (phase === 'ovulation') return 'Fertile window';
    if (phase === 'luteal') return 'Rest recommended';
    return '';
  };

  const circumference = 2 * Math.PI * 82;
  // Adjust ring segments for 30-day cycle (accurate proportions)
  // Follicular: 14 days = 14/30 = 46.7% of circumference
  // Ovulation: 3 days = 3/30 = 10% of circumference
  // Luteal: 13 days = 13/30 = 43.3% of circumference
  const follicularLength = Math.round(circumference * 0.467); // ~240
  const ovulationLength = Math.round(circumference * 0.10);   // ~52
  const lutealLength = Math.round(circumference * 0.433);     // ~223

  // Phase colors - distinct for each phase
  const phaseColors = {
    follicular: '#FFE4D6',  // Very light peach - more distinct from luteal
    ovulation: '#F4A990',    // Peach
    luteal: '#EE8070'        // Coral
  };

  return (
    <section className="w-full bg-white rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col items-center relative overflow-hidden">
      <div className="relative w-56 h-56 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" fill="none" r="82" stroke="#FFFFFF" strokeWidth="18"></circle>
          <circle
            cx="100"
            cy="100"
            fill="none"
            r="82"
            stroke={phaseColors.follicular}
            strokeDasharray={`${follicularLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            strokeWidth="16"
          ></circle>
          <circle
            cx="100"
            cy="100"
            fill="none"
            r="82"
            stroke={phaseColors.ovulation}
            strokeDasharray={`${ovulationLength} ${circumference}`}
            strokeDashoffset={`-${follicularLength}`}
            strokeLinecap="round"
            strokeWidth="16"
          ></circle>
          <circle
            cx="100"
            cy="100"
            fill="none"
            r="82"
            stroke={phaseColors.luteal}
            strokeDasharray={`${lutealLength} ${circumference}`}
            strokeDashoffset={`-${follicularLength + ovulationLength}`}
            strokeLinecap="round"
            strokeWidth="18"
          ></circle>
          <circle cx="100" cy="100" fill="none" r="91" stroke="#000000" strokeWidth="2.5"></circle>
          <circle cx="100" cy="100" fill="none" r="73" stroke="#000000" strokeWidth="2.5"></circle>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[11px] uppercase tracking-wider text-black font-extrabold mb-0.5">
            {t('shared.current')}
          </span>
          <span className="text-[38px] text-black font-black tracking-tight leading-none mb-1">
            {t('shared.day')} {currentDay}
          </span>
          <div className="mt-2 bg-[#F6D1C5] border-[2.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000000]">
            <span className="text-[11px] font-black text-black">{getPeriodText()}</span>
          </div>
          <div className="mt-1.5 text-[10px] font-bold text-black opacity-70 text-center">
            {getPhaseSuggestion()}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-2 border-t-[2.5px] border-black mt-2 text-[11px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] border-black ${phase === 'follicular' ? 'bg-[#FFE4D6]' : 'bg-[#FFE4D6]/30'}`}></span>
          <span className={`text-black font-extrabold ${phase === 'follicular' ? '' : 'opacity-50'}`}>{t('shared.follicular')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] border-black ${phase === 'ovulation' ? 'bg-[#F4A990]' : 'bg-[#F4A990]/30'}`}></span>
          <span className={`text-black font-extrabold ${phase === 'ovulation' ? '' : 'opacity-50'}`}>{t('shared.ovulation')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-black bg-[#EE8070]"></span>
          <span className="text-black font-extrabold">{t('shared.luteal')}</span>
        </div>
      </div>
    </section>
  );
}
