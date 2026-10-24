import { useTranslation } from '../i18n/index.jsx';

export default function InsightCard({ insight }) {
  const { t } = useTranslation();

  return (
    <article
      className={`rounded-[24px] border-[2.5px] border-black p-5 shadow-[4px_4px_0px_#000000] relative`}
      style={{ backgroundColor: insight.color }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-white border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] flex-shrink-0">
          <span className="material-symbols-outlined text-[20px] text-black">{insight.icon}</span>
        </div>
        <div className="bg-white border-[2px] border-black px-3 py-0.5 rounded-full shadow-[2px_2px_0px_#000000]">
          <span className="text-[11px] font-black text-black">{insight.title}</span>
        </div>
      </div>

      <p className="text-[15px] font-bold text-black leading-snug">{insight.description}</p>

      {insight.discussWithDoctor && (
        <div className="mt-4 pt-1">
          <div className="inline-flex items-center gap-2 bg-white border-[2.5px] border-black rounded-full px-3.5 py-1.5 shadow-[2px_2px_0px_#000000]">
            <span className="text-sm">🩺</span>
            <span className="text-[11px] font-black text-black">{t('insights.discussDoctor')}</span>
          </div>
        </div>
      )}
    </article>
  );
}
