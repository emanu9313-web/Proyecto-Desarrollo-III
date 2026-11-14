import { Product } from '../../catalog/ports/catalog.repository';

export interface SearchRepository {
  search(term: string): Promise<Product[]>;
}
