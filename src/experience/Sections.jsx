import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageUrl';
import { categoryTitle, HOME_LIMIT } from './data';
import { tintFor } from './icons';
import CategoryIcon from './CategoryIcon';
import { Empty, Reveal, ServiceCard, ServiceGrid, SectionHeading } from './UI';

const categoryPath = category => category.id != null ? `/services/category/${category.id}` : '/services';
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function CategoryCard({ category, index, count }) {
  const [failed, setFailed] = useState(false);
  const source = typeof category.image === 'string' ? category.image.trim() : '';
  return <Link className="hm-cat-card" to={categoryPath(category)}>
    <span className={`hm-cat-visual ${source && !failed ? '' : tintFor(index)}`} aria-hidden="true">
      {source && !failed ? <img src={getImageUrl(source)} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <CategoryIcon name={category.name} />}
    </span>
    <span className="hm-cat-info"><strong>{category.name}</strong><small>{plural(count, 'service')}</small></span>
    <span className="hm-cat-arrow" aria-hidden="true"><FiArrowUpRight /></span>
  </Link>;
}

/** SECTION 1 — every category from the backend, in backend order. */
export function CategoryDirectory({ categories, counts }) {
  return <section className="hm-section sh-container" aria-labelledby="hm-cats-title">
    <SectionHeading id="hm-cats-title" eyebrow="Browse by need" title="Explore Our Service Categories" text="Discover the right professionals and services for everything you need."
      action={<span className="hm-count-pill">{plural(categories.length, 'category').replace('categorys', 'categories')}</span>} />
    <div className="hm-cat-grid">{categories.map((category, i) => <Reveal key={category.id} delay={Math.min(i % 6, 5) * .04}><CategoryCard category={category} index={i} count={counts.get(String(category.id)) || 0} /></Reveal>)}</div>
  </section>;
}

/** One category's block: heading, View All, and at most HOME_LIMIT cards (3 per desktop row). */
export function CategoryServicesSection({ group, index, savedIds }) {
  const { category, services } = group;
  const shown = services.slice(0, HOME_LIMIT); const id = `hm-cat-${group.key}`.replace(/[^\w-]/g, '-');
  return <section className={`hm-cat-section${index % 2 ? ' is-alt' : ''}`} aria-labelledby={id}>
    <div className="sh-container">
      <Reveal className="hm-cat-head">
        <span className={`hm-cat-badge ${tintFor(index)}`} aria-hidden="true"><CategoryIcon name={category.name} /></span>
        <div className="hm-cat-title"><p className="hm-cat-kicker">Category {String(index + 1).padStart(2, '0')}</p><h2 id={id}>{categoryTitle(category.name)}</h2>
          <p className="hm-cat-meta">{services.length ? (services.length > shown.length ? `Showing ${shown.length} of ${services.length} services` : plural(services.length, 'service')) : 'No services listed yet'}</p></div>
        <Link className="sh-pill-link" to={categoryPath(category)} aria-label={`View all ${categoryTitle(category.name)}`}>View All <FiArrowRight /></Link>
      </Reveal>
      {shown.length ? <ServiceGrid>{shown.map((service, i) => <Reveal key={service.id} delay={i % 3 * .06}><ServiceCard service={service} saved={savedIds.has(String(service.id))} /></Reveal>)}</ServiceGrid>
        : <Empty compact title="Services are on their way" text={`We haven't listed any ${category.name} services yet. Check back soon.`}>{null}</Empty>}
    </div>
  </section>;
}

/** SECTION 2 — a dedicated subsection for every category, generated from data. */
export function CategoryServicesSections({ groups, savedIds }) {
  return <div className="hm-groups">{groups.map((group, i) => <CategoryServicesSection key={group.key} group={group} index={i} savedIds={savedIds} />)}</div>;
}
export function SectionsSkeleton() {
  return <div className="hm-groups" aria-busy="true" aria-label="Loading services">{[0, 1].map(n => <section className="hm-cat-section" key={n}><div className="sh-container"><div className="hm-cat-head"><span className="sh-skeleton hm-skel-badge" /><div className="hm-skel-lines"><span className="sh-skeleton" /><span className="sh-skeleton" /></div></div><div className="sh-service-grid">{[0, 1, 2].map(i => <div key={i} className="sh-skeleton" />)}</div></div></section>)}</div>;
}
