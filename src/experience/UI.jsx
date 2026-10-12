import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiHeart, FiShoppingBag, FiArrowRight, FiAlertCircle, FiMapPin, FiStar } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import { message, money, serviceIdOf, useResource } from './data';

export function BrandMark({ className = 'sh-brand-mark' }) {
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect className="m-bg" x="1" y="1" width="46" height="46" rx="14" /><path className="m-roof" d="M11 24 L24 12.5 L37 24 M17 22 V34.5 H31 V22" /><circle className="m-dot" cx="24" cy="28.5" r="2.8" /></svg>;
}
export function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <Motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .05 }} transition={{ duration: reduced ? 0 : .55, delay, ease: [.22, 1, .36, 1] }}>{children}</Motion.div>;
}
export function PageHead({ eyebrow = 'ServiceHub', title, description, children }) {
  return <Reveal className="sh-page-head"><div><p className="sh-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="sh-lead">{description}</p>}</div>{children}</Reveal>;
}
export function SectionHeading({ id, eyebrow, title, text, action }) {
  return <Reveal className="sh-section-heading"><div><p className="sh-eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2>{text && <p className="sh-lead">{text}</p>}</div>{action}</Reveal>;
}
export function Notice({ children, success = false }) { return children ? <p className={`sh-notice ${success ? 'is-success' : ''}`} role={success ? 'status' : 'alert'}>{children}</p> : null; }
export function Empty({ title, text, compact = false, children }) { return <div className={`sh-empty${compact ? ' is-compact' : ''}`}><span className="sh-empty-mark" aria-hidden="true">✦</span><h2>{title}</h2><p>{text}</p>{children === undefined ? <Link className="sh-button" to="/services">Explore services <FiArrowUpRight /></Link> : children}</div>; }
export function Loading({ count = 3, tiles = false }) { return <div className={tiles ? 'sh-category-skeletons' : 'sh-card-grid'} aria-busy="true" aria-label="Loading">{Array.from({ length: count }, (_, i) => <div key={i} className={`sh-skeleton${tiles ? ' is-tile' : ''}`} />)}</div>; }
export function LoadError({ error, retry }) { return <div className="sh-empty"><FiAlertCircle size={32} /><h2>Something got in the way.</h2><p role="alert">{error}</p><button className="sh-button" onClick={retry}>Try again <FiArrowRight /></button></div>; }
export function Photo({ src, alt = '', className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  return <img {...rest} className={className} src={!src || failed ? '/room.svg' : getImageUrl(src)} alt={alt} onError={() => setFailed(true)} loading={rest.loading || 'lazy'} decoding="async" />;
}
export function ServiceGrid({ children }) { return <div className="sh-service-grid">{children}</div>; }
export function ServiceCard({ service, saved = false, onSaved }) {
  const { user } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [busy, setBusy] = useState(''); const [notice, setNotice] = useState(''); const [added, setAdded] = useState(false);
  const lock = useRef(false);
  const id = serviceIdOf(service); const title = service.title || service.service_title || 'Home service';
  const score = Number(service.rating); const rated = score > 0 && score <= 5;
  const hasPrice = service.price != null && service.price !== '' && Number.isFinite(Number(service.price));
  const deal = Number(service.is_daily_deal) === 1; const popular = Number(service.is_popular) === 1;
  async function act(action) {
    if (!user) { navigate('/login', { state: { from: location.pathname + location.search } }); return; }
    if (lock.current) return;
    lock.current = true; setBusy(action); setNotice('');
    try {
      if (action === 'cart') { await API.post('/cart', { service_id: id, quantity: 1 }); setAdded(true); window.dispatchEvent(new Event('cartUpdated')); }
      else { if (saved) await API.delete(`/wishlist/${id}`); else await API.post('/wishlist', { service_id: id }); window.dispatchEvent(new Event('wishlistUpdated')); onSaved?.(); }
    } catch (error) { setNotice(message(error)); }
    finally { lock.current = false; setBusy(''); }
  }
  return <article className="sh-service-card">
    <div className="sh-card-photo"><Link to={`/services/${id}`} aria-label={`View ${title}`} tabIndex={-1}><Photo key={service.images?.[0] || service.image} src={service.images?.[0] || service.image} alt="" /></Link>
      {(deal || popular) && <span className={`sh-card-badge${deal ? ' is-deal' : ''}`}>{deal ? 'Daily deal' : 'Popular'}</span>}
      <button className={`sh-save ${saved ? 'is-saved' : ''}`} aria-label={`${saved ? 'Remove' : 'Save'} ${title}${saved ? ' from saved services' : ''}`} aria-pressed={saved} disabled={Boolean(busy)} onClick={() => act('save')}><FiHeart /></button>
    </div>
    <div className="sh-card-body">
      <div className="sh-card-meta"><span className="sh-chip">{service.category_name || 'Home services'}</span>{rated && <span className="sh-rating" aria-label={`Rated ${score.toFixed(1)} out of 5`}><FiStar aria-hidden="true" />{score.toFixed(1)}</span>}</div>
      <h3><Link to={`/services/${id}`}>{title}</Link></h3>
      {service.city && <p className="sh-card-loc"><FiMapPin aria-hidden="true" />{service.city}</p>}
      <div className="sh-card-foot">
        <p className="sh-card-price">{hasPrice && <small>Price</small>}{money(service.price)}</p>
        <div className="sh-card-actions"><button className="sh-cart-action" onClick={() => act('cart')} disabled={Boolean(busy) || added} aria-label={added ? `${title} added to cart` : `Add ${title} to cart`}><FiShoppingBag />{busy === 'cart' ? 'Adding…' : added ? 'Added' : 'Add'}</button><Link className="sh-view" to={`/services/${id}`} aria-label={`View details for ${title}`}><FiArrowUpRight /></Link></div>
      </div>
      <Notice>{notice}</Notice>
    </div>
  </article>;
}
// This colocated hook is shared by all card grids; component behavior is unchanged.
// eslint-disable-next-line react-refresh/only-export-components
export function useSavedServices() {
  const { user } = useAuth();
  const state = useResource(user ? '/wishlist' : null, 'wishlist', 'wishlistUpdated');
  return { ...state, ids: new Set((state.data || []).map(item => String(item.service_id ?? item.service?.id ?? item.id))) };
}
// Runs once the transition has swapped the new route in (or immediately on first load).
export function RouteFocus({ path }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [path]);
  useEffect(() => {
    const name = path.split('/').filter(Boolean)[0];
    document.title = name ? `${name.charAt(0).toUpperCase() + name.slice(1).replaceAll('-', ' ')} · ServiceHub` : 'ServiceHub — Home services, booked beautifully';
  }, [path]);
  return null;
}
