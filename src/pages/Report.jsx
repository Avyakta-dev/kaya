import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';
import BottomNav from '../components/BottomNav';

export default function Report() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get timeframe from URL params (passed from Insights)
  const timeframe = searchParams.get('timeframe') || '3months';

  // Generate comprehensive report data based on timeframe and actual symptom data
  const getReportData = (tf) => {
    const userName = localStorage.getItem('userName') || 'Priya S.';
    const userAge = parseInt(localStorage.getItem('userAge')) || 19;

    // Mock symptom data for each timeframe
    const symptomData = {
      '1month': {
        period: { severity: 4, flow: 'heavy', cramps: true },
        sleep: { severity: 3, issues: ['trouble staying asleep'] },
        mood: { severity: 3, issues: ['emotional swings'] },
        pain: { severity: 4, areas: ['abdomen', 'back'] },
        fatigue: { severity: 3 },
        headache: { severity: 4, type: 'migraine-like' },
        bloating: { severity: 3 },
        nausea: { severity: 2 }
      },
      '2months': {
        period: { severity: 3, flow: 'varied', cramps: true },
        sleep: { severity: 3, issues: ['insomnia', 'trouble staying asleep'] },
        mood: { severity: 3, issues: ['irritable', 'anxious', 'emotional swings'] },
        pain: { severity: 3, areas: ['abdomen', 'head', 'back'] },
        fatigue: { severity: 3 },
        headache: { severity: 3, type: 'tension, migraine' },
        bloating: { severity: 2 },
        nausea: { severity: 2 }
      },
      '3months': {
        period: { severity: 3, flow: 'varied', cramps: true },
        sleep: { severity: 3, issues: ['some trouble sleeping', 'insomnia', 'trouble staying asleep'] },
        mood: { severity: 3, issues: ['emotional', 'irritable', 'anxious', 'emotional swings'] },
        pain: { severity: 3, areas: ['abdomen', 'head', 'back'] },
        fatigue: { severity: 3 },
        headache: { severity: 3, type: 'slight, tension, migraine' },
        bloating: { severity: 2 },
        nausea: { severity: 2 }
      }
    };

    const symptoms = symptomData[tf];

    if (tf === '1month') {
      return {
        patient: {
          name: userName,
          age: userAge,
          lifeStage: 'Adult (Regular tracking)'
        },
        generated: 'Oct 25, 2026',
        version: 'v1.4 Encrypted',
        loggedInterval: '1 Month (Oct)',
        avgCycleLength: '34 Days',
        maxSpread: 'N/A',
        cycles: [
          {
            month: 'OCT',
            length: '34 Days',
            status: 'Delayed',
            details: 'Heavy flow • Severe cramps (4/5)',
            severity: 92
          }
        ],
        flaggedPatterns: [
          {
            title: 'Heavy Flow & Severe Cramps',
            icon: 'warning',
            color: '#F4A990',
            description: 'October period was heavier than usual with severe cramps (4/5) in abdomen and back. Flow intensity peaked at 4/5 for 3 days.'
          },
          {
            title: 'Sleep Disturbances',
            icon: 'bedtime',
            color: '#F6D1C5',
            description: 'Reported trouble staying asleep in October. Sleep quality has been affected during luteal phase.'
          },
          {
            title: 'Migraine-like Headache',
            icon: 'psychology',
            color: '#F4A990',
            description: 'Experienced migraine-like headache in October, possibly related to hormonal fluctuations.'
          }
        ],
        clinicalNote: 'Heavy flow, severe cramps, and sleep disturbances in luteal phase suggest possible hormonal imbalance. Recommended to track for another cycle.',
        suggestedQuestions: [
          'Is my heavy flow and severe cramps related to hormonal changes?',
          'Should we track sleep patterns and headache timing to confirm hormonal correlation?',
          'Could the sleep disturbances be related to the luteal phase?'
        ]
      };
    } else if (tf === '2months') {
      return {
        patient: {
          name: userName,
          age: userAge,
          lifeStage: 'Adult (Regular tracking)'
        },
        generated: 'Oct 25, 2026',
        version: 'v1.4 Encrypted',
        loggedInterval: '2 Months (Sep–Oct)',
        avgCycleLength: '30 Days (Varied)',
        maxSpread: '7 Days',
        cycles: [
          {
            month: 'SEP',
            length: '27 Days',
            status: 'Typical',
            details: 'Normal flow • Mild cramps (2/5)',
            severity: 62
          },
          {
            month: 'OCT',
            length: '34 Days',
            status: 'Delayed +7d',
            details: 'Heavy flow • Severe cramps (4/5)',
            severity: 92
          }
        ],
        flaggedPatterns: [
          {
            title: 'Cycle Length Variation (7 days)',
            icon: 'schedule',
            color: '#F6D1C5',
            description: 'Fluctuation between Sep (27d) and Oct (34d) exceeds standard normal clinical variance threshold (>7d).'
          },
          {
            title: 'Multiple Symptom Clusters',
            icon: 'health_and_safety',
            color: '#F4A990',
            description: 'Period tracked with pain (abdomen, head, back), mood issues (irritable, anxious), sleep problems (insomnia), fatigue, and nausea.'
          },
          {
            title: 'Sleep Quality Decline',
            icon: 'bedtime',
            color: '#F6D1C5',
            description: 'Sleep disturbances increased from mild issues in September to insomnia and trouble staying asleep in October.'
          }
        ],
        clinicalNote: '7-day cycle variation with multiple symptom clusters including sleep issues, mood changes, and pain suggests possible hormonal imbalance or stress.',
        suggestedQuestions: [
          'Could my 7-day cycle fluctuation indicate an anovulatory cycle or early hormonal imbalance?',
          'Are the sleep disturbances and mood changes correlated with my cycle phases?',
          'Should we consider lifestyle changes to reduce stress impact on cycle regularity?'
        ]
      };
    } else { // 3months
      return {
        patient: {
          name: userName,
          age: userAge,
          lifeStage: 'Adult (Regular tracking)'
        },
        generated: 'Oct 25, 2026',
        version: 'v1.4 Encrypted',
        loggedInterval: '3 Months (Aug–Oct)',
        avgCycleLength: '30 Days (Varied)',
        maxSpread: '7 Days',
        cycles: [
          {
            month: 'AUG',
            length: '28 Days',
            status: 'Typical',
            details: 'Normal flow • Mild cramps (2/5)',
            severity: 65
          },
          {
            month: 'SEP',
            length: '27 Days',
            status: 'Typical',
            details: 'Normal flow • Mild cramps (2/5)',
            severity: 62
          },
          {
            month: 'OCT',
            length: '34 Days',
            status: 'Delayed +7d',
            details: 'Heavy flow • Severe cramps (4/5)',
            severity: 92
          }
        ],
        flaggedPatterns: [
          {
            title: 'Cycle Length Variation (7 days)',
            icon: 'schedule',
            color: '#F6D1C5',
            description: 'Fluctuation between Aug (28d) and Oct (34d) exceeds standard normal clinical variance threshold (>7d). Recent increase in cycle length noted.'
          },
          {
            title: 'Multisystem Symptom Pattern',
            icon: 'health_and_safety',
            color: '#F4A990',
            description: 'Symptoms include: pain (abdomen, head, back), mood changes (emotional, irritable, anxious), sleep issues, fatigue, bloating, and nausea across all 3 months.'
          },
          {
            title: 'Progressive Sleep Disruption',
            icon: 'bedtime',
            color: '#F6D1C5',
            description: 'Sleep quality progressively declined from mild issues in August to insomnia in September and trouble staying asleep in October.'
          },
          {
            title: 'Recurring Headache Pattern',
            icon: 'psychology',
            color: '#F4A990',
            description: 'Headaches reported in all 3 months - slight headache in August, tension headache in September, and migraine-like in October.'
          }
        ],
        clinicalNote: '7-day cycle variation with multisystem symptoms across pain, mood, sleep, and digestive systems suggests comprehensive hormonal evaluation.',
        suggestedQuestions: [
          'Could the multisystem symptoms indicate a broader hormonal imbalance beyond just cycle length?',
          'Should we run comprehensive bloodwork (FSH, LH, Prolactin, Testosterone, TSH, Cortisol)?',
          'Are the recurring headaches and sleep disturbances potentially related to the luteal phase?',
          'Should we track temperature and cervical mucus to confirm ovulation patterns?'
        ]
      };
    }
  };

  const handleDownloadPdf = () => {
    // Generate PDF filename with date
    const date = new Date().toISOString().split('T')[0];
    const userName = reportData.patient?.name || 'User';
    const filename = `Kaya_Report_${userName}_${date}.pdf`;

    // Set document title for PDF filename
    document.title = filename;

    // Open print dialog - user can select "Save as PDF"
    window.print();

    // Reset document title after a delay
    setTimeout(() => {
      document.title = 'Kaya - Cycle & Symptom Tracker';
    }, 1000);
  };

  useEffect(() => {
    // Set report data based on timeframe
    setReportData(getReportData(timeframe));
    setLoading(false);
  }, [timeframe]);

  if (loading || !reportData) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[#9d4235] text-[48px]">refresh</span>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[390px] min-h-screen bg-[#f9f9f9] relative flex flex-col pb-32">
      <header className="sticky top-0 z-40 bg-[#f9f9f9] flex justify-between items-center w-full px-5 py-4 border-b-[2.5px] border-black shadow-[0px_4px_0px_#000000] no-print">
        <button
          onClick={() => navigate('/')}
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
      </header>

      <div className="px-5 pt-6 space-y-4">
        <section className="flex items-center justify-center gap-2 bg-[#F6D1C5] border-[2.5px] border-black rounded-full py-1 px-5 shadow-[3px_3px_0px_#000000] no-print">
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
                    Generated: {reportData.generated}
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
                <span className="text-[13px] text-black font-extrabold">
                  {reportData.patient?.name || 'Patient'}, {reportData.patient?.age || '—'} yrs
                </span>
              </div>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border-[1.5px] border-black text-black">
                {reportData.patient?.lifeStage || 'Adult'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="bg-white p-2 rounded-xl border-[2px] border-black shadow-[1px_1px_0px_#000000]">
                <p className="text-[11px] text-black opacity-75 text-[10px]">{t('report.loggedInterval')}</p>
                <p className="text-[13px] font-bold text-black">{reportData.loggedInterval || '—'}</p>
              </div>
              <div className="bg-white p-2 rounded-xl border-[2px] border-black shadow-[1px_1px_0px_#000000]">
                <p className="text-[11px] text-black opacity-75 text-[10px]">{t('report.avgCycle')}</p>
                <p className="text-[13px] font-bold text-[#9d4235]">{reportData.avgCycleLength || '—'}</p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] text-black font-black flex items-center gap-1.5">
                <span className="material-symbols-outlined text-black text-[18px]">calendar_month</span>
                {t('report.timeline')}
              </h2>
              <span className="text-[11px] text-[#9d4235] font-bold">Δ {reportData.maxSpread} days</span>
            </div>

            <div className="space-y-2 pt-1">
              {reportData.cycles.map((cycle, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-[14px] border-[2px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between ${
                    cycle.status && cycle.status.includes('Delayed') ? 'bg-[#F4A990]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full border-[2px] border-black flex flex-col items-center justify-center font-bold text-[11px] leading-tight ${
                        cycle.status && cycle.status.includes('Delayed') ? 'bg-white text-[#9d4235]' : 'bg-[#F6D1C5]'
                      }`}
                    >
                      <span>{cycle.month}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-black font-extrabold">{cycle.length}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border-[1px] border-black font-semibold ${
                            cycle.status && cycle.status.includes('Delayed')
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
                      className={`h-full border-r-[1.5px] border-black ${
                        cycle.status && cycle.status.includes('Delayed') ? 'bg-[#9d4235]' : 'bg-[#EE8070]'
                      }`}
                      style={{ width: `${cycle.severity || 70}%` }}
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
              {(reportData.flaggedPatterns || []).map((pattern, index) => (
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
            {reportData.clinicalNote && (
              <div className="bg-[#e8e8e8] border-[1.5px] border-black rounded-xl p-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9d4235] text-[18px]">info</span>
                <p className="text-[11px] font-bold text-black leading-tight">{reportData.clinicalNote}</p>
              </div>
            )}
          </section>

          <section className="bg-white border-[2.5px] border-black rounded-[18px] p-3 shadow-[2px_2px_0px_#000000] space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#feb198] border-[1.5px] border-black flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px] text-black">help</span>
              </div>
              <h2 className="text-[13px] text-black font-black">{t('report.suggestedQuestions')}</h2>
            </div>
            <ul className="space-y-2 pt-1 text-[12px] text-black leading-snug">
              {(reportData.suggestedQuestions || []).map((question, index) => (
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

        <section className="grid grid-cols-5 gap-2.5 pt-1 no-print">
          <button
            onClick={handleDownloadPdf}
            className="col-span-3 bg-[#EE8070] text-black border-[2.5px] border-black rounded-full py-3 px-5 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 font-black text-[15px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>{t('report.downloadPdf')}</span>
          </button>
          <button className="col-span-2 bg-white text-black border-[2.5px] border-black rounded-full py-3 px-5 shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 font-black text-[15px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform">
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span>{t('report.share')}</span>
          </button>
        </section>
      </div>

      <BottomNav className="no-print" />
    </main>
  );
}
