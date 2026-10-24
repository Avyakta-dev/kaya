import { useTranslation } from '../i18n/index.jsx';

export default function TipsCard() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#F4A990] rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between pb-1 border-b-[2px] border-black">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-black text-[22px]">self_improvement</span>
          <h3 className="text-[20px] font-black text-black">{t('home.lutealPhase')}</h3>
        </div>
        <span className="bg-white border-[2px] border-black rounded-full px-2.5 py-0.5 text-[11px] font-black text-black shadow-[2px_2px_0px_#000000]">
          {t('home.lutealDays')}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#EE8070] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">restaurant</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">{t('home.eat')}</span>
            <span className="text-[13px] font-bold text-black">{t('home.eatDesc')}</span>
          </div>
        </div>

        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#F6D1C5] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">directions_walk</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">{t('home.move')}</span>
            <span className="text-[13px] font-bold text-black">{t('home.moveDesc')}</span>
          </div>
        </div>

        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#F4A990] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">coffee</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">{t('home.avoid')}</span>
            <span className="text-[13px] font-bold text-black">{t('home.avoidDesc')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
