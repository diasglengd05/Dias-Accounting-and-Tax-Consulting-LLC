export interface Service {
  id: string;
  title: string;
  iconName: string; // references lucide icon name or specific component
  shortDesc: string;
  longDesc: string;
  inclusions: string[];
  regulatoryDeadlines?: string;
  benefits: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or rich-text format
  date: string;
  readTime: string;
  tag: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  keywords?: string[];
  schemaMarkup?: string; // JSON-LD schema markup string
  isAiGenerated?: boolean;
  generatedAt?: string;
  sourceTrends?: string[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  annualPrice: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  rating: number;
  avatarUrl?: string;
  location?: string;
  source?: "google" | "direct";
  reviewDate?: string;
  relativeTime?: string;
  serviceTag?: string;
  verified?: boolean;
  ownerResponse?: {
    text: string;
    date: string;
    author: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}


