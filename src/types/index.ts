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

export interface NewsSearchResult extends NewsArticle {
  verification: {
    classification: 'Real News' | 'Fake News' | 'Unverified';
    credibility: number;
    confidence: number;
    evidenceStrength: number;
    riskLevel: RiskLevel;
    verdict: Verdict;
  };
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

export type CMSFieldType = 'text' | 'textarea' | 'number';

export interface CMSField {
  id: string;
  key: string;
  label: string;
  type: CMSFieldType;
  value: string | number;
  placeholder?: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  route: string;
  description: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  fields: CMSField[];
}

export interface CMSArticle {
  id: string;
  title: string;
  summary: string;
  sourceId: string;
  category: string;
  region: string;
  status: 'published' | 'draft';
  publishedAt: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  status: 'published' | 'draft';
}

export interface CMSSiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaHeadline: string;
  ctaButtonText: string;
  statVerifications: number;
  statAccuracy: number;
  statSources: number;
  statMonitoring: string;
}

export interface DashboardSummary {
  totalSearches: number;
  verifiedStories: number;
  fakeNewsDetected: number;
  savedReports: number;
  weeklyActivity: number[];
  credibilityDistribution: { high: number; medium: number; low: number };
  popularCategories: { name: string; count: number; color: string }[];
  sourceReliabilityTrends: { month: string; reuters: number; bbc: number; ap: number }[];
}

export interface EvidenceItem {
  title: string;
  url: string;
  source: string;
  domain: string;
  publishedAt: string;
  excerpt: string;
  imageUrl?: string;
  provider: 'newsapi' | 'gnews' | 'bing' | 'tavily';
}
