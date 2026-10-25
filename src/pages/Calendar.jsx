import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';
import { getLogs } from '../lib/api.js';
import BottomNav from '../components/BottomNav';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TYPE_ICONS = {
  pain: 'healing',
  cramps: 'healing',
  mood: 'sentiment_neutral',
  flow: 'water_drop',
  sleep: 'bedtime',
  fatigue: 'battery_low',
  bloating: 'air',
  headache: 'psychology',
  nausea: 'sick',
  spotting: 'water_drop',
  other: 'help',
};

/** Build an ISO date string from local date parts (avoids TZ drift). */
const iso = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const todayISO = () => {
  const n = new Date();
  return iso(n.getFullYear(), n.getMonth(), n.getDate());
};

const addDaysISO = (dateStr, n) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const daysBetween = (a, b) =>
  Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 86_400_000);

const label = (type) => type.charAt(0).toUpperCase() + type.slice(1);

export default function Calendar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const now = new Date();
  // Demo mode: Set to October 2026 (current month)
  const [view, setView] = useState({ year: 2026, month: 9 }); // October = month 9 (0-indexed)
  const [selected, setSelected] = useState('2026-10-25'); // Today's date in demo (has fatigue log)
  const [cycleLogs, setCycleLogs] = useState([]);
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [rules, setRules] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        // Demo mode: Use mock data if API fails
        let data;
        try {
          data = await getLogs(userId);
        } catch (apiErr) {
          console.log('API failed, using demo data');
          // Mock cycle data for 2 months (Sep-Oct 2026) with diverse symptom logs
          data = {
            cycleLogs: [
              { id: 1, user_id: userId, start_date: '2026-09-01', end_date: '2026-09-05', flow_intensity: 'normal' },
              { id: 2, user_id: userId, start_date: '2026-10-10', end_date: '2026-10-15', flow_intensity: 'heavy' }
            ],
            symptomLogs: [
              // September logs
              { id: 1, user_id: userId, date: '2026-09-02', type: 'mood', severity: 3, area: null, source: 'manual', note: 'Feeling irritable' },
              { id: 2, user_id: userId, date: '2026-09-03', type: 'pain', severity: 2, area: 'abdomen', source: 'manual', note: 'Mild cramps' },
              { id: 3, user_id: userId, date: '2026-09-08', type: 'headache', severity: 3, area: 'head', source: 'manual', note: 'Tension headache' },
              { id: 4, user_id: userId, date: '2026-09-12', type: 'bloating', severity: 2, area: 'abdomen', source: 'manual', note: 'Water retention' },
              { id: 5, user_id: userId, date: '2026-09-15', type: 'mood', severity: 4, area: null, source: 'manual', note: 'Anxious before period' },
              { id: 6, user_id: userId, date: '2026-09-20', type: 'sleep', severity: 4, area: null, source: 'manual', note: 'Insomnia, woke up 3 times' },
              { id: 7, user_id: userId, date: '2026-09-25', type: 'fatigue', severity: 3, area: null, source: 'manual', note: 'Low energy all day' },
              { id: 8, user_id: userId, date: '2026-09-28', type: 'nausea', severity: 2, area: null, source: 'manual', note: 'Mild morning nausea' },
              // October logs
              { id: 9, user_id: userId, date: '2026-10-02', type: 'mood', severity: 2, area: null, source: 'manual', note: 'Feeling better' },
              { id: 10, user_id: userId, date: '2026-10-05', type: 'sleep', severity: 2, area: null, source: 'manual', note: 'Slept well' },
              { id: 11, user_id: userId, date: '2026-10-10', type: 'pain', severity: 4, area: 'abdomen', source: 'manual', note: 'Period started, strong cramps' },
              { id: 12, user_id: userId, date: '2026-10-11', type: 'pain', severity: 3, area: 'back', source: 'manual', note: 'Lower back pain' },
              { id: 13, user_id: userId, date: '2026-10-12', type: 'pain', severity: 4, area: 'abdomen', source: 'voice', note: 'Severe cramps today' },
              { id: 14, user_id: userId, date: '2026-10-13', type: 'flow', severity: 4, area: null, source: 'manual', note: 'Heavy flow' },
              { id: 15, user_id: userId, date: '2026-10-14', type: 'fatigue', severity: 4, area: null, source: 'manual', note: 'Very tired from heavy flow' },
              { id: 16, user_id: userId, date: '2026-10-15', type: 'bloating', severity: 3, area: 'abdomen', source: 'manual', note: 'Still bloated' },
              { id: 17, user_id: userId, date: '2026-10-18', type: 'mood', severity: 3, area: null, source: 'manual', note: 'Emotional mood swings' },
              { id: 18, user_id: userId, date: '2026-10-21', type: 'headache', severity: 4, area: 'head', source: 'manual', note: 'Migraine-like headache' },
              { id: 19, user_id: userId, date: '2026-10-23', type: 'sleep', severity: 3, area: null, source: 'manual', note: 'Trouble staying asleep' },
              { id: 20, user_id: userId, date: '2026-10-25', type: 'fatigue', severity: 3, area: null, source: 'manual', note: 'Low energy' }
            ],
            rules: {
              currentDay: 16,
              phase: 'ovulation',
              next_period: '2026-11-07',
              avg_length: 30,
              flags: []
            }
          };
        }

        // Merge with user's local logs from localStorage
        const userLogs = JSON.parse(localStorage.getItem('userLogs') || '[]');
        if (userLogs.length > 0) {
          console.log('Merging user logs from localStorage:', userLogs);
          // Add user_id to each log
          const logsWithUserId = userLogs.map(log => ({ ...log, user_id: userId }));
          data.symptomLogs = [...data.symptomLogs, ...logsWithUserId];
        }

        setCycleLogs(data.cycleLogs || []);
        setSymptomLogs(data.symptomLogs || []);
        setRules(data.rules || null);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [location]); // Add location to re-fetch when navigating back from Log page

  // All period days (from cycle_logs: start_date .. end_date)
  const periodDates = useMemo(() => {
    const set = new Set();
    for (const cycle of cycleLogs) {
      if (!cycle.start_date) continue;
      const end = cycle.end_date || cycle.start_date;
      for (let d = cycle.start_date; d <= end; d = addDaysISO(d, 1)) {
        set.add(d);
      }
    }
    return set;
  }, [cycleLogs]);

  // Filter symptom logs to only show within the viewed month
  const filteredSymptomLogs = useMemo(() => {
    const { year, month } = view;
    const monthStart = iso(year, month, 1);
    const monthEnd = iso(year, month, new Date(year, month + 1, 0).getDate());
    
    return symptomLogs.filter(s => s.date >= monthStart && s.date <= monthEnd);
  }, [symptomLogs, view]);

  // Symptom dates → rows, keyed by date (filtered by current month)
  const symptomsByDate = useMemo(() => {
    const map = new Map();
    for (const s of filteredSymptomLogs) {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    }
    return map;
  }, [filteredSymptomLogs]);

  // Calendar grid cells for the viewed month (Monday-first, per design)
  const cells = useMemo(() => {
    const { year, month } = view;
    const firstDay = new Date(year, month, 1);
    const leading = (firstDay.getDay() + 6) % 7; // Mon = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const list = [];
    for (let i = leading - 1; i >= 0; i--) {
      list.push({ day: prevMonthDays - i, current: false, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      list.push({ day: d, current: true, date: iso(year, month, d) });
    }
    while (list.length % 7 !== 0) {
      list.push({ day: list.length - leading - daysInMonth + 1, current: false, date: null });
    }
    return list;
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const moveMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const today = '2026-10-25'; // Demo mode: Fixed today date
  const phase = rules?.phase ? rules.phase.toUpperCase() : '—';
  // Calculate cycle day based on days since last period start
  const cycleDay = rules?.currentDay ?? 22;
  const daysUntilPeriod =
    rules?.next_period != null ? daysBetween(rules.next_period, today) : 13;

  const selectedSymptoms = symptomsByDate.get(selected) || [];
  const selectedDateLabel = new Date(selected + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[#9d4235] text-[48px]">refresh</span>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[390px] min-h-screen bg-[#f9f9f9] flex flex-col relative pb-32 border-x-[2.5px] border-black mx-auto">
      {/* Top bar */}
      <header className="bg-[#f9f9f9] w-full px-5 py-3 border-b-[2.5px] border-black shadow-[0px_4px_0px_#000000] z-20 sticky top-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#9d4235] text-[20px]">spa</span>
            </div>
            <span className="text-[24px] font-black text-black tracking-tight ml-1">Kaya</span>
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 pt-4 flex flex-col gap-4">
        {/* Month navigation */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] text-black font-extrabold tracking-tight">{t('calendar.title')}</h1>
            <p className="text-[13px] text-[#56423f] font-bold">{t('calendar.subtitle')}</p>
          </div>
          <div className="flex items-center bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] rounded-full px-2 py-1 gap-1">
            <button
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
              className="w-6 h-6 flex items-center justify-center rounded-full active:bg-[#feb198] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-[13px] font-extrabold text-black px-1">{monthLabel}</span>
            <button
              aria-label="Next month"
              onClick={() => moveMonth(1)}
              className="w-6 h-6 flex items-center justify-center rounded-full active:bg-[#feb198] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Cycle status badge */}
        <section className="bg-[#ffdbcf] border-[2.5px] border-black shadow-[3px_3px_0px_#000000] rounded-full py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EE8070] border-[1.5px] border-black animate-pulse"></span>
            <span className="text-[11px] tracking-wide text-black font-black">
              {t('calendar.cycleDay', { day: cycleDay, phase })}
            </span>
          </div>
          {daysUntilPeriod != null && daysUntilPeriod > 0 && (
            <span className="text-[11px] font-extrabold bg-white px-2 py-0.5 rounded-full border-[1.5px] border-black text-black">
              {t('calendar.nextIn', { days: daysUntilPeriod })}
            </span>
          )}
        </section>

        {/* Calendar grid */}
        <section className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[24px] p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="text-[13px] font-extrabold text-black">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((cell, i) => {
              if (!cell.current) {
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-xl flex flex-col items-center justify-center opacity-30 text-[13px] font-bold text-black"
                  >
                    {cell.day}
                  </div>
                );
              }

              const isPeriod = periodDates.has(cell.date);
              const hasSymptom = symptomsByDate.has(cell.date);
              const isToday = cell.date === today;
              const isSelected = cell.date === selected;

              return (
                <button
                  key={i}
                  onClick={() => setSelected(cell.date)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isPeriod
                      ? 'bg-[#EE8070] border-[2px] border-black shadow-[1.5px_1.5px_0px_#000000]'
                      : isToday
                        ? 'bg-[#ffdbcf] border-[3px] border-black ring-2 ring-black shadow-[2px_2px_0px_#000000] scale-105 z-10'
                        : isSelected
                          ? 'bg-white border-[2px] border-black ring-2 ring-black'
                          : 'bg-[#f9f9f9] border-[2px] border-black'
                  }`}
                >
                  <span className={`text-[13px] text-black ${isPeriod || isSelected || isToday ? 'font-black' : 'font-bold'}`}>
                    {cell.day}
                  </span>
                  {isPeriod ? (
                    <span
                      className="material-symbols-outlined text-[10px] leading-none text-black"
                      style={{ fontVariationSettings: 'FILL 1' }}
                    >
                      water_drop
                    </span>
                  ) : hasSymptom ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#feb198] border border-black mt-0.5"></span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t-[2px] border-black flex flex-wrap items-center justify-around gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#EE8070] border-[1.5px] border-black inline-block"></span>
              <span className="text-[11px] font-extrabold text-black">{t('calendar.period')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#feb198] border-[1.5px] border-black inline-block"></span>
              <span className="text-[11px] font-extrabold text-black">{t('calendar.symptoms')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#ffdbcf] border-[2px] border-black ring-1 ring-black inline-block"></span>
              <span className="text-[11px] font-extrabold text-black">{t('calendar.today')}</span>
            </div>
          </div>
        </section>

        {/* Selected day details */}
        <section className="bg-[#ffdbcf] border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[24px] p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center pb-2 border-b-[2px] border-black">
            <div>
              <h2 className="text-[20px] font-black text-black">{selectedDateLabel}</h2>
              <span className="text-[11px] text-[#56423f] font-bold">{t('calendar.selectedEntry')}</span>
            </div>
            <span className="bg-white text-black border-[2px] border-black px-2.5 py-1 rounded-full text-[11px] font-black shadow-[2px_2px_0px_#000000]">
              {t('calendar.cycleDay', { day: cycleDay, phase })}
            </span>
          </div>

          {selectedSymptoms.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              {selectedSymptoms.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border-[2px] border-black rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-[2px_2px_0px_#000000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#feb198] border-[1.5px] border-black flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          {TYPE_ICONS[s.type] || 'healing'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-black">{label(s.type)}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-bold text-[#56423f]">Severity:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                className={`w-2 h-2 rounded-full border border-black ${
                                  n <= (s.severity || 0) ? 'bg-[#EE8070]' : 'bg-[#e2e2e2]'
                                }`}
                              ></span>
                            ))}
                          </div>
                          <span className="text-[11px] font-black text-black ml-1">{s.severity || '—'}/5</span>
                        </div>
                      </div>
                    </div>
                    {s.source === 'voice' && (
                      <span className="material-symbols-outlined text-[16px] text-black" aria-label="voice log">
                        graphic_eq
                      </span>
                    )}
                  </div>
                  {s.area && (
                    <div className="flex items-center gap-1.5 ml-10">
                      <span className="material-symbols-outlined text-[14px] text-black">pin_drop</span>
                      <span className="text-[11px] font-bold text-black capitalize">{s.area}</span>
                    </div>
                  )}
                  {s.note && (
                    <div className="bg-[#f9f9f9] border-[1.5px] border-black rounded-lg px-2 py-1 ml-10">
                      <p className="text-[11px] font-bold text-black italic">"{s.note}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-3">
              <span className="material-symbols-outlined text-black text-[28px]">event_available</span>
              <p className="text-[13px] font-extrabold text-black">
                {error || t('calendar.noLogs')}
              </p>
              {!error && <p className="text-[13px] font-bold text-[#56423f]">{t('calendar.emptyHint')}</p>}
            </div>
          )}
        </section>

        {/* Add log CTA */}
        <section className="pb-2">
          <button
            onClick={() => navigate('/log')}
            className="w-full bg-[#EE8070] text-black text-[20px] font-black border-[2.5px] border-black shadow-[4px_4px_0px_#000000] rounded-full py-3 px-4 flex items-center justify-center gap-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-[24px]"></span>
            <span>{t('calendar.addLog')}</span>
          </button>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
