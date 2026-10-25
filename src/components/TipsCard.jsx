import { useTranslation } from '../i18n/index.jsx';
import phaseTips from '../../content/phase-tips.json';

export default function TipsCard({ phase = 'luteal' }) {
  const { t } = useTranslation();

  const tips = phaseTips[phase] || phaseTips['luteal'];

  const phaseColors = {
    follicular: '#FFE4D6',  // Very light peach - more distinct from luteal
    ovulation: '#F4A990',
    luteal: '#EE8070'
  };

  const phaseDays = {
    follicular: 'Days 1-14',
    ovulation: 'Days 15-17',
    luteal: 'Days 18-30'
  };

  const bgColor = phaseColors[phase] || phaseColors['luteal'];

  return (
    <section className="w-full rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col gap-3.5" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between pb-1 border-b-[2px] border-black">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-black text-[22px]">self_improvement</span>
          <h3 className="text-[20px] font-black text-black">{tips.title.en}</h3>
        </div>
        <span className="bg-white border-[2px] border-black rounded-full px-2.5 py-0.5 text-[11px] font-black text-black shadow-[2px_2px_0px_#000000]">
          {phaseDays[phase] || phaseDays['luteal']}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#EE8070] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">restaurant</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">Eat:</span>
            <span className="text-[13px] font-bold text-black">{tips.eat.en.join(', ')}</span>
          </div>
        </div>

        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#F6D1C5] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">directions_walk</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">Move:</span>
            <span className="text-[13px] font-bold text-black">{tips.move.en.join(', ')}</span>
          </div>
        </div>

        <div className="bg-white rounded-full border-[2.5px] border-black px-3.5 py-2.5 flex items-center gap-3 shadow-[2px_2px_0px_#000000]">
          <div className="w-7 h-7 rounded-full bg-[#F4A990] border-[2px] border-black flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-black">coffee</span>
          </div>
          <div className="leading-tight">
            <span className="text-[13px] font-black text-black mr-1">Avoid:</span>
            <span className="text-[13px] font-bold text-black">{tips.avoid.en.join(', ')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
