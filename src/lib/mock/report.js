export const mockReport = {
  patient: {
    name: 'Priya S.',
    age: 26,
    lifeStage: 'Adult (Regular tracking)'
  },
  generated: 'Oct 24, 2024',
  version: 'v1.4 Encrypted',
  loggedInterval: '3 Cycles (Aug–Oct)',
  avgCycleLength: '31 Days (Varied)',
  maxSpread: '9 Days',
  cycles: [
    {
      month: 'AUG',
      length: '28 Days',
      status: 'Typical',
      details: 'Normal flow • Mild pain (2/5)',
      severity: 70
    },
    {
      month: 'SEP',
      length: '37 Days',
      status: 'Delayed +9d',
      details: 'Heavy cramps (4/5) in Luteal phase',
      severity: 95
    },
    {
      month: 'OCT',
      length: '30 Days',
      status: 'Resolved',
      details: 'Moderate flow • Mild fatigue & anxiety',
      severity: 76
    }
  ],
  flaggedPatterns: [
    {
      title: 'Cycle Length Variation (9 days)',
      icon: 'warning',
      color: '#F6D1C5',
      description: 'Fluctuation between Aug (28d) and Sep (37d) exceeds standard normal clinical variance threshold (>7d).'
    },
    {
      title: 'Luteal Cramping (Severity 4/5)',
      icon: 'priority_high',
      color: '#F4A990',
      description: 'Severe pelvic discomfort clustered for 3 consecutive days prior to menstruation in late September.'
    }
  ],
  clinicalNote: 'Clinically relevant for PCOS & progesterone hormone panel evaluation.',
  suggestedQuestions: [
    'Could my 9-day cycle fluctuation indicate an anovulatory cycle or early hormonal imbalance?',
    'Are severe premenstrual cramps (4/5) consistent with secondary dysmenorrhea or pelvic congestion?',
    'Should we run baseline bloodwork (FSH, LH, Prolactin, Total Testosterone & TSH)?'
  ]
};
