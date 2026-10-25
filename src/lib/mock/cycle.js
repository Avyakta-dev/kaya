export const mockCycle = {
  currentDay: 22,
  currentPhase: 'luteal',
  periodInDays: 6,
  cycleLength: 30,
  phases: {
    follicular: { start: 1, end: 14, color: '#F6D1C5' },
    ovulation: { start: 15, end: 17, color: '#F4A990' },
    luteal: { start: 18, end: 30, color: '#EE8070' }
  },
  history: [
    { month: 'Sep', length: 27, status: 'typical', pain: 'mild', flow: 'normal' },
    { month: 'Oct', length: 34, status: 'delayed', pain: 'severe', flow: 'heavy' }
  ]
};
