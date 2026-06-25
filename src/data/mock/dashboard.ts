import type { DashboardRecord } from './types';

export const dashboardRecords: DashboardRecord[] = Array.from({ length: 15 }, (_, i) => {
  const day = 25 - i;
  const month = day > 0 ? 'June' : 'May';
  const dateDay = day > 0 ? day : 30 + day;

  return {
    id: `dashboard-${i + 1}`,
    date: `${month} ${dateDay}, 2026`,
    totalSearches: 1200 + i * 89 + Math.floor(Math.random() * 50),
    verifiedStories: 340 + i * 23,
    fakeNewsDetected: 45 + i * 4,
    savedReports: 128 + i * 12,
    verificationActivity: 80 + (i % 7) * 15,
    credibilityDistribution: {
      high: 45 + (i % 10),
      medium: 30 + (i % 8),
      low: 15 + (i % 5),
    },
    popularCategories: [
      { name: 'Politics', count: 120 + i * 8 },
      { name: 'Health', count: 95 + i * 6 },
      { name: 'Technology', count: 88 + i * 5 },
      { name: 'World', count: 76 + i * 4 },
      { name: 'Business', count: 65 + i * 3 },
    ],
    sourceReliability: [
      { sourceId: 'reuters', score: 96 + (i % 3) },
      { sourceId: 'bbc', score: 94 + (i % 4) },
      { sourceId: 'ap', score: 95 + (i % 2) },
      { sourceId: 'guardian', score: 90 + (i % 5) },
      { sourceId: 'cnn', score: 86 + (i % 4) },
      { sourceId: 'joy-news', score: 80 + (i % 3) },
    ],
  };
});

export const dashboardSummary = {
  totalSearches: 2847,
  verifiedStories: 892,
  fakeNewsDetected: 156,
  savedReports: 423,
  weeklyActivity: [65, 78, 82, 91, 88, 95, 102],
  credibilityDistribution: { high: 52, medium: 31, low: 17 },
  popularCategories: [
    { name: 'Politics', count: 245, color: '#FCA311' },
    { name: 'Health', count: 198, color: '#14213D' },
    { name: 'Technology', count: 176, color: '#FCA311' },
    { name: 'World', count: 154, color: '#14213D' },
    { name: 'Business', count: 132, color: '#FCA311' },
    { name: 'Science', count: 98, color: '#14213D' },
  ],
  sourceReliabilityTrends: [
    { month: 'Jan', reuters: 97, bbc: 95, ap: 96 },
    { month: 'Feb', reuters: 97, bbc: 94, ap: 96 },
    { month: 'Mar', reuters: 98, bbc: 95, ap: 97 },
    { month: 'Apr', reuters: 98, bbc: 96, ap: 97 },
    { month: 'May', reuters: 98, bbc: 96, ap: 97 },
    { month: 'Jun', reuters: 98, bbc: 96, ap: 97 },
  ],
};
