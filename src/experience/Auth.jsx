import { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { message } from './data';
import { Notice, Reveal } from './UI';

export default function Auth({ register = false }) {
  const { user, setUser } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form,setForm]=useState({name:'',email:'',phone:'',password:'',confirmPassword:'',address:'',city:'',state:'',pincode:''});
  const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const lock=useRef(false);
  const destination = typeof location.state?.from === 'string' && location.state.from.startsWith('/') && !location.state.from.startsWith('//') && !['/login','/register'].includes(location.state.from) ? location.state.from : '/account';
  if(user) return <Navigate to={destination} replace />;
  async function submit(e) {
    e.preventDefault(); if(lock.current)return;
    if(register && form.password!==form.confirmPassword)return setError('Passwords do not match.');
    if(register && !/^[6-9]\d{9}$/.test(form.phone))return setError('Enter a valid 10-digit mobile number.');
    lock.current=true;setBusy(true);setError('');
    try {
      if(register) { const {confirmPassword: _confirm, ...payload}=form; await API.post('/auth/register',payload); navigate('/login',{replace:true,state:{registered:true,from:destination}}); }
      else { const response=await API.post('/auth/customer/login',{email:form.email.trim(),password:form.password}); if(!response.data?.user)throw new Error('Missing account');setUser(response.data.user);navigate(destination,{replace:true}); }
    }catch(err){setError(message(err,register?'Could not create your account.':'Could not sign in. Check your details and try again.'));}finally{lock.current=false;setBusy(false);}
  }
  return <div className="sh-container sh-auth"><Reveal className="sh-auth-story"><p className="sh-eyebrow">Your account, your pace</p><h1>Book it once.<br /><em>Track it all.</em></h1><img src="/home-interior-sm.webp" alt="" width="640" height="427" decoding="async"/><p>One account for saved services, addresses, appointments and booking updates.</p></Reveal><Reveal className="sh-auth-form"><p className="sh-eyebrow">{register?'A fresh start':'Welcome back'}</p><h2>{register?'Make yourself at home.':'Good to see you again.'}</h2><p>{register?'Create your account to get started.':'Sign in to pick up where you left off.'}</p><Notice success>{location.state?.registered ? 'Account created. Please sign in.' : ''}</Notice><form onSubmit={submit}><fieldset disabled={busy}>{(register?['name','email','phone','password','confirmPassword']:['email','password']).map(field=><label key={field}>{({name:'Full name',email:'Email address',phone:'Mobile number',password:'Password',confirmPassword:'Confirm password'})[field]}<input name={field} type={field.toLowerCase().includes('password')?'password':field==='email'?'email':field==='phone'?'tel':'text'} autoComplete={field==='confirmPassword'?'new-password':field==='password'?(register?'new-password':'current-password'):field==='name'?'name':field==='phone'?'tel':'email'} required minLength={register && field.toLowerCase().includes('password')?6:undefined} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}/></label>)}<Notice>{error}</Notice><button className="sh-button" type="submit">{busy?'Please wait…':register?'Create account':'Sign in'}<FiArrowUpRight /></button></fieldset></form><p className="sh-auth-switch">{register?'Already at home here?':'New to ServiceHub?'} <Link to={register?'/login':'/register'} state={{from:destination}}>{register?'Sign in':'Create an account'}</Link></p></Reveal></div>;
}
