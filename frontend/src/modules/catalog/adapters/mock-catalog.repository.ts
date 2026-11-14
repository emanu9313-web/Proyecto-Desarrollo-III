import { CatalogRepository, Product } from '../ports/catalog.repository';

const products: Product[] = [
  { id: '1', name: 'Sudadera Univalle', category: 'Ropa', price: 89000, oldPrice: 109000, rating: 4.9, badge: 'Más vendido', emoji: '🧥', tone: 'lilac', description: 'Sudadera suave de algodón con bordado universitario. Cómoda para clase, biblioteca y todo lo que venga después.' },
  { id: '2', name: 'Termo Campus', category: 'Accesorios', price: 52000, rating: 4.8, badge: 'Nuevo', emoji: '🥤', tone: 'mint', description: 'Termo reutilizable de acero inoxidable para acompañarte durante todo el día en el campus.' },
  { id: '3', name: 'Cuaderno de ideas', category: 'Papelería', price: 28000, rating: 4.7, emoji: '📓', tone: 'peach', description: 'Papel de alta calidad para apuntes, diagramas e ideas que empiezan en el salón y llegan más lejos.' },
  { id: '4', name: 'Tote de la U', category: 'Accesorios', price: 35000, rating: 4.9, badge: 'Favorito', emoji: '👜', tone: 'yellow', description: 'Lleva tus libros y esenciales con una bolsa resistente, liviana y hecha para moverte por el campus.' },
  { id: '5', name: 'Gorra Univalle', category: 'Ropa', price: 46000, rating: 4.6, emoji: '🧢', tone: 'blue', description: 'Un clásico para los días de sol. Ajuste cómodo y diseño limpio con identidad universitaria.' },
  { id: '6', name: 'Kit de estudio', category: 'Papelería', price: 39000, rating: 4.8, emoji: '✏️', tone: 'rose', description: 'Lo esencial para empezar el semestre: notas adhesivas, marcadores y lápices en un solo kit.' },
  { id: '7', name: 'Botella térmica', category: 'Accesorios', price: 61000, rating: 4.7, emoji: '🧴', tone: 'mint', description: 'Mantiene tus bebidas a la temperatura ideal mientras recorres la universidad.' },
  { id: '8', name: 'Camiseta de facultad', category: 'Ropa', price: 68000, rating: 4.9, badge: 'Edición campus', emoji: '👕', tone: 'peach', description: 'Camiseta de algodón suave para llevar con orgullo tu vida universitaria.' },
];

export class MockCatalogRepository implements CatalogRepository {
  async list(): Promise<Product[]> { return products; }
  async getById(id: string): Promise<Product | null> { return products.find((product) => product.id === id) ?? null; }
}

export const catalogRepository: CatalogRepository = new MockCatalogRepository();
