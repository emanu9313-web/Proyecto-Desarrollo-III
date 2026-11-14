import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Product } from '../modules/catalog/ports/catalog.repository';
import { CartLine } from '../modules/cart/ports/cart.repository';
import { MemoryCartRepository } from '../modules/cart/adapters/memory-cart.repository';
interface CartValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  add(product: Product): void;
  remove(productId: string): void;
  clear(): void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [repository] = useState(() => new MemoryCartRepository());
  const [items, setItems] = useState<CartLine[]>([]);
  function add(product: Product) {
    setItems(repository.add(product));
  }
  function remove(productId: string) { setItems(repository.remove(productId)); }
  function clear() { setItems(repository.clear()); }
  const value = useMemo(() => ({
    items,
    count: items.reduce((total, line) => total + line.quantity, 0),
    subtotal: items.reduce((total, line) => total + line.product.price * line.quantity, 0),
    add,
    remove,
    clear,
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart debe usarse dentro de CartProvider');
  return value;
}
