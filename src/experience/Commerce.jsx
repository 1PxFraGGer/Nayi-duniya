import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import API from '../services/api';
import { Empty, Loading, LoadError, Notice, PageHead, Photo, ServiceCard, useSavedServices } from './UI';
import { formatAddress, message, money, nameOf, priceOf, serviceIdOf, today, useResource } from './data';

export function Wishlist() {
  const saved=useSavedServices();
  return <div className="sh-container sh-page"><PageHead eyebrow="Your little collection" title="Worth coming back to." description="The services you’ve saved, all in one place."/>{saved.loading?<Loading/>:saved.error?<LoadError error={saved.error} retry={saved.refresh}/>:saved.data?.length?<div className="sh-card-grid">{saved.data.map(item=><ServiceCard key={serviceIdOf(item)} service={{...item,...item.service,id:serviceIdOf(item)}} saved onSaved={saved.refresh}/>)}</div>:<Empty title="Keep a few favourites." text="Tap the heart on a service to save it here."/>}</div>;
}
export function Cart() {
  const state=useResource('/cart','cart','cartUpdated');const [busy,setBusy]=useState(null);const [error,setError]=useState('');const lock=useRef(false);
  async function update(item,quantity) {
    if(lock.current)return;lock.current=true;setBusy(item.id);setError('');
    try {if(quantity===0)await API.delete(`/cart/${item.id}`);else await API.put(`/cart/${item.id}`,{quantity});window.dispatchEvent(new Event('cartUpdated'));}catch(err){setError(message(err));}finally{lock.current=false;setBusy(null);}
  }
  const total=(state.data||[]).reduce((sum,item)=>sum+priceOf(item)*Number(item.quantity||1),0);
  return <div className="sh-container sh-page"><PageHead eyebrow="A little plan for your home" title="Your next home upgrades." description="Review your services before choosing an appointment."/><Notice>{error}</Notice>{state.loading&&!state.data?<Loading/>:state.error?<LoadError error={state.error} retry={state.refresh}/>:state.data?.length?<div className="sh-two-columns"><div className="sh-stack">{state.data.map(item=><article className="sh-cart-row" key={item.id}><Photo src={item.image||item.service_image||item.service?.image} alt={nameOf(item)}/><div><Link to={`/services/${serviceIdOf(item)}`}><h2>{nameOf(item)}</h2></Link><p>{money(priceOf(item))} per service</p><div className="sh-quantity"><button disabled={busy!==null||state.loading||Number(item.quantity||1)<=1} onClick={()=>update(item,Number(item.quantity||1)-1)} aria-label={`Decrease quantity for ${nameOf(item)}`}><FiMinus/></button><span>{item.quantity||1}</span><button disabled={busy!==null||state.loading} onClick={()=>update(item,Number(item.quantity||1)+1)} aria-label={`Increase quantity for ${nameOf(item)}`}><FiPlus/></button></div></div><div><strong>{money(priceOf(item)*Number(item.quantity||1))}</strong><button className="sh-icon-button" disabled={busy!==null||state.loading} onClick={()=>update(item,0)} aria-label={`Remove ${nameOf(item)}`}><FiTrash2/></button></div></article>)}</div><aside className="sh-summary sh-panel"><p className="sh-eyebrow">The little details</p><h2>Your summary</h2><div className="sh-total"><span>Service total</span><strong>{money(total)}</strong></div><p>This is the displayed service total. Any final charges must be confirmed by the service team.</p><Link className="sh-button" to="/checkout">Choose appointment <FiArrowUpRight/></Link><Link className="sh-inline-link" to="/services">Keep exploring ↗</Link></aside></div>:<Empty title="A little room for something good." text="Your cart is empty. Find a service to get started."/>}</div>;
}
export function Checkout() {
  const cart=useResource('/cart','cart');const address=useResource('/customer/addresses','addresses');
  const [selected,setSelected]=useState('');const [date,setDate]=useState('');const [time,setTime]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const [submitted,setSubmitted]=useState(false);const lock=useRef(false);const navigate=useNavigate();
  const chosen=(address.data||[]).find(a=>String(a.id)===selected)||(address.data||[]).find(a=>Number(a.isDefault)===1)||address.data?.[0];
  const total=(cart.data||[]).reduce((sum,item)=>sum+priceOf(item)*Number(item.quantity||1),0);
  async function submit(e) {
    e.preventDefault();if(lock.current||submitted)return;
    if(!chosen)return setError('Add a service address first.');
    const fields=new FormData(e.currentTarget);const bookingDate=String(fields.get('bookingDate')||date);const bookingTime=String(fields.get('bookingTime')||time);const appointment=new Date(`${bookingDate}T${bookingTime}`);if(!bookingDate||!bookingTime||!Number.isFinite(appointment.getTime())||appointment<=new Date())return setError('Choose a future appointment time.');
    if(!cart.data?.length)return setError('Your cart is empty.');
    lock.current=true;setBusy(true);setError('');setSubmitted(true);
    const created=[];
    try {
      for(const item of cart.data) {
        const response=await API.post('/bookings/customer',{service_id:Number(serviceIdOf(item)),booking_date:bookingDate,booking_time:bookingTime,address:formatAddress(chosen),notes:`Quantity: ${Number(item.quantity||1)}`});
        if(!response.data?.booking)throw new Error('Booking response could not be confirmed.');
        created.push(response.data.booking);
        // Remove only an item whose booking was confirmed. Never clear unbooked items.
        await API.delete(`/cart/${item.id}`);
      }
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/booking-success',{replace:true,state:{bookingSuccess:true,bookings:created}});
    }catch(err){setError(`${message(err,'We could not confirm every booking.')} ${created.length ? `${created.length} booking(s) were created. ` : ''}Check My bookings before submitting again. This checkout is locked to avoid accidental duplicates.`);window.dispatchEvent(new Event('cartUpdated'));}
    finally{lock.current=false;setBusy(false);}
  }
  if(cart.loading||address.loading)return <div className="sh-container sh-page"><Loading/></div>;
  if(cart.error||address.error)return <div className="sh-container sh-page"><LoadError error={cart.error||address.error} retry={()=>{cart.refresh();address.refresh();}}/></div>;
  return <div className="sh-container sh-page"><PageHead eyebrow="Almost there" title="Make a little plan." description="Choose where and when you’d like your service."/>{!cart.data?.length?<Empty title="Your cart is empty." text="Add a service before checking out."/>:<form className="sh-two-columns" onSubmit={submit}><div className="sh-stack"><section className="sh-panel"><div className="sh-section-heading"><h2>01 / Your address</h2><Link to="/account/addresses">Manage ↗</Link></div>{address.data?.length?<div className="sh-address-options">{address.data.map(a=><label className={String(chosen?.id)===String(a.id)?'is-selected':''} key={a.id}><input type="radio" name="address" value={a.id} checked={String(chosen?.id)===String(a.id)} disabled={submitted} onChange={()=>setSelected(String(a.id))}/><span><strong>{a.addressType||'Service address'}</strong>{formatAddress(a)}</span></label>)}</div>:<p>Add your first address to continue. <Link to="/account/addresses">Add address ↗</Link></p>}</section><section className="sh-panel"><h2>02 / Your preferred appointment</h2><p className="sh-muted">Availability will be confirmed by the service team.</p><div className="sh-form-row"><label>Date<input type="date" name="bookingDate" min={today()} value={date} onChange={e=>setDate(e.target.value)} disabled={submitted} required/></label><label>Time<input type="time" name="bookingTime" value={time} onChange={e=>setTime(e.target.value)} disabled={submitted} required/></label></div></section></div><aside className="sh-panel sh-summary"><p className="sh-eyebrow">Your home, your schedule</p><h2>Booking summary</h2>{cart.data.map(item=><div className="sh-summary-line" key={item.id}><span>{nameOf(item)} × {item.quantity||1}</span><strong>{money(priceOf(item)*Number(item.quantity||1))}</strong></div>)}<div className="sh-total"><span>Service total</span><strong>{money(total)}</strong></div><p>This creates a service booking. No online payment is taken on this page.</p><Notice>{error}</Notice><button className="sh-button" type="submit" disabled={submitted||!chosen}>{busy?'Creating your bookings…':'Place booking'}<FiArrowUpRight/></button><Link className="sh-inline-link" to="/my-bookings">My bookings ↗</Link></aside></form>}</div>;
}

