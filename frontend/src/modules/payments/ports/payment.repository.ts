export interface CheckoutDetails {
  fullName: string;
  email: string;
  address: string;
  deliveryMethod: string;
}

export interface PaymentRepository {
  checkout(details: CheckoutDetails): Promise<{ status: 'SIMULATED' }>;
}
