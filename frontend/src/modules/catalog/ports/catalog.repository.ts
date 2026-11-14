export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  emoji: string;
  tone: string;
  description: string;
}

export interface CatalogRepository {
  list(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}
