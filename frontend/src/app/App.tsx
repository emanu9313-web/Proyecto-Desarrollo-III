import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { catalogRepository } from '../modules/catalog/adapters/mock-catalog.repository';
import type { Product } from '../modules/catalog/ports/catalog.repository';
import { searchRepository } from '../modules/search/adapters/mock-search.repository';
import { recommendationsRepository } from '../modules/recommendations/adapters/mock-recommendations.repository';
import { ordersRepository } from '../modules/orders/adapters/mock-orders.repository';
import { paymentRepository } from '../modules/payments/adapters/mock-payment.repository';
import { ProductPhoto } from '../modules/catalog/ProductPhoto';
import './styles.css';
import './campus.css';

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
  const header = useRef<HTMLElement>(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const root = document.documentElement;
    const measure = () => root.style.setProperty('--shop-header-height', `${element.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--shop-header-height');
    };
  }, []);
  return <>
    <header ref={header} className="site-header">
      <Link to="/" className="brand" aria-label="Univalle Shop, inicio"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <Link to="/">Inicio</Link><Link to="/?categoria=Ropa">Ropa</Link><Link to="/?categoria=Accesorios">Accesorios</Link><Link to="/recomendados">Recomendados</Link>
      </nav>
      <form className="header-search" onSubmit={(event) => { event.preventDefault(); navigate(`/buscar?q=${encodeURIComponent(search)}`); }}>
        <span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar productos" /><button aria-label="Enviar búsqueda">↗</button>
      </form>
      <div className="header-actions">
        <NavLink className="orders-link" to="/pedidos">Pedidos</NavLink>
        <NavLink className="basket-link" to="/carrito" aria-label={`Carrito, ${cart.count} productos`}>
          Carrito <span key={cart.count} className={cart.count ? 'basket-count' : undefined}>{cart.count}</span>
        </NavLink>
        {user && <>
          <div className="user-chip"><span className="avatar">{user.fullName[0]}</span><span className="user-name">{user.fullName.split(' ')[0]}</span></div>
          <button className="logout" onClick={signOut}>Salir</button>
        </>}
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div><Link to="/" className="brand footer-brand"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link><p>Lo que somos, también se lleva puesto.</p></div><div><strong>Explora</strong><Link to="/">Tienda</Link><Link to="/recomendados">Recomendados</Link><Link to="/pedidos">Mis pedidos</Link></div><div><strong>Comunidad</strong><span>Estudiantes</span><span>Docentes</span><span>Administrativos</span></div><div><strong>¿Necesitas ayuda?</strong><span>Preguntas frecuentes</span><span>Envíos y devoluciones</span><span>Contáctanos</span></div></div><div className="footer-bottom"><span>© 2026 Univalle Shop · Proyecto académico</span><span>Hecho con orgullo universitario <b>♥</b></span></div></footer>;
}

function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const quantity = cart.items.find((line) => line.product.id === product.id)?.quantity ?? 0;
  const detailUrl = `/producto/${product.id}`;
  const [additions, setAdditions] = useState(0);
  function addToCart() {
    cart.add(product);
    setAdditions((count) => count + 1);
  }

  return (
    <article className="shop-card">
      <div className="shop-card-image">
        <Link to={detailUrl} aria-label={`Ver ${product.name}`}>
          <ProductPhoto product={product} />
        </Link>
        {additions > 0 && <span key={additions} aria-hidden="true" className="added-stamp">Al carrito ✓</span>}
        <button className="shop-add" type="button" onClick={addToCart}
          aria-label={`Agregar ${product.name} al carrito`}>
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <div className="shop-card-meta">
        <span>{product.category}</span>
        <span role="status">{quantity > 0 ? `${quantity} en carrito` : product.badge}</span>
      </div>
      <h3><Link to={detailUrl}>{product.name}</Link></h3>
      <strong>{money(product.price)}</strong>
    </article>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

function CampusCover({ products }: { products: Product[] }) {
  const [slide, setSlide] = useState(0);
  const index = products.length ? slide % products.length : 0;
  const product = products[index];
  function move(direction: number) {
    setSlide((current) => (current + direction + products.length) % products.length);
  }

  return (
    <section className="campus-cover" aria-label="Colección del campus">
      <div className="campus-intro">
        <p className="press-label">Tienda universitaria / Cali</p>
        <h1>La U<br /><em>se lleva.</em></h1>
        <p>Ropa, accesorios y papelería para la vida en el campus.</p>
        <a className="press-button" href="#destacados">Explorar el catálogo</a>
      </div>
      {product && (
        <div className="edition" aria-label="Productos destacados">
          <div className="edition-stage"
            onPointerMove={(event) => {
              if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
              const stage = event.currentTarget;
              const bounds = stage.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;
              stage.style.setProperty('--tilt-y', `${x * 12}deg`);
              stage.style.setProperty('--tilt-x', `${-y * 10}deg`);
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty('--tilt-x');
              event.currentTarget.style.removeProperty('--tilt-y');
            }}
          >
            <b className="edition-letter" aria-hidden="true">U</b>
            <Link key={product.id} className="edition-print" to={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}>
              <ProductPhoto product={product} eager />
            </Link>
          </div>
          <div className="edition-controls">
            <div className="edition-caption" aria-live="polite" aria-atomic="true">
              <small>{product.category} · {index + 1} de {products.length}</small>
              <Link to={`/producto/${product.id}`}>{product.name}</Link>
              <span>{money(product.price)}</span>
            </div>
            {products.length > 1 && <div className="edition-switch">
              <button type="button" aria-label="Producto destacado anterior" onClick={() => move(-1)}>‹</button>
              <button type="button" aria-label="Producto destacado siguiente" onClick={() => move(1)}>›</button>
            </div>}
          </div>
        </div>
      )}
    </section>
  );
}

function HomePage() {
  const [items, setItems] = useState<Product[]>([]);
  const [catalogState, setCatalogState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [params, setParams] = useSearchParams();
  const category = params.get('categoria') ?? '';
  const catalogue = useRef<HTMLElement>(null);
  useEffect(() => {
    let active = true;
    catalogRepository.list().then((products) => {
      if (active) { setItems(products); setCatalogState('ready'); }
    }).catch(() => { if (active) setCatalogState('error'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (category && catalogState === 'ready') catalogue.current?.scrollIntoView({ block: 'start' });
  }, [category, catalogState]);
  const categories = [...new Set(items.map((product) => product.category))];
  const filtered = category ? items.filter((product) => product.category === category) : items;
  function filterBy(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set('categoria', value);
    else next.delete('categoria');
    setParams(next, { preventScrollReset: true });
  }

  return (
    <main className="campus-home">
      <CampusCover products={items.slice(0, 4)} />
      <section className="campus-catalog wrap" id="destacados" ref={catalogue} aria-labelledby="catalog-title">
        <header className="campus-catalog-heading">
          <h2 id="catalog-title">Catálogo</h2>
          <span role="status">{catalogState === 'ready' && `${filtered.length} ${filtered.length === 1 ? 'producto' : 'productos'}`}</span>
        </header>
        <div className="campus-filters" role="group" aria-label="Filtrar por categoría">
          {['', ...categories].map((value) => (
            <button type="button" key={value} aria-pressed={category === value} onClick={() => filterBy(value)}>
              {value || 'Todos'}
            </button>
          ))}
        </div>
        {catalogState === 'loading' && <p role="status">Cargando productos…</p>}
        {catalogState === 'error' && <p role="alert">No pudimos cargar el catálogo. Vuelve a intentar al recargar la página.</p>}
        {catalogState === 'ready' && (filtered.length ? <ProductGrid items={filtered} /> : <p>No hay productos en esta categoría.</p>)}
      </section>
    </main>
  );
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

  return <main className="login-page"><div className="login-art"><Link to="/" className="brand login-brand"><span className="brand-mark">u</span><span>univalle<span className="brand-light">shop</span><small>TIENDA UNIVERSITARIA</small></span></Link><div className="login-art-copy"><div className="eyebrow">QUÉ BUENO TENERTE DE VUELTA</div><h1>Tu espacio.<br /><em>Tu comunidad.</em></h1><p>Lo que buscas para vivir la U, está a un paso.</p></div><div className="campus-login-print" aria-hidden="true"><img src="/campus/sudadera.jpg" alt="" /></div><div className="login-art-bottom"><span>UNIVERSIDAD DEL VALLE · CALI, COLOMBIA</span><span>DESDE EL CAMPUS, PARA EL CAMPUS</span></div></div><div className="login-panel"><div className="login-panel-inner"><Link className="back-link" to="/">← <span>Volver a la tienda</span></Link><div className="login-heading"><div className="eyebrow">INGRESO A LA COMUNIDAD</div><h2>Hola de nuevo<span>.</span></h2><p>Ingresa con tu correo institucional para continuar.</p></div><form className="login-form" onSubmit={submit} noValidate>
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
  const { id = '' } = useParams();
  const cart = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    catalogRepository.getById(id).then((result) => { if (active) setProduct(result); })
      .catch(() => { if (active) setProduct(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  if (loading) return <main className="wrap listing-page" role="status">Cargando producto…</main>;
  if (!product) return <main className="wrap listing-page"><h1>Producto no disponible</h1><Link to="/">Volver al catálogo</Link></main>;
  const quantity = cart.items.find((line) => line.product.id === product.id)?.quantity ?? 0;
  return (
    <main className="wrap campus-detail">
      <nav className="detail-crumb" aria-label="Ruta del producto"><Link to="/">Catálogo</Link> / {product.category}</nav>
      <div className="detail-layout">
        <div className="detail-plate"><ProductPhoto product={product} eager /></div>
        <section className="press-detail-info">
          <p className="press-label">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="press-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p>
          <p>{product.description}</p>
          <details className="product-help"><summary>¿Cómo continúo?</summary><p>Revisa tus productos en el carrito y continúa con los datos de entrega. El checkout es de prueba y no realiza cobros reales.</p></details>
          <p aria-label={`Valoración ${product.rating} de 5`}>★ {product.rating.toFixed(1)} / 5</p>
          <button type="button" className="press-button" onClick={() => cart.add(product)}>Agregar al carrito</button>
          <div className="bag-feedback" role="status">{quantity > 0 && <><p>¡Listo! Tienes {quantity} unidades en el carrito.</p><Link to="/carrito">Revisar mi carrito</Link></>}</div>
        </section>
      </div>
    </main>
  );
}

function CartPage() {
  const cart = useCart();
  if (!cart.items.length) return <main className="empty-state wrap"><span>🛍️</span><div className="eyebrow">TU SELECCIÓN</div><h1>Tu carrito está <em>empezando.</em></h1><p>Cuando encuentres algo para ti, aquí lo tendrás listo.</p><Link className="button button-red" to="/">Explorar la tienda <span>↗</span></Link></main>;
  return <main className="listing-page wrap"><div className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><span>Carrito</span></div><div className="listing-head"><div><div className="eyebrow">TU SELECCIÓN</div><h1>Tu carrito</h1></div><span className="listing-count">{cart.count} productos</span></div><div className="cart-layout"><div className="cart-lines">{cart.items.map(({ product, quantity }) => <article className="cart-line" key={product.id}><div className="cart-thumb"><ProductPhoto product={product} /></div><div className="cart-product"><span>{product.category}</span><b>{product.name}</b><small>Cantidad: {quantity}</small></div><b className="cart-line-price">{money(product.price * quantity)}</b><button className="remove-item" onClick={() => cart.remove(product.id)}>Quitar</button></article>)}</div><aside className="cart-summary"><div className="eyebrow">RESUMEN DEL PEDIDO</div><p><span>Subtotal</span><b>{money(cart.subtotal)}</b></p><p><span>Envío</span><b>Se calcula después</b></p><hr /><p className="checkout-total"><span>Total estimado</span><b>{money(cart.subtotal)}</b></p><Link className="button button-red" to="/pago">Continuar al checkout <span>↗</span></Link><Link className="continue-shopping" to="/">Seguir explorando</Link></aside></div></main>;
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
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return <>{location.pathname.replace(/\/+$/, '') !== '/login' && <Header />}<Routes><Route path="/login" element={<LoginPage />} /><Route path="/*" element={<ProtectedRoute><><Routes><Route path="/" element={<HomePage />} /><Route path="/buscar" element={<SearchPage />} /><Route path="/recomendados" element={<RecommendedPage />} /><Route path="/producto/:id" element={<ProductPage />} /><Route path="/carrito" element={<CartPage />} /><Route path="/pedidos" element={<OrdersPage />} /><Route path="/pago" element={<PaymentPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><Footer /></></ProtectedRoute>} /></Routes></>;
}

export default function App() { return <Layout />; }
