import { Product } from '../../catalog/ports/catalog.repository';

export interface RecommendationsRepository {
  list(): Promise<Product[]>;
}
