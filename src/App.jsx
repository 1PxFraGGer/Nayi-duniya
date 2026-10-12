import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import { Header, Footer } from './experience/Shell';
import { Empty, Loading, RouteFocus } from './experience/UI';
import PageTransition from './experience/PageTransition';
import Home from './experience/Home';
import Catalog, { Categories } from './experience/Catalog';
import Auth from './experience/Auth';
import { Cart, Checkout, Wishlist } from './experience/Commerce';
import { Bookings, BookingDetail, BookingSuccess, Notifications } from './experience/Bookings';
import Account, { Profile } from './experience/Account';
import { Blogs, BlogDetail, Reviews, Contact, NotFound } from './experience/Content';
import './experience/theme.css';
const ServiceDetail=lazy(()=>import('./pages/ServiceDetail'));
const Addresses=lazy(()=>import('./pages/MyAddresses'));
const About=lazy(()=>import('./pages/About'));
const Careers=lazy(()=>import('./pages/Careers'));
const Investors=lazy(()=>import('./pages/InvestorRelations'));
const Terms=lazy(()=>import('./pages/Terms'));
const Privacy=lazy(()=>import('./pages/Privacy'));
const Chat=lazy(()=>import('./components/chatbot/ChatbotWindow/ChatbotWindow'));
function Protected({children}) {const {user,loading}=useAuth();const location=useLocation();if(loading)return <div className="sh-container sh-page"><Loading/></div>;return user?children:<Navigate to="/login" replace state={{from:location.pathname+location.search}}/>;}
function Legacy({name,children}){return <div className={`sh-legacy sh-legacy-${name}`}>{children}</div>;}
function Admin(){const {user}=useAuth();return <div className="sh-container sh-page"><Empty title={['admin','superadmin'].includes(user?.role)?'Your administration workspace.':'Administrator access required.'} text={['admin','superadmin'].includes(user?.role)?'This customer project does not include the server administration dashboard. Use your existing admin panel to manage services and bookings.':'Sign in with an administrator account to access administration tools.'}/></div>;}
export default function App(){
  const [chat,setChat]=useState(false);
  return <MotionConfig reducedMotion="user"><div className="sh-app"><a className="sh-skip" href="#main-content">Skip to content</a>{import.meta.env.DEV&&import.meta.env.VITE_DEMO_MODE==='true'&&<div className="sh-demo-banner">Design preview · Sample data · No real bookings or payments</div>}<div className="sh-shell"><Header/><PageTransition>{shown=><><RouteFocus path={shown.pathname}/><div id="main-content" role="main" tabIndex={-1}><Suspense fallback={<div className="sh-container sh-page"><Loading/></div>}><Routes location={shown}>
    <Route path="/" element={<Home/>}/><Route path="/services" element={<Catalog/>}/><Route path="/services/category/:id" element={<Catalog/>}/><Route path="/services/:id" element={<ServiceDetail/>}/><Route path="/categories" element={<Categories/>}/><Route path="/all-categories" element={<Navigate to="/services" replace/>}/>
    <Route path="/popular-services" element={<Catalog mode="popular"/>}/><Route path="/popular-services-listing" element={<Navigate to="/popular-services" replace/>}/><Route path="/popular-services/:id" element={<ServiceDetail/>}/><Route path="/daily-deals" element={<Catalog mode="deals"/>}/><Route path="/daily-deals-listing" element={<Navigate to="/daily-deals" replace/>}/><Route path="/daily-deals/:id" element={<ServiceDetail/>}/>
    <Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth key="register" register/>}/><Route path="/cart" element={<Protected><Cart/></Protected>}/><Route path="/checkout" element={<Protected><Checkout/></Protected>}/><Route path="/wishlist" element={<Protected><Wishlist/></Protected>}/><Route path="/booking-success" element={<Protected><BookingSuccess/></Protected>}/><Route path="/my-bookings" element={<Protected><Bookings/></Protected>}/><Route path="/bookings" element={<Navigate to="/my-bookings" replace/>}/><Route path="/bookings/:id" element={<Protected><BookingDetail/></Protected>}/><Route path="/bookings/:id/track" element={<Protected><BookingDetail tracking/></Protected>}/><Route path="/notifications" element={<Protected><Notifications/></Protected>}/>
    <Route path="/account" element={<Protected><Account/></Protected>}><Route index element={<Navigate to="profile" replace/>}/><Route path="profile" element={<Profile/>}/><Route path="addresses" element={<Legacy name="addresses"><Addresses/></Legacy>}/></Route>
    <Route path="/about" element={<Legacy name="about"><About/></Legacy>}/><Route path="/careers" element={<Legacy name="careers"><Careers/></Legacy>}/><Route path="/investors" element={<Legacy name="investor"><Investors/></Legacy>}/><Route path="/terms" element={<Legacy name="terms"><Terms/></Legacy>}/><Route path="/privacy" element={<Legacy name="privacy"><Privacy/></Legacy>}/><Route path="/blogs" element={<Blogs/>}/><Route path="/blogs/:slug" element={<BlogDetail/>}/><Route path="/reviews" element={<Reviews/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admin" element={<Protected><Admin/></Protected>}/><Route path="*" element={<NotFound/>}/>
  </Routes></Suspense></div></>}</PageTransition><Footer/><button className="sh-support-toggle" aria-label={chat?'Close support chat':'Open support chat'} aria-expanded={chat} onClick={()=>setChat(!chat)}><FiMessageCircle/></button>{chat&&<Suspense fallback={null}><Chat isOpen={chat} onClose={()=>setChat(false)}/></Suspense>}</div></div></MotionConfig>;
}

import './experience/voltcare.css';
