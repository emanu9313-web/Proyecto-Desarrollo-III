import type { Product } from './ports/catalog.repository';

const productImages: Record<string, string> = {
  '1': 'sudadera',
  '2': 'termo',
  '3': 'cuaderno',
  '4': 'tote',
  '5': 'gorra',
  '6': 'kit',
  '7': 'botella',
  '8': 'camiseta',
};

export function ProductPhoto({ product, eager = false }: { product: Product; eager?: boolean }) {
  const image = productImages[product.id];
  return image
    ? <img className="campus-photo" src={`/campus/${image}.jpg`} alt="" loading={eager ? 'eager' : 'lazy'} width="440" height="440" />
    : <span className="product-emoji" aria-hidden="true">{product.emoji}</span>;
}
