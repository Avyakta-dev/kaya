import { useTranslation } from '../i18n/index.jsx';

export default function LanguageToggle({ compact = false }) {
  const { t, language, changeLanguage } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिं' }
  ];

  if (compact) {
    return (
      <button className="text-[11px] font-bold text-[#56423f] hover:text-black flex items-center gap-1 transition-colors">
        <span className="material-symbols-outlined text-[13px]">language</span>
        <span>EN | ಕನ್ನಡ | हिं</span>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-[#F6D1C5] border-[2.5px] border-black shadow-[2px_2px_0px_#000000] text-[11px] font-bold text-black">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-1.5 py-0.5 rounded-full border-[1.5px] border-black font-black transition-all ${
            language === lang.code ? 'bg-[#EE8070] text-black' : 'opacity-85'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
