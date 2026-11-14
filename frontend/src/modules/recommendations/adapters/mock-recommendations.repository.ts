import { catalogRepository } from '../../catalog/adapters/mock-catalog.repository';
import { RecommendationsRepository } from '../ports/recommendations.repository';

export class MockRecommendationsRepository implements RecommendationsRepository {
  async list() {
    return (await catalogRepository.list()).slice().sort((a, b) => b.rating - a.rating);
  }
}

export const recommendationsRepository: RecommendationsRepository = new MockRecommendationsRepository();
