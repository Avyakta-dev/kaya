import { mockPainTrends } from '../lib/mock/insights';
import { useTranslation } from '../i18n/index.jsx';

export default function TrendCard({ painTrends, timeframe }) {
  const { t } = useTranslation();

  const trends = painTrends || mockPainTrends;

  const getTimeframeLabel = () => {
    if (timeframe === '1month') return 'Last month';
    if (timeframe === '2months') return 'Last 2 months';
    if (timeframe === '3months') return 'Last 3 months';
    return 'Last 3 months';
  };

  return (
    <section className="w-full bg-white rounded-[24px] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-[20px] font-black text-black">{t('home.painLevels')}</h3>
          <p className="text-[13px] font-bold text-black opacity-75">{getTimeframeLabel()} comparison</p>
        </div>
        <div className="flex items-center gap-2 bg-[#F6D1C5] border-[2px] border-black rounded-full px-2.5 py-1">
          <span className="w-3 h-3 rounded-full bg-[#EE8070] border-[1.5px] border-black"></span>
          <span className="text-[11px] font-black text-black">{t('home.periodDays')}</span>
        </div>
      </div>

      <div className="w-full bg-[#F6D1C5]/40 rounded-[18px] border-[2.5px] border-black p-4 flex flex-col gap-3">
        <div className={`grid gap-4 items-end h-36 pt-4 pb-1 border-b-[2.5px] border-black ${
          trends.length === 1 ? 'grid-cols-1' : trends.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {trends.map((trend) => (
            <div key={trend.month} className="flex flex-col items-center h-full justify-end gap-1">
              <span className="text-[11px] font-black text-black capitalize">{trend.level}</span>
              <div
                className="w-full bg-[#F4A990] border-[2.5px] border-black rounded-t-xl flex flex-col justify-end p-1 relative"
                style={{ height: `${trend.height}%` }}
              >
                <div
                  className="w-full h-4 bg-[#EE8070] border-[2px] border-black rounded-sm mb-0.5"
                  style={{ height: `${trend.periodHeight}%` }}
                  title="Period peak"
                ></div>
              </div>
              <span className="text-[11px] font-black text-black mt-1">{trend.month}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
