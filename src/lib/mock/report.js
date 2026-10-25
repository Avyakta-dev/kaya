export const mockReport = {
  patient: {
    name: 'Priya S.',
    age: 19,
    lifeStage: 'Adult (Regular tracking)'
  },
  generated: 'Oct 25, 2026',
  version: 'v1.4 Encrypted',
  loggedInterval: '2 Cycles (Sep–Oct)',
  avgCycleLength: '30 Days (Varied)',
  maxSpread: '7 Days',
  cycles: [
    {
      month: 'SEP',
      length: '27 Days',
      status: 'Typical',
      details: 'Normal flow • Mild pain (2/5)',
      severity: 62
    },
    {
      month: 'OCT',
      length: '34 Days',
      status: 'Delayed +7d',
      details: 'Heavy cramps (4/5) in Luteal phase',
      severity: 92
    }
  ],
  flaggedPatterns: [
    {
      title: 'Cycle Length Variation (7 days)',
      icon: 'warning',
      color: '#F6D1C5',
      description: 'Fluctuation between Sep (27d) and Oct (34d) exceeds standard normal clinical variance threshold (>7d).'
    },
    {
      title: 'Luteal Cramping (Severity 4/5)',
      icon: 'priority_high',
      color: '#F4A990',
      description: 'Severe pelvic discomfort clustered for 3 consecutive days prior to menstruation in late October.'
    }
  ],
  clinicalNote: 'Clinically relevant for PCOS & progesterone hormone panel evaluation.',
  suggestedQuestions: [
    'Could my 7-day cycle fluctuation indicate an anovulatory cycle or early hormonal imbalance?',
    'Are severe premenstrual cramps (4/5) consistent with secondary dysmenorrhea or pelvic congestion?',
    'Should we run baseline bloodwork (FSH, LH, Prolactin, Total Testosterone & TSH)?'
  ]
};
