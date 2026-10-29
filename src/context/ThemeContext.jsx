import { createContext, useContext, useEffect, useState } from 'react';
export const themes = [{id:'blue',name:'Royal Blue',color:'#155EEF'},{id:'teal',name:'Emerald Teal',color:'#087F8C'},{id:'purple',name:'Royal Purple',color:'#6941C6'}];
const valid = value => themes.some(t=>t.id===value) ? value : 'blue';
const ThemeContext = createContext(null);
export function ThemeProvider({children}) {
 const [theme,setTheme]=useState(()=>valid(document.documentElement.dataset.theme));
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('servicehub-theme',theme);}catch{/* Storage may be unavailable. */}},[theme]);
 useEffect(()=>{const sync=e=>{if(e.key==='servicehub-theme')setTheme(valid(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>;
}
export function ThemeSwitcher({expanded=false}) {
 const {theme,setTheme}=useContext(ThemeContext);
 return <div className={`sh-themes${expanded?' is-expanded':''}`} role="group" aria-label="Website appearance">{expanded&&<h3>Website Appearance</h3>}{themes.map(t=><button key={t.id} type="button" title={t.name} aria-label={t.name} aria-pressed={theme===t.id} onClick={()=>setTheme(t.id)}><span style={{background:t.color}}>{theme===t.id?'✓':''}</span>{expanded&&t.name}</button>)}</div>;
}
