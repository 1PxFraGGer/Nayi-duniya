import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { cityMatches, useResource } from './data';
import { tintFor } from './icons';
import CategoryIcon from './CategoryIcon';
import { Empty, Loading, LoadError, PageHead, Reveal, ServiceCard, ServiceGrid, useSavedServices } from './UI';
import { useLocation } from '../context/LocationContext';

export default function Catalog({ mode = 'all' }) {
  const { id } = useParams(); const [params, setParams] = useSearchParams(); const { city } = useLocation();
  const catalog = useResource('/services', 'services'); const categories = useResource('/categories', 'categories'); const saved = useSavedServices();
  const q = params.get('q') || ''; const sort = params.get('sort') || ''; const categoryId = id || params.get('category') || '';
  const category = (categories.data || []).find(item => String(item.id) === categoryId);
  const title = mode === 'popular' ? 'Popular services' : mode === 'deals' ? 'Daily deals' : category ? category.name : 'All services';
  const description = mode === 'popular' ? 'The services customers book most.' : mode === 'deals' ? 'Today’s special prices, while they last.' : category ? `Everything available under ${category.name}, in one place.` : 'Search, compare and choose the right service for your home.';
  const results = useMemo(() => {
    const filtered = (catalog.data || []).filter(service => {
      const text = `${service.title || ''} ${service.category_name || ''}`.toLowerCase();
      return text.includes(q.trim().toLowerCase()) && (!categoryId || String(service.category_id) === categoryId) && cityMatches(service, city) && (mode !== 'popular' || Number(service.is_popular) === 1) && (mode !== 'deals' || Number(service.is_daily_deal) === 1);
    });
    if (sort === 'low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'rating') filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    return filtered;
  }, [catalog.data, categoryId, city, mode, q, sort]);
  function update(key, value) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); }
  return <div className="sh-container sh-page">
    <nav className="sh-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span>{category ? <><Link to="/services">Services</Link><span aria-hidden="true">/</span><span aria-current="page">{category.name}</span></> : <span aria-current="page">{title}</span>}</nav>
    <PageHead eyebrow={mode === 'all' ? (category ? 'Category' : 'Browse') : 'Collection'} title={title} description={description} />
    <div className="sh-catalog-toolbar">
      <div className="sh-filter-bar">
        <label className="sh-search"><FiSearch aria-hidden="true" /><span className="sh-sr-only">Search services</span><input value={q} onChange={e => update('q', e.target.value)} placeholder="Search for a service…" />{q && <button type="button" aria-label="Clear search" onClick={() => update('q', '')}><FiX /></button>}</label>
        <label><span className="sh-sr-only">Sort services</span><select className="sh-select" value={sort} onChange={e => update('sort', e.target.value)}><option value="">Recommended</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Highest rated</option></select></label>
      </div>
      {mode === 'all' && <nav className="sh-chip-row" aria-label="Filter by category"><Link className={`sh-chip-link${!categoryId ? ' is-active' : ''}`} to="/services" aria-current={!categoryId ? 'page' : undefined}>All services</Link>{(categories.data || []).map(item => { const active = String(item.id) === categoryId; return <Link key={item.id} className={`sh-chip-link${active ? ' is-active' : ''}`} to={`/services/category/${item.id}`} aria-current={active ? 'page' : undefined}>{item.name}</Link>; })}{categories.error && <button className="sh-text-button" onClick={categories.refresh}>Retry categories</button>}</nav>}
    </div>
    <div className="sh-results-count" role="status">{catalog.loading ? 'Finding services…' : `${results.length} ${results.length === 1 ? 'service' : 'services'}`}<span>{city}</span></div>
    {catalog.loading ? <Loading count={6} /> : catalog.error ? <LoadError error={catalog.error} retry={catalog.refresh} /> : results.length ? <ServiceGrid>{results.map((service, index) => <Reveal key={service.id} delay={Math.min(index % 3 * .05, .15)}><ServiceCard service={service} saved={saved.ids.has(String(service.id))} /></Reveal>)}</ServiceGrid> : <Empty title="No matches just yet" text="Try another search, category or city."><button className="sh-button" onClick={() => setParams({})}>Clear filters</button></Empty>}
  </div>;
}

export function Categories() {
  const state = useResource('/categories', 'categories');
  return <div className="sh-container sh-page"><PageHead eyebrow="Categories" title="Everything your home needs" description="Choose a category to see its services." />{state.loading ? <Loading tiles count={8} /> : state.error ? <LoadError error={state.error} retry={state.refresh} /> : state.data?.length ? <div className="sh-category-grid">{state.data.map((item, index) => { return <Reveal key={item.id}><Link to={`/services/category/${item.id}`}><span className={`sh-cat-icon ${tintFor(index)}`} aria-hidden="true"><CategoryIcon name={item.name} /></span><h2>{item.name}</h2><span className="sh-inline-link">View services</span></Link></Reveal>; })}</div> : <Empty title="Categories are on their way" text="Browse the complete service collection instead." />}</div>;
}
