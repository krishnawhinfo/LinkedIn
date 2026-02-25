export type Tone = 'Normal' | 'Professional' | 'Aggressive' | 'Bold' | 'Excited' | 'Inspirational' | 'Storytelling' | 'Analytical' | 'Contrarian' | 'Educational';

export type AppTab = 'profile' | 'content' | 'compare' | 'headlines' | 'viral' | 'calendar';

export interface ProfileAnalysis {
  score: number;
  breakdown: {
    seo: number;
    authority: number;
    clarity: number;
    engagement: number;
  };
  firstImpression: string;
  headlineReview: {
    works: string[];
    doesntWork: string[];
    suggestions: string[];
  };
  aboutReview: {
    clarity: string;
    authority: string;
    missingKeywords: string[];
    emotionalConnection: string;
    optimizedVersion: string;
  };
  experienceAnalysis: {
    isImpactDriven: boolean;
    metricsUsed: boolean;
    suggestions: string[];
  };
  seoOptimization: {
    missingKeywords: string[];
    industrySuggestions: string[];
  };
  visibilityGaps: {
    blockers: string[];
    algorithmSuggestions: string[];
  };
  brandingClarity: {
    positioning: string;
    nicheClarity: string;
  };
  growthStrategy: {
    contentSuggestions: string[];
    postingFrequency: string;
    networkingStrategy: string;
    engagementStrategy: string;
  };
  actionPlan: string[];
  fullReport: string;
}

export interface ComparisonResult {
  profile1: { name: string; score: number; strengths: string[] };
  profile2: { name: string; score: number; strengths: string[] };
  gapAnalysis: string;
  winner: string;
  recommendations: string[];
}

export interface HeadlineSuggestion {
  headlines: { text: string; strategy: string }[];
}

export interface ViralAnalysis {
  hookAnalysis: string;
  psychologicalTriggers: string[];
  structuralBreakdown: string;
  whyItWorked: string;
  recreationTips: string[];
}

export interface ContentCalendar {
  niche: string;
  goal: string;
  weeks: {
    week: number;
    days: { day: number; topic: string; postType: string; hookIdea: string }[];
  }[];
}

export interface LinkedInPost {
  summary: string;
  insights: string[];
  content: string;
  hashtags: string[];
  strategy: string;
  alternateHooks: string[];
  imagePrompt: string;
  imageUrl?: string;
  carouselOutline?: {
    slides: { title: string; content: string }[];
  };
}
