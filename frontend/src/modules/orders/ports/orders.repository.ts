export interface OrderSummary {
  id: string;
  date: string;
  status: 'PENDING' | 'COMPLETED';
  total: number;
}

export interface OrdersRepository {
  list(): Promise<OrderSummary[]>;
}
