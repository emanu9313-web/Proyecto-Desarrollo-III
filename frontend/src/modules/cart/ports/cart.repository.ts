import { Product } from '../../catalog/ports/catalog.repository';

export interface CartLine { product: Product; quantity: number }

export interface CartRepository {
  list(): CartLine[];
  add(product: Product): CartLine[];
  remove(productId: string): CartLine[];
  clear(): CartLine[];
}
