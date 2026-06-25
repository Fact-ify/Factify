export type Verdict = 'Likely True' | 'Likely False' | 'Unverified' | 'Partially True' | 'Misleading';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type SourceStance = 'Supports Claim' | 'Contradicts Claim' | 'Neutral' | 'Contradicts Trusted Sources';
export type SourceCategory = 'Mainstream' | 'Regional' | 'Independent' | 'Unknown' | 'Government' | 'Academic';

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  logo: string;
  defaultCredibility: number;
  category: SourceCategory;
}

export interface VerificationSource {
  id: string;
  sourceId: string;
  url: string;
  publishedAt: string;
  credibilityScore: number;
  stance: SourceStance;
  category: SourceCategory;
  excerpt?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceId: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  category: string;
  region: string;
}

export interface VerificationReport {
  id: string;
  claim: string;
  summary: string;
  verdict: Verdict;
  confidence: number;
  riskLevel: RiskLevel;
  sourceCredibility: number;
  evidenceStrength: number;
  aiExplanation: string;
  recommendations: string[];
  sources: VerificationSource[];
  createdAt: string;
  category: string;
}

export interface DashboardRecord {
  id: string;
  date: string;
  totalSearches: number;
  verifiedStories: number;
  fakeNewsDetected: number;
  savedReports: number;
  verificationActivity: number;
  credibilityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  popularCategories: { name: string; count: number }[];
  sourceReliability: { sourceId: string; score: number }[];
}

export interface TrendingFakeNews {
  id: string;
  title: string;
  claim: string;
  spreadLevel: 'Viral' | 'High' | 'Moderate' | 'Emerging';
  platforms: string[];
  detectedAt: string;
  verdict: Verdict;
  reportId: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  avatar: string;
  rating: number;
}
