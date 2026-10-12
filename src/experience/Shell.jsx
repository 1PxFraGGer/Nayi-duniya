import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiHeart, FiMapPin, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLocation as useCity } from '../context/LocationContext';
import { useResource } from './data';
import { tintFor } from './icons';
import CategoryIcon from './CategoryIcon';
import { BrandMark } from './UI';

const CITIES = ['All cities', 'Jaipur', 'Delhi', 'Mumbai', 'Bangalore'];
export const Brand = ({ to = '/', label = 'ServiceHub home' }) => <Link className="sh-brand" to={to} aria-label={label}><BrandMark /><span>service<span className="sh-brand-dot">hub</span></span></Link>;

function CategoryLink({ category, index }) {
  return <Link to={`/services/category/${category.id}`}><span className={`sh-cat-icon ${tintFor(index)}`} aria-hidden="true"><CategoryIcon name={category.name} /></span><span>{category.name}</span></Link>;
}

export function Header() {
  const { user, logout } = useAuth(); const { city, setCity } = useCity();
  const location = useLocation(); const navigate = useNavigate();
  // A menu is open only for the path it was opened on, so it closes itself on any navigation.
  const [openMenu, setOpenMenu] = useState(null); const [logoutError, setLogoutError] = useState(''); const [stuck, setStuck] = useState(false); const [q, setQ] = useState('');
  const wrap = useRef(null); const drawerClose = useRef(null);
  const is = name => openMenu?.name === name && openMenu.path === location.pathname;
  const toggle = name => setOpenMenu(is(name) ? null : { name, path: location.pathname });
  const cart = useResource(user ? '/cart' : null, 'cart', 'cartUpdated');
  const categories = useResource('/categories', 'categories');
  const count = (cart.data || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const drawer = is('drawer'); const mega = is('mega');

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!mega && !drawer) return undefined;
    const onKey = e => { if (e.key === 'Escape') setOpenMenu(null); };
    const onDown = e => { if (mega && wrap.current && !wrap.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [mega, drawer]);
  useEffect(() => {
    if (!drawer) return undefined;
    document.body.style.overflow = 'hidden'; drawerClose.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  async function signOut() { try { await logout(); setOpenMenu(null); navigate('/'); } catch { setLogoutError('Could not sign out. Please try again.'); } }
  function search(e) { e.preventDefault(); const term = q.trim(); setOpenMenu(null); navigate(`/services${term ? `?q=${encodeURIComponent(term)}` : ''}`); }
  const list = categories.data || [];

  return <><header className={`sh-header${stuck ? ' is-stuck' : ''}`}>
    <div className="sh-container sh-nav">
      <Brand />
      <nav className="sh-desktop-nav" aria-label="Main navigation">
        <NavLink to="/services" end>Services</NavLink>
        <div className="sh-nav-wrap" ref={wrap}>
          <button className="sh-menu-trigger" aria-expanded={mega} aria-controls="sh-mega" onClick={() => toggle('mega')}>Categories <FiChevronDown /></button>
          <div className={`sh-mega${mega ? ' is-open' : ''}`} id="sh-mega" role="region" aria-label="Service categories">
            {categories.loading ? <p className="sh-muted">Loading categories…</p> : list.length ? <div className="sh-mega-grid">{list.map((c, i) => <CategoryLink key={c.id} category={c} index={i} />)}</div> : <p className="sh-muted">Categories will appear here soon.</p>}
            <div className="sh-mega-foot"><span>{list.length} {list.length === 1 ? 'category' : 'categories'}</span><Link className="sh-inline-link" to="/categories">Browse all <FiArrowRight /></Link></div>
          </div>
        </div>
        <NavLink to="/popular-services">Popular</NavLink>
        <NavLink to="/daily-deals">Daily deals</NavLink>
        <NavLink to="/blogs">Journal</NavLink>
      </nav>
      <div className="sh-nav-tools">
        <form className="sh-nav-search" role="search" onSubmit={search}><FiSearch aria-hidden="true" /><label className="sh-sr-only" htmlFor="nav-search">Search services</label><input id="nav-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search services" /></form>
        <label className="sh-city sh-desktop-only"><FiMapPin aria-hidden="true" /><span className="sh-sr-only">Select city</span><select value={city} onChange={e => setCity(e.target.value)}>{CITIES.map(name => <option key={name}>{name}</option>)}</select></label>
        <Link className="sh-icon-button sh-desktop-only" to="/wishlist" aria-label="Saved services"><FiHeart /></Link>
        <Link className="sh-icon-button" to="/cart" aria-label={`Cart${count ? `, ${count} items` : ''}`}><FiShoppingBag />{count > 0 && <span className="sh-counter">{count}</span>}</Link>
        <Link className="sh-account-link sh-desktop-only" to={user ? '/account' : '/login'}><FiUser />{user ? 'My account' : 'Sign in'}</Link>
        <button className="sh-icon-button sh-menu-toggle" aria-label="Open menu" aria-expanded={drawer} aria-controls="sh-mobile-menu" onClick={() => toggle('drawer')}><FiMenu /></button>
      </div>
    </div>
  </header>
  <div className={`sh-drawer-root${drawer ? ' is-open' : ''}`}>
    <div className={`sh-drawer-backdrop${drawer ? ' is-open' : ''}`} onClick={() => setOpenMenu(null)} aria-hidden="true" />
    <nav className={`sh-mobile-menu${drawer ? ' is-open' : ''}`} id="sh-mobile-menu" aria-label="Mobile navigation" aria-hidden={!drawer} inert={!drawer}>
      <div className="sh-drawer-head"><Brand /><button ref={drawerClose} className="sh-icon-button" aria-label="Close menu" onClick={() => setOpenMenu(null)}><FiX /></button></div>
      <div className="sh-drawer-body">
        <form className="sh-drawer-search" role="search" onSubmit={search}><FiSearch aria-hidden="true" /><label className="sh-sr-only" htmlFor="drawer-search">Search services</label><input id="drawer-search" value={q} onChange={e => setQ(e.target.value)} placeholder="What do you need?" /><button className="sh-icon-button" aria-label="Search"><FiArrowRight /></button></form>
        <div><h3>Browse</h3><div className="sh-drawer-links">{[['/services', 'All services'], ['/popular-services', 'Popular services'], ['/daily-deals', 'Daily deals'], ['/blogs', 'Journal'], ['/about', 'About us']].map(([to, label]) => <Link key={to} to={to}>{label}<FiArrowUpRight /></Link>)}</div></div>
        {list.length > 0 && <div><h3>Categories</h3><div className="sh-drawer-cats">{list.map((c, i) => <CategoryLink key={c.id} category={c} index={i} />)}</div></div>}
        <div><h3>Your space</h3><div className="sh-drawer-links">{[['/wishlist', 'Saved services'], ['/my-bookings', 'My bookings'], ['/notifications', 'Notifications'], [user ? '/account' : '/login', user ? 'My account' : 'Sign in']].map(([to, label]) => <Link key={to} to={to}>{label}<FiArrowUpRight /></Link>)}{user && <button onClick={signOut}>Sign out</button>}</div><p role="alert" className="sh-danger">{logoutError}</p></div>
        <label className="sh-drawer-city"><FiMapPin aria-hidden="true" /><span className="sh-sr-only">Select city</span><select value={city} onChange={e => setCity(e.target.value)}>{CITIES.map(name => <option key={name}>{name}</option>)}</select></label>
      </div>
    </nav>
  </div></>;
}

export function Footer() {
  return <footer className="sh-footer"><div className="sh-container">
    <div className="sh-footer-top">
      <div><p className="sh-eyebrow">Ready when you are</p><h2>Find the right help, <em>book it your way.</em></h2><Link className="sh-button sh-button-accent" to="/services">Browse all services <FiArrowUpRight /></Link></div>
      <div className="sh-footer-links">
        <div><h3>Explore</h3><Link to="/services">All services</Link><Link to="/categories">Categories</Link><Link to="/popular-services">Popular services</Link><Link to="/daily-deals">Daily deals</Link><Link to="/blogs">Journal</Link></div>
        <div><h3>Company</h3><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/reviews">Reviews</Link><Link to="/careers">Careers</Link><Link to="/investors">Investors</Link></div>
        <div><h3>Your space</h3><Link to="/my-bookings">My bookings</Link><Link to="/account/addresses">My addresses</Link><Link to="/wishlist">Saved services</Link><Link to="/notifications">Notifications</Link></div>
      </div>
    </div>
    <div className="sh-footer-bottom"><Brand label="ServiceHub home" /><span>© {new Date().getFullYear()} ServiceHub</span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div>
  </div></footer>;
}
