import { useTranslation } from '../i18n/index.jsx';

export default function ReportButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="w-full bg-[#EE8070] text-black border-[2.5px] border-black py-3.5 px-6 rounded-full font-black text-[15px] shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
    >
      <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
      <span>{t('insights.exportPdf')}</span>
    </button>
  );
}
