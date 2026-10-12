// In-memory design fixture, enabled only by VITE_DEMO_MODE=true in development.
// Never forwards requests to the real API. No real orders, payments or messages.
const image = `${location.origin}/atelier-interior.png`;
const categories = ['Cleaning','Camera Services','Plumbing','Painting','Electrical','Event Photography','Appliance Repair','Home care'].map((name,i)=>({id:i+1,name,image:i%3===0?image:null}));
const titles = ['Full home deep cleaning','Sofa and carpet shampoo','Kitchen degreasing','Bathroom deep clean','Move-in cleaning','Window cleaning','Balcony wash','Normal dome camera installation','Bullet camera installation','Camera maintenance visit','Wall-mounted toilet installation','Tap and mixer repair','Interior wall painting','Exterior painting','Ceiling touch-up','Wiring inspection','Fan installation','Switchboard repair','Pre-wedding shoot','Birthday photography','Washing machine repair'];
const cats = [1,1,1,1,1,1,1,2,2,2,3,3,4,4,4,5,5,5,6,6,7];
const services = titles.map((title,i)=>({id:i+1,title,category_id:cats[i],category_name:categories[cats[i]-1].name,price:[2499,799,3499,999,1500,1500][i%6],rating:i%4===1?null:4.7,is_popular:i%3===0?1:0,is_daily_deal:i===3?1:0,image,images:[image,image],description:`<section style="padding:24px;background:#edf1e4;border-radius:16px;color:#304332"><p style="letter-spacing:3px;font-size:10px">SERVICE DETAILS</p><h2 style="font-size:25px">About ${title}</h2><p>This is sample content for checking the admin HTML layout.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px"><div style="padding:20px;background:white;border-radius:12px">01<br><strong>Preparation</strong><p>Discuss your requirements.</p></div><div style="padding:20px;background:white;border-radius:12px">02<br><strong>Service</strong><p>Complete the agreed work.</p></div></div></section>`}));
const user={id:42,name:'Demo Customer',email:'demo@example.com',phone:'9876543210',city:'Jaipur'};
let signed=sessionStorage.getItem('sh-demo-auth')==='true';
let cart=[];let saved=[];let bookings=[];
const addresses=[{id:1,fullName:'Demo Customer',mobile:user.phone,houseNo:'24',addressLine1:'Sample Road',addressType:'Home',city:'Jaipur',state:'Rajasthan',pincode:'302001',country:'India',isDefault:1}];
export async function demoAdapter(config) {
  const url=config.url;const method=(config.method||'get').toLowerCase();const body=typeof config.data==='string'?JSON.parse(config.data||'{}'):config.data||{};
  let data={};
  if(url==='/auth/customer/me')data={success:true,user:signed?user:null};
  else if(url==='/auth/customer/login'){signed=true;sessionStorage.setItem('sh-demo-auth','true');data={user};}
  else if(url==='/auth/customer/logout'){signed=false;sessionStorage.removeItem('sh-demo-auth');}
  else if(url==='/auth/register')data={success:true};
  else if(url==='/auth/customer/profile'){Object.assign(user,body);data={user};}
  else if(url==='/services')data=services;
  else if(url.startsWith('/services/'))data=services.find(s=>String(s.id)===url.split('/').pop());
  else if(url==='/categories')data=categories;
  else if(url==='/customer/addresses')data=addresses;
  else if(url==='/cart'&&method==='get')data=cart;
  else if(url==='/cart'&&method==='post'){const s=services.find(s=>Number(s.id)===Number(body.service_id));const item=cart.find(i=>i.service_id===s.id);if(item)item.quantity+=1;else cart.push({...s,id:Date.now(),service_id:s.id,quantity:1});data={success:true};}
  else if(url.startsWith('/cart/')){const id=Number(url.split('/').pop());if(method==='delete')cart=cart.filter(i=>i.id!==id);else cart=cart.map(i=>i.id===id?{...i,quantity:body.quantity}:i);}
  else if(url==='/wishlist'&&method==='get')data=saved;
  else if(url==='/wishlist'&&method==='post'){saved.push(services.find(s=>Number(s.id)===Number(body.service_id)));}
  else if(url.startsWith('/wishlist/'))saved=saved.filter(s=>String(s.id)!==url.split('/').pop());
  else if((url==='/bookings/customer'||url==='/bookings')&&method==='post'){const s=services.find(s=>Number(s.id)===Number(body.service_id));const booking={...body,id:Date.now(),service_name:s.title,amount:s.price,status:'pending',service_image:image};bookings.push(booking);data={booking};}
  else if(url==='/bookings')data=bookings;
  else if(url.startsWith('/bookings/')){const id=url.split('/').pop();const b=bookings.find(b=>String(b.id)===id);if(method==='delete'&&b)b.status='cancelled';data={booking:b};}
  else if(url==='/faqs')data=[{id:1,question:'How do I choose an appointment?',answer:'Select a service, choose your preferred date and time, and save your address.'},{id:2,question:'Where can I see my booking status?',answer:'Open My bookings in your account to see the latest update.'}];
  else if(url.startsWith('/comments/service/'))data=[];
  else if(url==='/comments/approved')data=[];
  else if(url==='/notifications')data=[];
  else if(url==='/blogs')data=[{id:1,title:'A little care goes a long way',slug:'care-at-home',image,excerpt:'Small changes for a home that feels better.'}];
  else if(url.startsWith('/blogs/'))data={title:'A little care goes a long way',image,content:'<h2 style="color:#304f3f">Start with the little things.</h2><p>Sample journal content for the design preview.</p>'};
  else if(url==='/contact'||url==='/comments')data={success:true};
  else data=[];
  return {data:structuredClone(data),status:200,statusText:'OK',headers:{},config};
}
