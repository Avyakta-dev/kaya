export const mockCycle = {
  currentDay: 22,
  currentPhase: 'luteal',
  periodInDays: 6,
  cycleLength: 31,
  phases: {
    follicular: { start: 1, end: 14, color: '#F6D1C5' },
    ovulation: { start: 15, end: 17, color: '#F4A990' },
    luteal: { start: 18, end: 31, color: '#EE8070' }
  },
  history: [
    { month: 'Aug', length: 28, status: 'typical', pain: 'mild', flow: 'normal' },
    { month: 'Sep', length: 37, status: 'delayed', pain: 'severe', flow: 'heavy' },
    { month: 'Oct', length: 30, status: 'resolved', pain: 'mild', flow: 'moderate' }
  ]
};
