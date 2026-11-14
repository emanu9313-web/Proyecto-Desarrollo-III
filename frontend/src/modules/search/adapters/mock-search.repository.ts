import { catalogRepository } from '../../catalog/adapters/mock-catalog.repository';
import { SearchRepository } from '../ports/search.repository';

export class MockSearchRepository implements SearchRepository {
  async search(term: string) {
    const products = await catalogRepository.list();
    const normalized = term.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized),
    );
  }
}

export const searchRepository: SearchRepository = new MockSearchRepository();
