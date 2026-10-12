import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { message } from './data';
import { getImageUrl } from '../utils/imageUrl';
import { Notice, PageHead } from './UI';

export default function Account() {
  const {user,logout}=useAuth();const navigate=useNavigate();const [error,setError]=useState('');
  async function out(){try{await logout();navigate('/');}catch{setError('Could not sign out. Please try again.');}}
  return <div className="sh-container sh-page"><PageHead eyebrow="Your own little corner" title={`Hello, ${user?.name?.split(' ')[0]||'there'}.`} description="Your details, your addresses, your everyday plans."/><div className="sh-account-layout"><nav className="sh-account-nav" aria-label="Account navigation"><NavLink to="/account/profile">Your profile ↗</NavLink><NavLink to="/account/addresses">Saved addresses ↗</NavLink><Link to="/my-bookings">My bookings ↗</Link><Link to="/notifications">Notifications ↗</Link><button onClick={out}>Sign out</button><Notice>{error}</Notice></nav><div className="sh-account-body"><Outlet/></div></div></div>;
}
export function Profile() {
  const {user,setUser}=useAuth();const [form,setForm]=useState({name:user?.name||'',phone:user?.phone||'',city:user?.city||'',image:user?.image||''});const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [success,setSuccess]=useState('');const lock=useRef(false);
  function upload(e){const file=e.target.files?.[0];if(!file)return;if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5*1024*1024){setError('Choose a JPG, PNG or WebP image smaller than 5 MB.');return;}const reader=new FileReader();reader.onload=()=>setForm(previous=>({...previous,image:String(reader.result)}));reader.onerror=()=>setError('Could not read this image.');reader.readAsDataURL(file);}
  async function save(e){e.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError('');setSuccess('');try{const result=await API.put('/auth/customer/profile',{name:form.name,phone:form.phone,city:form.city,...(form.image.startsWith('data:')?{image:form.image}:{})});setUser({...user,...form,...(result.data?.user||result.data?.customer||{})});setSuccess('Your profile has been updated.');}catch(err){setError(message(err));}finally{lock.current=false;setBusy(false);}}
  return <section className="sh-panel"><h2>Your profile</h2><p className="sh-muted">Keep your contact details up to date for your appointments.</p><form onSubmit={save}><fieldset disabled={busy}><div className="sh-profile-photo">{form.image&&<img src={form.image.startsWith('data:')?form.image:getImageUrl(form.image)} alt="Your profile"/>}<label>Profile photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload}/><small>JPG, PNG or WebP · up to 5 MB</small></label></div><div className="sh-form-row">{['name','phone','city'].map(field=><label key={field}>{field==='name'?'Full name':field==='phone'?'Mobile number':'City'}<input type={field==='phone'?'tel':'text'} required={field!=='city'} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}/></label>)}<label>Email<input type="email" value={user?.email||''} readOnly/></label></div><Notice>{error}</Notice><Notice success>{success}</Notice><button className="sh-button" type="submit">{busy?'Saving…':'Save changes ↗'}</button></fieldset></form></section>;
}
