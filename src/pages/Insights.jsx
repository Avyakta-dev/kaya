import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';
import { mockInsights } from '../lib/mock/insights';
import InsightCard from '../components/InsightCard';
import ReportButton from '../components/ReportButton';
import TrendCard from '../components/TrendCard';
import BottomNav from '../components/BottomNav';

export default function Insights() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('2months');

  // Mock data for different timeframes
  const getTimeframeData = (tf) => {
    if (tf === '1month') {
      return {
        subtitle: 'Last Month (Oct)',
        avgDays: '30 Days',
        months: ['Oct'],
        cycleLengths: [34],
        variation: 'N/A',
        painTrends: [
          { month: 'Oct', level: 'severe', height: 85, periodHeight: 75 }
        ],
        insights: [
          {
            id: 1,
            title: 'Heavy Flow & Fatigue',
            icon: 'water_drop',
            color: '#F4A990',
            description: 'October period was heavier than usual with fatigue. Flow intensity peaked at 4/5 for 3 days.',
            discussWithDoctor: true
          },
          {
            id: 2,
            title: 'Period-Related Discomfort',
            icon: 'bolt',
            color: '#F6D1C5',
            description: 'Experienced severe cramps (4/5) and migraine-like headache during period days.',
            discussWithDoctor: true
          }
        ]
      };
    } else if (tf === '2months') {
      return {
        subtitle: 'Last 2 Months (Sep–Oct)',
        avgDays: '30 Days',
        months: ['Sep', 'Oct'],
        cycleLengths: [27, 34],
        variation: '7 days',
        painTrends: [
          { month: 'Sep', level: 'moderate', height: 65, periodHeight: 55 },
          { month: 'Oct', level: 'severe', height: 85, periodHeight: 75 }
        ],
        insights: [
          {
            id: 1,
            title: 'Cycle Length Variation',
            icon: 'schedule',
            color: '#F6D1C5',
            description: 'Your cycle length shifted from 27 to 34 days over 2 months. Fluctuations above 7 days can point to hormonal changes or stress.',
            discussWithDoctor: true
          },
          {
            id: 2,
            title: 'Period-Related Discomfort',
            icon: 'bolt',
            color: '#F4A990',
            description: 'Cramps reached 4/5 severity for 3 consecutive days during period in October, accompanied by fatigue.',
            discussWithDoctor: true
          }
        ]
      };
    } else { // 3months
      return {
        subtitle: 'Last 3 Months (Aug–Oct)',
        avgDays: '30 Days',
        months: ['Aug', 'Sep', 'Oct'],
        cycleLengths: [28, 27, 34],
        variation: '7 days',
        painTrends: [
          { month: 'Aug', level: 'mild', height: 45, periodHeight: 40 },
          { month: 'Sep', level: 'moderate', height: 65, periodHeight: 55 },
          { month: 'Oct', level: 'severe', height: 85, periodHeight: 75 }
        ],
        insights: [
          {
            id: 1,
            title: 'Cycle Length Variation',
            icon: 'schedule',
            color: '#F6D1C5',
            description: 'Your cycle length shifted from 28 to 34 days over 3 months. Fluctuations above 7 days can point to hormonal changes or stress.',
            discussWithDoctor: true
          },
          {
            id: 2,
            title: 'Period-Related Discomfort',
            icon: 'bolt',
            color: '#F4A990',
            description: 'Cramps reached 4/5 severity for 3 consecutive days during period in October, accompanied by fatigue.',
            discussWithDoctor: true
          }
        ]
      };
    }
  };

  const data = getTimeframeData(timeframe);

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
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        <section aria-label="Timeframe selection">
          <div className="bg-white border-[2.5px] border-black p-1.5 rounded-full shadow-[4px_4px_0px_#000000] flex items-center justify-between gap-1">
            {['1month', '2months', '3months'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-1.5 px-2 rounded-full text-center text-[13px] font-black text-black transition-all ${
                  timeframe === tf
                    ? 'bg-[#EE8070] border-[2.5px] border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white hover:bg-[#f3f3f3] border-[2px] border-transparent'
                }`}
              >
                {tf === '1month' ? '1 Month' : tf === '2months' ? '2 Months' : '3 Months'}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[24px] border-[2.5px] border-black p-5 shadow-[4px_4px_0px_#000000] relative">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h2 className="text-[20px] font-black text-black leading-tight">{t('insights.cycleHistory')}</h2>
              <p className="text-[13px] text-[#56423f] font-bold mt-0.5">{data.subtitle}</p>
            </div>
            <div className="bg-[#ffdbcf] border-[2.5px] border-black rounded-full px-2.5 py-1 shadow-[2px_2px_0px_#000000] flex-shrink-0">
              <span className="text-[11px] font-black text-black">{data.avgDays}</span>
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
                <path d={data.months.length === 1 ? 'M 165 82' : data.months.length === 2 ? 'M 115 82 L 215 40' : 'M 65 85 L 165 82 L 265 40'} stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" transform="translate(2, 2)"></path>
                <path d={data.months.length === 1 ? 'M 165 82' : data.months.length === 2 ? 'M 115 82 L 215 40' : 'M 65 85 L 165 82 L 265 40'} stroke="#ee8070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                {data.months.map((month, i) => {
                  const x = data.months.length === 1 ? 165 : data.months.length === 2 ? 115 + i * 100 : 65 + i * 100;
                  const y = data.months.length === 1 ? 82 : data.months.length === 2 ? [82, 40][i] : [85, 82, 40][i];
                  return (
                    <g key={month} transform={`translate(${x}, ${y})`}>
                      <circle cx="2" cy="2" fill="#000000" r="8"></circle>
                      <circle cx="0" cy="0" fill="#ee8070" r="7" stroke="#000000" strokeWidth="2.5"></circle>
                      <rect fill="#ffffff" height="18" rx="6" stroke="#000000" strokeWidth="2" width="34" x="-17" y="-28"></rect>
                      <text fill="#1b1b1b" fontSize="10" fontWeight="900" textAnchor="middle" x="0" y="-15">
                        {data.cycleLengths[i]}d
                      </text>
                    </g>
                  );
                })}
                <line stroke="#000000" strokeWidth="2" x1="35" x2="300" y1="124" y2="124"></line>
                {data.months.map((month, i) => {
                  const x = data.months.length === 1 ? 165 : data.months.length === 2 ? 115 + i * 100 : 65 + i * 100;
                  return (
                    <text key={month} fill="#1b1b1b" fontSize="11" fontWeight="800" textAnchor="middle" x={x} y="140">
                      {month}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 bg-white border-[2.5px] border-black rounded-[14px] p-2.5 flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
            <span className="material-symbols-outlined text-[#9d4235] text-[20px] flex-shrink-0">compare_arrows</span>
            <p className="text-[13px] font-bold text-black leading-tight">
              Variation: <span className="font-extrabold text-[#9d4235]">{data.variation} difference across cycles</span>
            </p>
          </div>
        </section>

        <section aria-label="Cycle Insights" className="space-y-4">
          {data.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </section>

        <TrendCard painTrends={data.painTrends} timeframe={timeframe} />

        <section className="pt-1 pb-6 text-center space-y-1">
          <ReportButton timeframe={timeframe} />
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
