import { PaymentRepository } from '../ports/payment.repository';

export class MockPaymentRepository implements PaymentRepository {
  async checkout(_details: { fullName: string; email: string; address: string; deliveryMethod: string }) {
    return { status: 'SIMULATED' as const };
  }
}

export const paymentRepository: PaymentRepository = new MockPaymentRepository();
