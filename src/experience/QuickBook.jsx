import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiCalendar, FiMapPin } from 'react-icons/fi';
import CategoryIcon from './CategoryIcon';
import { money } from './data';
export default function QuickBook({ services, categories }) {
 const [selected,setSelected]=useState('');const [when,setWhen]=useState('Today');const navigate=useNavigate();
 const electrical=services.filter(s=>/electri|wiring|fan|switch|light/i.test(`${s.title} ${s.category_name}`));
 const choices=(electrical.length?electrical:services).slice(0,4);
 const service=choices.find(s=>String(s.id)===selected)||choices[0];
 const category=categories.find(c=>/electri/i.test(c.name));
 return <div className="vc-book"><div className="vc-book-head"><span className="vc-icon"><FiCalendar/></span><div><h2>Let’s get it sorted.</h2><p>Find the right service for your home.</p></div></div><p className="vc-label">01 / Choose your service</p><div className="vc-options">{choices.length?choices.map(s=><button key={s.id} type="button" className={service?.id===s.id?'is-selected':''} aria-pressed={service?.id===s.id} onClick={()=>setSelected(String(s.id))}><CategoryIcon name={s.category_name||'Electrical'}/><span>{s.title}</span></button>):<button type="button" onClick={()=>navigate('/services')}>Browse available services <FiArrowRight/></button>}</div><p className="vc-label">02 / Preferred appointment</p><div className="vc-slots">{['Today','Tomorrow','Choose a date'].map(t=><button key={t} type="button" aria-pressed={when===t} className={when===t?'is-selected':''} onClick={()=>setWhen(t)}>{t}</button>)}</div><div className="vc-estimate"><div><small>{service?'Listed service price':'Service pricing'}</small><strong>{service?money(service.price):'View catalog'}</strong></div><span>Final scope and availability<br/>confirmed by the team</span></div><button className="sh-button vc-book-submit" onClick={()=>navigate(service?`/services/${service.id}?preferred=${encodeURIComponent(when)}`:category?`/services/category/${category.id}`:'/services')}>View service & book <FiArrowRight/></button><p className="vc-book-note"><FiCheckCircle/> Choose your exact date on the service page</p></div>;
}
