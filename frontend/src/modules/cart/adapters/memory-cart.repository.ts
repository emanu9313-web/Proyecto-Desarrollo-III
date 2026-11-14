import { Product } from '../../catalog/ports/catalog.repository';
import { CartLine, CartRepository } from '../ports/cart.repository';

export class MemoryCartRepository implements CartRepository {
  private items: CartLine[] = [];

  list() { return this.items; }

  add(product: Product) {
    const found = this.items.find((line) => line.product.id === product.id);
    this.items = found
      ? this.items.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...this.items, { product, quantity: 1 }];
    return this.items;
  }

  remove(productId: string) {
    this.items = this.items.filter((line) => line.product.id !== productId);
    return this.items;
  }

  clear() {
    this.items = [];
    return this.items;
  }
}
