export interface Product {
  id: string;
  category: string;
  brand: string;
  name: string;
  url: string;
  price: number;
  servings: number;
  grams: number;
  contentName?: string;
  contentGrams?: number;
  code: string | null;
  taste: number;
  date: string;
  approved: boolean;
}

export interface Comment {
  id: string;
  productId: string;
  text: string;
  taste: number;
  author: string;
  date: string;
}

export interface PendingProduct {
  id: string;
  category: string;
  brand: string;
  name: string;
  url: string;
  price: number;
  servings: number;
  grams: number;
  contentName?: string;
  contentGrams?: number;
  code: string | null;
  taste: number;
  date: string;
  suggestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Sadece simülasyon için
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Database {
  products: Product[];
  comments: Comment[];
  pendingProducts: PendingProduct[];
  users: User[];
  categories: string[];
  brands: string[];
}

export interface EnrichedProduct {
  product: Product;
  comments: Comment[];
  tasteAvg: number;
  metrics: {
    costPerServing: number;
    costPerGram: number;
    costPerContentGram: number;
  };
  rank: number;
}
