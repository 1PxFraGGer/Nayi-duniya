import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiCheckCircle, FiSearch, FiTag } from 'react-icons/fi';
import { useLocation as useCity } from '../context/LocationContext';
import { cityMatches, groupByCategory, useResource } from './data';
import { tintFor } from './icons';
import CategoryIcon from './CategoryIcon';
import { CategoryDirectory, CategoryServicesSections, SectionsSkeleton } from './Sections';
import { Loading, LoadError, Reveal, SectionHeading, useSavedServices } from './UI';
import './home.css';
import QuickBook from './QuickBook';

const steps = [
  ['01', 'Pick a service', 'Browse by category or search. Prices and details are on the page before you commit.', <FiSearch />],
  ['02', 'Choose address and time', 'Select a saved address and the appointment that suits you. The service team confirms availability.', <FiCalendar />],
  ['03', 'Follow every update', 'Status, details and notifications live in your account, from request to completion.', <FiCheckCircle />],
];

export default function Home() {
  const [q, setQ] = useState(''); const navigate = useNavigate(); const { city } = useCity();
  const services = useResource('/services', 'services'); const categories = useResource('/categories', 'categories'); const faqs = useResource('/faqs', 'faqs'); const saved = useSavedServices();
  const visible = useMemo(() => (services.data || []).filter(s => cityMatches(s, city)), [services.data, city]);
  const groups = useMemo(() => groupByCategory(categories.data || [], visible), [categories.data, visible]);
  const counts = useMemo(() => new Map(groups.filter(g => g.category.id != null).map(g => [String(g.category.id), g.services.length])), [groups]);

  const catList = categories.data || [];
  return <div className="hm">
    <section className="hm-hero" aria-labelledby="hm-title">
      <div className="sh-container hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="sh-eyebrow">A little help. A better home.</p>
          <h1 id="hm-title">A happier home.<br/><em>A little help away.</em></h1>
          <p className="sh-lead">{services.data && categories.data ? `Browse ${services.data.length} services across ${catList.length} ${catList.length === 1 ? 'category' : 'categories'}. ` : ''}See the price, choose your time, and follow your booking from start to finish.</p>
          <form className="hm-search" role="search" onSubmit={e => { e.preventDefault(); navigate(`/services${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); }}>
            <FiSearch aria-hidden="true" /><label htmlFor="hm-search" className="sh-sr-only">Search home services</label>
            <input id="hm-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search electrical, plumbing, cleaning…" autoComplete="off" />
            <button className="sh-button" type="submit">Search <FiArrowRight /></button>
          </form>
          {catList.length > 0 && <div className="hm-quick" aria-label="Popular categories"><span>Browse:</span>{catList.slice(0, 5).map((c, i) => <Link key={c.id} to={`/services/category/${c.id}`}><CategoryIcon name={c.name} aria-hidden="true" className={tintFor(i)} />{c.name}</Link>)}</div>}
          <ul className="hm-points"><li><FiTag aria-hidden="true" />Prices shown upfront</li><li><FiCalendar aria-hidden="true" />You choose the slot</li><li><FiCheckCircle aria-hidden="true" />Track every booking</li></ul>
        </div>
        <div className="premium-hero-art"><img src="/home-interior.webp" width="900" height="900" alt="Bright, thoughtfully cared for living room with comfortable seating" fetchPriority="high"/><div className="premium-image-note"><FiCheckCircle/><span><strong>Your home. In good hands.</strong><small>Thoughtful services for everyday living</small></span></div></div>
      </div>
    </section>

    <div className="sh-container vc-trust-strip"><div><FiTag/><span><strong>Clear pricing</strong><small>See costs before you book</small></span></div><div><FiCalendar/><span><strong>Your schedule</strong><small>Pick a convenient appointment</small></span></div><div><FiCheckCircle/><span><strong>Stay in the loop</strong><small>Follow your booking online</small></span></div><div><FiSearch/><span><strong>One place for home care</strong><small>Find the service you need</small></span></div></div>
    {categories.loading ? <section className="hm-section sh-container" aria-label="Loading categories"><Loading tiles count={8} /></section>
      : categories.error ? <section className="hm-section sh-container"><LoadError error={categories.error} retry={categories.refresh} /></section>
      : catList.length ? <CategoryDirectory categories={catList} counts={counts} />
      : <section className="hm-section sh-container"><p className="sh-muted">Categories will appear here as soon as they are available.</p></section>}

    {categories.loading || services.loading ? <SectionsSkeleton />
      : services.error && !categories.error ? <section className="hm-section sh-container"><LoadError error={services.error} retry={services.refresh} /></section>
      : groups.length ? <CategoryServicesSections groups={groups} savedIds={saved.ids} /> : null}

    <section className="sh-container premium-booking"><div><p className="sh-eyebrow">Made for your everyday</p><h2>Less on your list.<br/><em>More time for you.</em></h2><p>Discover services, compare the details, and find a convenient appointment. Everything starts with the right help.</p><Link className="sh-inline-link" to="/services">Explore home services <FiArrowRight/></Link></div><QuickBook services={visible} categories={catList}/></section>
    <section className="hm-how" aria-labelledby="hm-how-title"><div className="sh-container hm-how-grid">
      <SectionHeading id="hm-how-title" eyebrow="How it works" title={<>Booked in <em>three simple steps.</em></>} text="No phone tag, no guesswork — just clear options and a booking you can follow." action={null} />
      <ol className="hm-steps">{steps.map(([n, title, text, icon]) => <li key={n}><Reveal><span className="hm-step-n">{n}</span><span className="hm-step-icon" aria-hidden="true">{icon}</span><div><h3>{title}</h3><p>{text}</p></div></Reveal></li>)}</ol>
    </div></section>

    <section className="sh-container hm-section sh-faq-layout" aria-labelledby="faq-title">
      <Reveal><p className="sh-eyebrow">Questions</p><h2 id="faq-title" className="hm-faq-title">Good questions, <em>straight answers.</em></h2><Link className="sh-pill-link" to="/contact">Talk to our team <FiArrowRight /></Link></Reveal>
      <div>{(faqs.data || []).slice(0, 6).map(f => <details className="sh-faq" key={f.id}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}{!faqs.data?.length && <p className="sh-muted">Every service page lists what is included. If you need help choosing, contact our team.</p>}</div>
    </section>
  </div>;
}





