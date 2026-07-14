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
