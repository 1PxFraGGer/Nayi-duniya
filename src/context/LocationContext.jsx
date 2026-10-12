/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
const LocationContext=createContext();
export function LocationProvider({children}) {
  const [city,setValue]=useState(()=>{try{return localStorage.getItem('servicehub-city')||'All cities';}catch{return 'All cities';}});
  function setCity(value){setValue(value);try{localStorage.setItem('servicehub-city',value);}catch{/* Storage is optional. */}}
  return <LocationContext.Provider value={{city,setCity}}>{children}</LocationContext.Provider>;
}
export function useLocation(){return useContext(LocationContext);}
