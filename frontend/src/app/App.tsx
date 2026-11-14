import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { catalogRepository } from '../modules/catalog/adapters/mock-catalog.repository';
import type { Product } from '../modules/catalog/ports/catalog.repository';
import { searchRepository } from '../modules/search/adapters/mock-search.repository';
import { recommendationsRepository } from '../modules/recommendations/adapters/mock-recommendations.repository';
import { ordersRepository } from '../modules/orders/adapters/mock-orders.repository';
import { paymentRepository } from '../modules/payments/adapters/mock-payment.repository';
import './styles.css';

const money = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="screen-loader"><span className="spinner" /> Cargando tu espacio…</div>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function Header() {
  const { user, signOut } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  if (location.pathname === '/login') return null;
  return <>
    <div className="announcement">Envío gratis en compras superiores a $150.000 <span>✦</span> Hecho para la comunidad Univalle</div>
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Univalle Shop, inicio"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <Link to="/">Inicio</Link><Link to="/?categoria=Ropa">Ropa</Link><Link to="/?categoria=Accesorios">Accesorios</Link><Link to="/recomendados">Recomendados</Link>
      </nav>
      <form className="header-search" onSubmit={(event) => { event.preventDefault(); navigate(`/buscar?q=${encodeURIComponent(search)}`); }}>
        <span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar productos" /><button aria-label="Enviar búsqueda">↗</button>
      </form>
      <div className="header-actions"><Link className="icon-link" to="/pedidos" aria-label="Mis pedidos">♧</Link><Link className="bag-link" to="/carrito" aria-label={`Carrito, ${cart.count} productos`}>♧ <span>{cart.count}</span></Link><div className="user-chip"><span className="avatar">{user?.fullName?.[0] ?? 'U'}</span><span className="user-name">{user?.fullName?.split(' ')[0]}</span></div><button className="logout" onClick={signOut}>Salir</button></div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div><Link to="/" className="brand footer-brand"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link><p>Lo que somos, también se lleva puesto.</p></div><div><strong>Explora</strong><Link to="/">Tienda</Link><Link to="/recomendados">Recomendados</Link><Link to="/pedidos">Mis pedidos</Link></div><div><strong>Comunidad</strong><span>Estudiantes</span><span>Docentes</span><span>Administrativos</span></div><div><strong>¿Necesitas ayuda?</strong><span>Preguntas frecuentes</span><span>Envíos y devoluciones</span><span>Contáctanos</span></div></div><div className="footer-bottom"><span>© 2026 Univalle Shop · Proyecto académico</span><span>Hecho con orgullo universitario <b>♥</b></span></div></footer>;
}

function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cart = useCart();
  return <article className="product-card" style={{ animationDelay: `${index * 45}ms` }}>
    <div className={`product-art tone-${product.tone}`}><Link className="product-art-link" to={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}><span className="art-orbit" /><span className="product-emoji">{product.emoji}</span></Link>{product.badge && <span className="badge">{product.badge}</span>}<button className="quick-add" aria-label={`Agregar ${product.name} al carrito`} onClick={() => cart.add(product)}>+</button></div>
    <div className="product-info"><div className="product-category">{product.category}</div><Link className="product-name" to={`/producto/${product.id}`}>{product.name}</Link><div className="product-meta"><span className="rating">★ {product.rating.toFixed(1)}</span><span className="product-price">{money(product.price)}</span></div></div>
  </article>;
}

function ProductGrid({ items }: { items: Product[] }) {
  return <div className="product-grid">{items.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>;
}

function HomePage() {
  const [items, setItems] = useState<Product[]>([]);
  const [category] = useSearchParams();
  useEffect(() => { void catalogRepository.list().then(setItems); }, []);
  const filtered = category.get('categoria') ? items.filter((item) => item.category === category.get('categoria')) : items;
  return <main>
    <section className="hero wrap"><div className="hero-copy"><div className="eyebrow"><span /> ES TUYA. VÍVELA.</div><h1>Tu vida universitaria,<br /><em>en otra frecuencia.</em></h1><p>Objetos para el día a día en la U. Diseñados para quienes hacen de cada semestre una historia.</p><Link className="button button-dark" to="#destacados">Explora la tienda <span>↗</span></Link><div className="hero-proof"><div className="proof-avatars"><span>🎓</span><span>✨</span><span>💚</span></div><span>La comunidad ya tiene sus favoritos</span></div></div><div className="hero-visual"><div className="hero-sticker">HECHO<br />PARA<br /><b>LA U</b></div><div className="hero-poster"><div className="poster-top">VALLE DEL CAUCA · COLOMBIA</div><div className="poster-sun" /><span className="poster-emoji">🧥</span><div className="poster-bottom"><b>LO NUESTRO<br />SE LLEVA.</b><span>UNIVERSIDAD<br />DEL VALLE</span></div></div><div className="hero-note">COLECCIÓN<br /><b>2026</b> <span>✳</span></div><div className="hero-spark">✳</div></div></section>
    <section className="benefits"><div><span>✳</span><b>Hecho para la U</b><small>Diseñado con identidad</small></div><i /><div><span>↗</span><b>Compra fácil</b><small>En pocos pasos, listo</small></div><i /><div><span>♡</span><b>De nuestra comunidad</b><small>Para quienes viven el campus</small></div><i /><div><span>◎</span><b>Recoge en campus</b><small>Pronto, más cerca de ti</small></div></section>
    <section className="section wrap" id="destacados"><div className="section-heading"><div><div className="eyebrow">UNA SELECCIÓN PARA TI</div><h2>Lo que está <em>sonando.</em></h2></div><Link className="text-link" to="/buscar?q=">Ver toda la tienda <span>↗</span></Link></div><ProductGrid items={filtered.slice(0, 4)} /></section>
    <section className="category-band wrap"><div><div className="eyebrow">ARMA TU COMBO</div><h2>Un semestre<br /><em>con estilo propio.</em></h2><Link className="button button-outline" to="/?categoria=Ropa">Encuentra tu favorito <span>↗</span></Link></div><div className="category-stack"><Link to="/?categoria=Ropa" className="category-tile tile-dark"><span>01 / ROPA</span><b>Viste<br />la U.</b><span className="tile-object">🧢</span><span className="tile-arrow">↗</span></Link><Link to="/?categoria=Accesorios" className="category-tile tile-sand"><span>02 / ACCESORIOS</span><b>Muévete<br />a tu ritmo.</b><span className="tile-object">👜</span><span className="tile-arrow">↗</span></Link></div></section>
    <section className="quote-band"><div className="quote-mark">“</div><p>La U no solo se estudia.<br /><em>Se vive.</em></p><span>UNIVERSIDAD DEL VALLE · DESDE EL CAMPUS</span><div className="quote-doodle">✳</div></section>
    <section className="section wrap last-section"><div className="section-heading"><div><div className="eyebrow">VISTOS Y RECOMENDADOS</div><h2>Los favoritos de <em>la comunidad.</em></h2></div><Link className="text-link" to="/recomendados">Descubrir más <span>↗</span></Link></div><ProductGrid items={items.slice(4, 8)} /></section>
  </main>;
}

function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  if (!loading && user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setFieldError('');
    const normalized = email.trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@correounivalle\.edu\.co$/.test(normalized)) {
      setFieldError('Usa tu correo institucional @correounivalle.edu.co'); return;
    }
    if (!password.trim()) { setFieldError('Escribe tu contraseña para continuar.'); return; }
    setBusy(true);
    try {
      await signIn(normalized, password);
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
      navigate(destination, { replace: true });
    } catch (reason) {
      const failure = reason as Error & { status?: number; code?: string };
      if (failure.status === 401) setError('El correo o la contraseña no coinciden. Inténtalo de nuevo.');
      else if (failure.status === 400 || failure.code === 'INVALID_EMAIL_DOMAIN') setError('Solo puedes ingresar con tu correo @correounivalle.edu.co.');
      else setError('No pudimos conectar con la tienda. Inténtalo de nuevo en un momento.');
    } finally { setBusy(false); }
  }

  return <main className="login-page"><div className="login-art"><Link to="/" className="brand login-brand"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link><div className="login-art-copy"><div className="eyebrow">QUÉ BUENO TENERTE DE VUELTA</div><h1>Tu espacio.<br /><em>Tu comunidad.</em></h1><p>Lo que buscas para vivir la U, está a un paso.</p></div><div className="login-collage"><span className="login-sun" /><span className="login-product">🧥</span><span className="login-collage-label">UNIVERSIDAD<br />DEL VALLE</span><span className="login-star">✳</span></div><div className="login-art-bottom"><span>UNIVERSIDAD DEL VALLE · CALI, COLOMBIA</span><span>DESDE EL CAMPUS, PARA EL CAMPUS</span></div></div><div className="login-panel"><div className="login-panel-inner"><Link className="back-link" to="/">← <span>Volver a la tienda</span></Link><div className="login-heading"><div className="eyebrow">INGRESO A LA COMUNIDAD</div><h2>Hola de nuevo<span>.</span></h2><p>Ingresa con tu correo institucional para continuar.</p></div><form className="login-form" onSubmit={submit} noValidate>
    <label htmlFor="email">Correo institucional</label><div className="input-wrap"><span>✉</span><input autoComplete="username" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correounivalle.edu.co" /></div>
    <label htmlFor="password">Contraseña</label><div className="input-wrap"><span>⌑</span><input autoComplete="current-password" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tu contraseña" /></div>
    {fieldError && <p className="field-error" role="alert">{fieldError}</p>}{error && <p className="form-error" role="alert"><span>!</span>{error}</p>}
    <button className="button button-red login-submit" disabled={busy}>{busy ? <><span className="spinner spinner-white" /> Entrando a la tienda…</> : <>Iniciar sesión <span>↗</span></>}</button>
    <p className="login-help">¿Problemas para ingresar? <a href="mailto:soporte@correounivalle.edu.co">Pide ayuda aquí</a></p>
    <div className="login-note"><span>✳</span><p>Univalle Shop es un espacio exclusivo para estudiantes, docentes y personal administrativo.</p></div>
  </form></div></div></main>;
}

function ListingPage({ title, kicker, items }: { title: string; kicker: string; items: Product[] }) {
  return <main className="listing-page wrap"><div className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><span>{title}</span></div><div className="listing-head"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>Encuentra algo que te acompañe durante el semestre.</p></div><span className="listing-count">{items.length} productos</span></div><ProductGrid items={items} /></main>;
}

function SearchPage() {
  const [params] = useSearchParams();
  const term = params.get('q')?.trim() ?? '';
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => { void searchRepository.search(term).then(setItems); }, [term]);
  return <ListingPage title={term ? `Resultados para “${term}”` : 'Toda la tienda'} kicker="ENCUENTRA TU PRÓXIMO FAVORITO" items={items} />;
}

function RecommendedPage() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => { void recommendationsRepository.list().then(setItems); }, []);
  return <ListingPage title="Favoritos de la comunidad" kicker="RECOMENDADOS PARA TI" items={items} />;
}

function ProductPage() {
  const cart = useCart();
  const { id = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { void catalogRepository.getById(id).then(setProduct); }, [id]);
  if (!product) return <main className="listing-page wrap"><Link to="/" className="text-link">← Volver a la tienda</Link><p>Este producto no está disponible.</p></main>;
  return <main className="product-detail wrap"><div className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><span>{product.name}</span></div><div className="detail-layout"><div className={`detail-art tone-${product.tone}`}><span className="art-orbit" /><span>{product.emoji}</span><i>UNIVALLE<br />SHOP</i></div><div className="detail-info"><div className="eyebrow">{product.category.toUpperCase()} · COLECCIÓN CAMPUS</div><h1>{product.name}</h1><div className="rating">★ {product.rating.toFixed(1)} <span>· 24 reseñas</span></div><div className="detail-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><p>{product.description}</p><div className="detail-option"><b>Color</b><span><i /> Campus original</span></div><div className="detail-option"><b>Talla</b><div className="size-options"><button>S</button><button>M</button><button className="selected">L</button><button>XL</button></div></div><button className="button button-red add-cart" onClick={() => cart.add(product)}>Agregar al carrito <span>↗</span></button><div className="detail-promise">✳ Compra segura <span>·</span> Envío disponible en Cali</div></div></div></main>;
}

function CartPage() {
  const cart = useCart();
  if (!cart.items.length) return <main className="empty-state wrap"><span>🛍️</span><div className="eyebrow">TU SELECCIÓN</div><h1>Tu carrito está <em>empezando.</em></h1><p>Cuando encuentres algo para ti, aquí lo tendrás listo.</p><Link className="button button-red" to="/">Explorar la tienda <span>↗</span></Link></main>;
  return <main className="listing-page wrap"><div className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><span>Carrito</span></div><div className="listing-head"><div><div className="eyebrow">TU SELECCIÓN</div><h1>Tu carrito</h1></div><span className="listing-count">{cart.count} productos</span></div><div className="cart-layout"><div className="cart-lines">{cart.items.map(({ product, quantity }) => <article className="cart-line" key={product.id}><div className={`cart-thumb tone-${product.tone}`}>{product.emoji}</div><div className="cart-product"><span>{product.category}</span><b>{product.name}</b><small>Cantidad: {quantity}</small></div><b className="cart-line-price">{money(product.price * quantity)}</b><button className="remove-item" onClick={() => cart.remove(product.id)}>Quitar</button></article>)}</div><aside className="cart-summary"><div className="eyebrow">RESUMEN DEL PEDIDO</div><p><span>Subtotal</span><b>{money(cart.subtotal)}</b></p><p><span>Envío</span><b>Se calcula después</b></p><hr /><p className="checkout-total"><span>Total estimado</span><b>{money(cart.subtotal)}</b></p><Link className="button button-red" to="/pago">Continuar al checkout <span>↗</span></Link><Link className="continue-shopping" to="/">Seguir explorando</Link></aside></div></main>;
}

function OrdersPage() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof ordersRepository.list>>>([]);
  useEffect(() => { void ordersRepository.list().then(setOrders); }, []);
  if (orders.length) return <main className="listing-page wrap"><div className="eyebrow">TU HISTORIAL</div><h1>Mis pedidos</h1>{orders.map((order) => <p key={order.id}>Pedido {order.id} · {order.status} · {money(order.total)}</p>)}</main>;
  return <main className="empty-state wrap"><span>📦</span><div className="eyebrow">TODO EN UN MISMO LUGAR</div><h1>Tus pedidos, <em>sin perderles la pista.</em></h1><p>Aún no tienes pedidos. Cuando hagas tu primera compra, la encontrarás aquí.</p><Link className="button button-red" to="/">Encuentra tu favorito <span>↗</span></Link></main>;
}

function PaymentPage() {
  const cart = useCart();
  const [complete, setComplete] = useState(false);
  if (complete) return <main className="empty-state wrap"><span>✳</span><div className="eyebrow">SIMULACIÓN COMPLETADA</div><h1>¡Todo listo, <em>por ahora!</em></h1><p>No se procesó ningún pago. Esta pantalla solo demuestra el flujo de checkout.</p><Link className="button button-red" to="/">Volver a la tienda <span>↗</span></Link></main>;
  return <main className="checkout-page wrap"><div className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><Link to="/carrito">Carrito</Link><span>/</span><span>Pago</span></div><div className="checkout-head"><div className="eyebrow">ÚLTIMO PASO</div><h1>Checkout <em>de prueba.</em></h1><p>Esta es una simulación académica. No se realizará ningún cobro.</p></div><form className="checkout-card" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); await paymentRepository.checkout({ fullName: String(form.get('fullName')), email: String(form.get('email')), address: String(form.get('address')), deliveryMethod: String(form.get('deliveryMethod')) }); setComplete(true); cart.clear(); }}><div><h2>Datos de entrega</h2><label>Nombre completo<input name="fullName" required placeholder="Tu nombre" /></label><label>Correo institucional<input name="email" required type="email" placeholder="nombre@correounivalle.edu.co" /></label><label>Dirección de entrega<input name="address" required placeholder="Dirección" /></label><label>Método de entrega<select name="deliveryMethod"><option>Recoger en campus</option><option>Envío local simulado</option></select></label></div><aside><h2>Resumen de prueba</h2><p><span>Productos ({cart.count})</span><b>{money(cart.subtotal)}</b></p><p><span>Envío</span><b>—</b></p><hr /><p className="checkout-total"><span>Total</span><b>{money(cart.subtotal)}</b></p><button className="button button-red">Finalizar pedido simulado <span>↗</span></button><small>Sin pasarela de pago · Sin cobros reales</small></aside></form></main>;
}

function Layout() {
  return <><Header /><Routes><Route path="/login" element={<LoginPage />} /><Route path="/*" element={<ProtectedRoute><><Routes><Route path="/" element={<HomePage />} /><Route path="/buscar" element={<SearchPage />} /><Route path="/recomendados" element={<RecommendedPage />} /><Route path="/producto/:id" element={<ProductPage />} /><Route path="/carrito" element={<CartPage />} /><Route path="/pedidos" element={<OrdersPage />} /><Route path="/pago" element={<PaymentPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><Footer /></></ProtectedRoute>} /></Routes></>;
}

export default function App() { return <Layout />; }
