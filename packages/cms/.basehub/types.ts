// Temporary dummy types for BaseHub
// Replace this with actual generated types when BaseHub token is configured

export interface BlockImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  publishedAt: string;
  updatedAt: string;
}

export interface BlogCollection {
  posts: BlogPost[];
}

// Add more types as needed
export type BaseHubQuery = Record<string, any>;
export type BaseHubResponse = Record<string, any>;
