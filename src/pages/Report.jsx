import { useTranslation } from '../i18n/index.jsx';
import { mockReport } from '../lib/mock/report';
import LanguageToggle from '../components/LanguageToggle';
import BottomNav from '../components/BottomNav';

export default function Report() {
  const { t } = useTranslation();

  return (
    <main className="w-full max-w-[390px] min-h-screen bg-[#f9f9f9] relative flex flex-col pb-32">
      <header className="sticky top-0 z-40 bg-[#f9f9f9] flex justify-between items-center w-full px-5 py-4 border-b-[2.5px] border-black shadow-[0px_4px_0px_#000000]">
        <button
          aria-label="Go Back"
          className="w-10 h-10 rounded-full bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
        >
          <span className="material-symbols-outlined text-[20px] text-black">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#EE8070] text-[20px]" style={{ fontVariationSettings: 'FILL 1' }}>
              spa
            </span>
            <span className="text-[24px] font-black text-black tracking-tight">Kaya</span>
          </div>
          <span className="text-[11px] text-black opacity-80 -mt-1 tracking-wider uppercase">{t('report.title')}</span>
        </div>
        <button className="bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] rounded-full px-3 py-1 text-[11px] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform">
          EN | ಕನ್ನಡ | हिं
        </button>
      </header>

      <div className="px-5 pt-6 space-y-4">
        <section className="flex items-center justify-center gap-2 bg-[#F6D1C5] border-[2.5px] border-black rounded-full py-1 px-5 shadow-[3px_3px_0px_#000000]">
          <span className="material-symbols-outlined text-[#9d4235] text-[18px]" style={{ fontVariationSettings: 'FILL 1' }}>
            verified
          </span>
          <p className="text-[11px] text-black tracking-wide">{t('report.ready')}</p>
        </section>

        <article className="bg-white border-[2.5px] border-black rounded-[24px] shadow-[4px_4px_0px_#000000] p-4 space-y-4 relative overflow-hidden">
          <div className="border-b-[2.5px] border-black pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EE8070] border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                  <span className="material-symbols-outlined text-black text-[18px]">medical_services</span>
                </div>
                <div>
                  <p className="text-[11px] text-[#9d4235] tracking-widest font-black uppercase">{t('report.kayaSummary')}</p>
                  <p className="text-[13px] text-black opacity-70 text-[11px] leading-tight">
                    {t('report.generated')}
                  </p>
                </div>
              </div>
              <span className="bg-[#F6D1C5] text-black text-[11px] px-2 py-0.5 rounded-full border-[1.5px] border-black">
                {t('report.encrypted')}
              </span>
            </div>
            <h1 className="text-[20px] text-black mt-2.5 tracking-tight font-extrabold">{t('report.reportTitle')}</h1>
          </div>

          <section className="bg-[#F6D1C5] border-[2.5px] border-black rounded-[18px] p-3 shadow-[2px_2px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b-[1.5px] border-black border-dashed">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black text-[18px]">person</span>
                <span className="text-[13px] text-black font-extrabold">{mockReport.patient.name}, {mockReport.patient.age} yrs</span>
              </div>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border-[1.5px] border-black text-black">
                {mockReport.patient.lifeStage}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="bg-white p-2 rounded-xl border-[2px] border-black shadow-[1px_1px_0px_#000000]">
                <p className="text-[11px] text-black opacity-75 text-[10px]">{t('report.loggedInterval')}</p>
                <p className="text-[13px] font-bold text-black">{mockReport.loggedInterval}</p>
              </div>
              <div className="bg-white p-2 rounded-xl border-[2px] border-black shadow-[1px_1px_0px_#000000]">
                <p className="text-[11px] text-black opacity-75 text-[10px]">{t('report.avgCycle')}</p>
                <p className="text-[13px] font-bold text-[#9d4235]">{mockReport.avgCycleLength}</p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] text-black font-black flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black text-[18px]">calendar_month</span>
                {t('report.timeline')}
              </h2>
              <span className="text-[11px] text-[#9d4235] font-bold">Δ {mockReport.maxSpread} {t('insights.variationDesc').split(' ')[1]}</span>
            </div>

            <div className="space-y-2 pt-1">
              {mockReport.cycles.map((cycle, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-[14px] border-[2px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between ${
                    cycle.status === 'Delayed +9d' ? 'bg-[#F4A990]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full border-[2px] border-black flex flex-col items-center justify-center font-bold text-[11px] leading-tight ${
                        cycle.status === 'Delayed +9d' ? 'bg-white text-[#9d4235]' : 'bg-[#F6D1C5]'
                      }`}
                    >
                      <span>{cycle.month}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-black font-extrabold">{cycle.length}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border-[1px] border-black font-semibold ${
                            cycle.status === 'Delayed +9d'
                              ? 'bg-[#EE8070] text-black font-extrabold'
                              : 'bg-[#e8e8e8]'
                          }`}
                        >
                          {cycle.status}
                        </span>
                      </div>
                      <p className="text-[13px] text-black text-[11px] font-semibold">{cycle.details}</p>
                    </div>
                  </div>
                  <div className="w-12 h-3.5 bg-[#f3f3f3] rounded-full border-[1.5px] border-black overflow-hidden">
                    <div
                      className={`h-full border-r-[1.5px] border-black ${cycle.status === 'Delayed +9d' ? 'bg-[#9d4235]' : 'bg-[#EE8070]'}`}
                      style={{ width: `${cycle.severity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#9d4235] text-[20px]" style={{ fontVariationSettings: 'FILL 1' }}>
                stethoscope
              </span>
              <h2 className="text-[15px] text-black font-black">{t('report.flaggedPatterns')}</h2>
            </div>
            <div className="space-y-2">
              {mockReport.flaggedPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="p-2.5 border-[2px] border-black rounded-[16px] shadow-[2px_2px_0px_#000000]"
                  style={{ backgroundColor: pattern.color }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-black text-[17px]">{pattern.icon}</span>
                    <h3 className="text-[13px] text-black font-extrabold">{pattern.title}</h3>
                  </div>
                  <p className="text-[13px] text-black opacity-90 text-[12px] leading-snug">{pattern.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#e8e8e8] border-[1.5px] border-black rounded-xl p-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9d4235] text-[18px]">info</span>
              <p className="text-[11px] font-bold text-black leading-tight">{mockReport.clinicalNote}</p>
            </div>
          </section>

          <section className="bg-white border-[2.5px] border-black rounded-[18px] p-3 shadow-[2px_2px_0px_#000000] space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#feb198] border-[1.5px] border-black flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px] text-black">help</span>
              </div>
              <h2 className="text-[13px] text-black font-black">{t('report.suggestedQuestions')}</h2>
            </div>
            <ul className="space-y-2 pt-1 text-[12px] text-black leading-snug">
              {mockReport.suggestedQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2 bg-[#F6D1C5]/30 p-1.5 rounded-lg border-[1px] border-black">
                  <span className="material-symbols-outlined text-[#9d4235] text-[16px] mt-0.5 shrink-0" style={{ fontVariationSettings: 'FILL 1' }}>
                    check_box
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-center opacity-85">
            <span className="material-symbols-outlined text-[15px] text-black">lock</span>
            <p className="text-[11px] font-bold text-black tracking-wide">{t('report.hipaa')}</p>
          </div>
        </article>

        <section className="grid grid-cols-5 gap-2.5 pt-1">
          <button className="col-span-3 bg-[#EE8070] text-black border-[2.5px] border-black rounded-full py-3 px-5 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 font-black text-[15px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>{t('report.downloadPdf')}</span>
          </button>
          <button className="col-span-2 bg-white text-black border-[2.5px] border-black rounded-full py-3 px-5 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 font-black text-[15px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform">
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span>{t('report.share')}</span>
          </button>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
