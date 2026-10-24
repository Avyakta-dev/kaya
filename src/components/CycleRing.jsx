import { useTranslation } from '../i18n/index.jsx';

export default function CycleRing({ currentDay, periodInDays }) {
  const { t } = useTranslation();

  const circumference = 2 * Math.PI * 82;
  const follicularLength = 140;
  const ovulationLength = 120;
  const lutealLength = 170;

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
            stroke="#F6D1C5"
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
            stroke="#F4A990"
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
            stroke="#EE8070"
            strokeDasharray={`${lutealLength} ${circumference}`}
            strokeDashoffset={`-${follicularLength + ovulationLength}`}
            strokeLinecap="round"
            strokeWidth="18"
          ></circle>
          <circle cx="100" cy="100" fill="none" r="91" stroke="#000000" strokeWidth="2.5"></circle>
          <circle cx="100" cy="100" fill="none" r="73" stroke="#000000" strokeWidth="2.5"></circle>
        </svg>

        <div className="absolute top-4 right-10 w-6 h-6 rounded-full bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-black"></span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[11px] uppercase tracking-wider text-black font-extrabold mb-0.5">
            {t('shared.current')}
          </span>
          <span className="text-[38px] text-black font-black tracking-tight leading-none mb-1">
            {t('shared.day')} {currentDay}
          </span>
          <div className="mt-2 bg-[#F6D1C5] border-[2.5px] border-black rounded-full px-3 py-1 shadow-[2px_2px_0px_#000000]">
            <span className="text-[11px] font-black text-black">{t('shared.periodIn')}</span>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-2 border-t-[2.5px] border-black mt-2 text-[11px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#EE8070] border-[1.5px] border-black"></span>
          <span className="text-black font-extrabold">{t('shared.luteal')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F4A990] border-[1.5px] border-black"></span>
          <span className="text-black font-extrabold">{t('shared.ovulation')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F6D1C5] border-[1.5px] border-black"></span>
          <span className="text-black font-extrabold">{t('shared.follicular')}</span>
        </div>
      </div>
    </section>
  );
}
