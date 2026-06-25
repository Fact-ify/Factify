import type { NewsSource } from './types';

export const newsSources: NewsSource[] = [
  {
    id: 'bbc',
    name: 'BBC',
    domain: 'bbc.com',
    logo: 'BBC',
    defaultCredibility: 96,
    category: 'Mainstream',
  },
  {
    id: 'reuters',
    name: 'Reuters',
    domain: 'reuters.com',
    logo: 'R',
    defaultCredibility: 98,
    category: 'Mainstream',
  },
  {
    id: 'cnn',
    name: 'CNN',
    domain: 'cnn.com',
    logo: 'CNN',
    defaultCredibility: 88,
    category: 'Mainstream',
  },
  {
    id: 'al-jazeera',
    name: 'Al Jazeera',
    domain: 'aljazeera.com',
    logo: 'AJ',
    defaultCredibility: 91,
    category: 'Mainstream',
  },
  {
    id: 'ap',
    name: 'Associated Press',
    domain: 'apnews.com',
    logo: 'AP',
    defaultCredibility: 97,
    category: 'Mainstream',
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    domain: 'theguardian.com',
    logo: 'TG',
    defaultCredibility: 92,
    category: 'Mainstream',
  },
  {
    id: 'joy-news',
    name: 'Joy News',
    domain: 'myjoyonline.com',
    logo: 'JN',
    defaultCredibility: 82,
    category: 'Regional',
  },
  {
    id: 'citi-news',
    name: 'Citi News',
    domain: 'citinewsroom.com',
    logo: 'CN',
    defaultCredibility: 79,
    category: 'Regional',
  },
  {
    id: 'graphic-online',
    name: 'Graphic Online',
    domain: 'graphic.com.gh',
    logo: 'GO',
    defaultCredibility: 81,
    category: 'Regional',
  },
];

export function getSourceById(id: string): NewsSource | undefined {
  return newsSources.find((s) => s.id === id);
}

export function getSourceByName(name: string): NewsSource | undefined {
  return newsSources.find(
    (s) => s.name.toLowerCase() === name.toLowerCase() || s.id === name.toLowerCase()
  );
}
