import type { NewsArticle } from './types';

const categories = ['Politics', 'Technology', 'Health', 'Business', 'Science', 'World', 'Environment', 'Sports'];
const regions = ['Global', 'Africa', 'Europe', 'North America', 'Asia', 'Middle East'];

const articleTemplates = [
  { title: 'Global Climate Summit Reaches Historic Agreement on Emissions', sourceId: 'reuters', category: 'Environment' },
  { title: 'AI Breakthrough Promises Faster Medical Diagnosis', sourceId: 'bbc', category: 'Technology' },
  { title: 'Central Banks Signal Shift in Monetary Policy', sourceId: 'ap', category: 'Business' },
  { title: 'New Study Links Sleep Quality to Cognitive Performance', sourceId: 'guardian', category: 'Health' },
  { title: 'Space Agency Confirms Water Discovery on Lunar Surface', sourceId: 'cnn', category: 'Science' },
  { title: 'Regional Trade Bloc Expands Economic Partnership', sourceId: 'joy-news', category: 'Business' },
  { title: 'Election Commission Announces Updated Voter Registration', sourceId: 'citi-news', category: 'Politics' },
  { title: 'Infrastructure Investment Plan Approved by Parliament', sourceId: 'graphic-online', category: 'Politics' },
  { title: 'Renewable Energy Capacity Surpasses Fossil Fuels in Region', sourceId: 'al-jazeera', category: 'Environment' },
  { title: 'Tech Giants Face New Regulatory Framework in EU', sourceId: 'reuters', category: 'Technology' },
  { title: 'Healthcare Workers Demand Improved Safety Standards', sourceId: 'bbc', category: 'Health' },
  { title: 'Stock Markets Rally on Strong Employment Data', sourceId: 'ap', category: 'Business' },
  { title: 'Researchers Develop New Vaccine Delivery Method', sourceId: 'guardian', category: 'Science' },
  { title: 'Diplomatic Talks Resume After Months of Tension', sourceId: 'cnn', category: 'World' },
  { title: 'Local Farmers Adopt Smart Irrigation Technology', sourceId: 'joy-news', category: 'Technology' },
  { title: 'City Council Debates Public Transportation Expansion', sourceId: 'citi-news', category: 'Politics' },
  { title: 'National Team Qualifies for International Championship', sourceId: 'graphic-online', category: 'Sports' },
  { title: 'Humanitarian Aid Reaches Conflict-Affected Communities', sourceId: 'al-jazeera', category: 'World' },
  { title: 'Cybersecurity Experts Warn of Rising Phishing Attacks', sourceId: 'reuters', category: 'Technology' },
  { title: 'Mental Health Services Expanded in Rural Areas', sourceId: 'bbc', category: 'Health' },
  { title: 'Startup Ecosystem Attracts Record Venture Capital', sourceId: 'ap', category: 'Business' },
  { title: 'Archaeologists Uncover Ancient Settlement Site', sourceId: 'guardian', category: 'Science' },
  { title: 'International Court Rules on Maritime Dispute', sourceId: 'cnn', category: 'World' },
  { title: 'Solar Farm Project Creates Thousands of Jobs', sourceId: 'joy-news', category: 'Environment' },
  { title: 'Education Ministry Launches Digital Learning Initiative', sourceId: 'citi-news', category: 'Technology' },
  { title: 'Inflation Rate Shows Signs of Stabilization', sourceId: 'graphic-online', category: 'Business' },
  { title: 'Peacekeeping Mission Extended in Restive Region', sourceId: 'al-jazeera', category: 'World' },
  { title: 'Quantum Computing Milestone Achieved by Research Team', sourceId: 'reuters', category: 'Science' },
  { title: 'Wildlife Conservation Program Reports Population Recovery', sourceId: 'bbc', category: 'Environment' },
  { title: 'Athletes Break Multiple Records at National Games', sourceId: 'ap', category: 'Sports' },
];

export const newsArticles: NewsArticle[] = articleTemplates.map((template, index) => {
  const day = Math.max(1, 25 - (index % 25));
  const month = index < 15 ? 'June' : 'May';
  const region = regions[index % regions.length];

  return {
    id: `article-${index + 1}`,
    title: template.title,
    summary: `Comprehensive coverage of ${template.title.toLowerCase()}. Multiple sources have reported on this developing story with verified details and expert analysis from trusted journalists.`,
    sourceId: template.sourceId,
    url: `https://www.${template.sourceId === 'ap' ? 'apnews' : template.sourceId === 'al-jazeera' ? 'aljazeera' : template.sourceId === 'joy-news' ? 'myjoyonline' : template.sourceId === 'citi-news' ? 'citinewsroom' : template.sourceId === 'graphic-online' ? 'graphic.com.gh' : template.sourceId + '.com'}/news/${index + 1}`,
    thumbnail: `https://picsum.photos/seed/factify-${index + 1}/400/240`,
    publishedAt: `${month} ${day}, 2026`,
    category: template.category,
    region,
  };
});

export function getArticleById(id: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.id === id);
}

export function getArticlesForSearch(filters?: {
  category?: string;
  source?: string;
  region?: string;
  query?: string;
}): NewsArticle[] {
  let results = [...newsArticles];

  if (filters?.category && filters.category !== 'All') {
    results = results.filter((a) => a.category === filters.category);
  }
  if (filters?.source && filters.source !== 'All') {
    results = results.filter((a) => a.sourceId === filters.source);
  }
  if (filters?.region && filters.region !== 'All') {
    results = results.filter((a) => a.region === filters.region);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }

  return results.slice(0, 20);
}

export const articleCategories = ['All', ...categories];
export const articleRegions = ['All', ...regions];
