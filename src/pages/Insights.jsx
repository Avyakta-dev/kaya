import { useState } from 'react';
import { useTranslation } from '../i18n/index.jsx';
import { mockInsights } from '../lib/mock/insights';
import InsightCard from '../components/InsightCard';
import ReportButton from '../components/ReportButton';
import LanguageToggle from '../components/LanguageToggle';
import BottomNav from '../components/BottomNav';

export default function Insights() {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState('3months');

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col relative pb-[90px] border-x-[2.5px] border-black mx-auto">
      <header className="bg-white text-black w-full px-5 py-4 border-b-[2.5px] border-black shadow-[0px_4px_0px_#000000] sticky top-0 z-40">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#EE8070] border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <span className="material-symbols-outlined text-[18px] text-black">spa</span>
            </div>
            <div className="flex items-baseline gap-1.5 ml-1">
              <span className="text-[24px] font-black tracking-tight text-black">Kaya</span>
              <span className="text-[13px] text-[#9d4235] font-extrabold tracking-wide uppercase">· {t('insights.title')}</span>
            </div>
          </div>
          <button className="bg-white border-[2.5px] border-black px-3 py-1 rounded-full text-[11px] text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
            EN | ಕನ್ನಡ | हिं
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        <section aria-label="Timeframe selection">
          <div className="bg-white border-[2.5px] border-black p-1.5 rounded-full shadow-[4px_4px_0px_#000000] flex items-center justify-between gap-1">
            {['1month', '3months', '6months'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-1.5 px-2 rounded-full text-center text-[13px] font-black text-black transition-all ${
                  timeframe === tf
                    ? 'bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white hover:bg-[#f3f3f3] border-[2px] border-transparent'
                }`}
              >
                {t(`insights.${tf.replace('months', 'Month')}`)}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[24px] border-[2.5px] border-black p-5 shadow-[4px_4px_0px_#000000] relative">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h2 className="text-[20px] font-black text-black leading-tight">{t('insights.cycleHistory')}</h2>
              <p className="text-[13px] text-[#56423f] font-bold mt-0.5">{t('insights.last3Cycles')}</p>
            </div>
            <div className="bg-[#ffdbcf] border-[2.5px] border-black rounded-full px-2.5 py-1 shadow-[2px_2px_0px_#000000] flex-shrink-0">
              <span className="text-[11px] font-black text-black">{t('insights.avgDays')}</span>
            </div>
          </div>

          <div className="mt-4 relative bg-[#f3f3f3] rounded-[16px] border-[2.5px] border-black p-3 pt-4">
            <div className="flex items-center justify-between text-[11px] text-[#56423f] mb-2 px-1">
              <span className="font-extrabold text-[10px] tracking-wide">{t('insights.cycleLength')}</span>
              <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border-[1.5px] border-black">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffdbcf] border border-black inline-block"></span>
                <span className="text-[10px] font-black text-black">{t('insights.typicalRange')}</span>
              </div>
            </div>

            <div className="w-full h-44 relative">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 310 145" xmlns="http://www.w3.org/2000/svg">
                <line opacity="0.3" stroke="#1b1b1b" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="300" y1="20" y2="20"></line>
                <line opacity="0.3" stroke="#1b1b1b" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="300" y1="65" y2="65"></line>
                <line opacity="0.3" stroke="#1b1b1b" strokeDasharray="3 3" strokeWidth="1" x1="30" x2="300" y1="110" y2="110"></line>
                <text className="text-[11px] font-bold" fill="#1b1b1b" x="5" y="24">
                  38d
                </text>
                <text className="text-[11px] font-bold" fill="#1b1b1b" x="5" y="69">
                  31d
                </text>
                <text className="text-[11px] font-bold" fill="#1b1b1b" x="5" y="114">
                  24d
                </text>
                <rect fill="#ffdbcf" fillOpacity="0.45" height="90" rx="8" stroke="#1b1b1b" strokeDasharray="4 2" strokeWidth="1.5" width="265" x="35" y="20"></rect>
                <path d="M 65 92 L 165 30 L 265 72" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" transform="translate(2, 2)"></path>
                <path d="M 65 92 L 165 30 L 265 72" stroke="#ee8070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <g transform="translate(65, 92)">
                  <circle cx="2" cy="2" fill="#000000" r="8"></circle>
                  <circle cx="0" cy="0" fill="#ee8070" r="7" stroke="#000000" strokeWidth="2.5"></circle>
                  <rect fill="#ffffff" height="18" rx="6" stroke="#000000" strokeWidth="2" width="34" x="-17" y="-28"></rect>
                  <text fill="#1b1b1b" fontSize="10" fontWeight="900" textAnchor="middle" x="0" y="-15">
                    28d
                  </text>
                </g>
                <g transform="translate(165, 30)">
                  <circle cx="2" cy="2" fill="#000000" r="8"></circle>
                  <circle cx="0" cy="0" fill="#ee8070" r="7" stroke="#000000" strokeWidth="2.5"></circle>
                  <rect fill="#ffffff" height="18" rx="6" stroke="#000000" strokeWidth="2" width="34" x="-17" y="-28"></rect>
                  <text fill="#1b1b1b" fontSize="10" fontWeight="900" textAnchor="middle" x="0" y="-15">
                    37d
                  </text>
                </g>
                <g transform="translate(265, 72)">
                  <circle cx="2" cy="2" fill="#000000" r="8"></circle>
                  <circle cx="0" cy="0" fill="#ee8070" r="7" stroke="#000000" strokeWidth="2.5"></circle>
                  <rect fill="#ffffff" height="18" rx="6" stroke="#000000" strokeWidth="2" width="34" x="-17" y="-28"></rect>
                  <text fill="#1b1b1b" fontSize="10" fontWeight="900" textAnchor="middle" x="0" y="-15">
                    30d
                  </text>
                </g>
                <line stroke="#000000" strokeWidth="2" x1="35" x2="300" y1="124" y2="124"></line>
                <text fill="#1b1b1b" fontSize="11" fontWeight="800" textAnchor="middle" x="65" y="140">
                  Aug
                </text>
                <text fill="#1b1b1b" fontSize="11" fontWeight="800" textAnchor="middle" x="165" y="140">
                  Sep
                </text>
                <text fill="#1b1b1b" fontSize="11" fontWeight="800" textAnchor="middle" x="265" y="140">
                  Oct
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 bg-white border-[2.5px] border-black rounded-[14px] p-2.5 flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
            <span className="material-symbols-outlined text-[#9d4235] text-[20px] flex-shrink-0">compare_arrows</span>
            <p className="text-[13px] font-bold text-black leading-tight">
              {t('insights.variation')} <span className="font-extrabold text-[#9d4235]">{t('insights.variationDesc')}</span>
            </p>
          </div>
        </section>

        <section aria-label="Cycle Insights" className="space-y-4">
          {mockInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </section>

        <section className="pt-1 pb-6 text-center space-y-1">
          <ReportButton />
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-[#56423f] font-bold pt-1">
            <span className="text-[13px]">🔒</span>
            <span>{t('insights.encrypted')}</span>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
