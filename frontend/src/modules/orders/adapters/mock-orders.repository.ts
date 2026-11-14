import { OrdersRepository } from '../ports/orders.repository';

export class MockOrdersRepository implements OrdersRepository {
  async list() { return []; }
}

export const ordersRepository: OrdersRepository = new MockOrdersRepository();
