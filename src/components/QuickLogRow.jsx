import { mockSymptoms } from '../lib/mock/symptoms';
import { useTranslation } from '../i18n/index.jsx';

export default function QuickLogRow() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
      {mockSymptoms.map((symptom) => (
        <button
          key={symptom.id}
          className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F4A990] border-[2.5px] border-black shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px] text-black">{symptom.icon}</span>
          <span className="text-[13px] font-extrabold text-black">{t(`shared.${symptom.type}`)}</span>
        </button>
      ))}
    </div>
  );
}
