/* eslint-disable react-refresh/only-export-components */
import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import API from '../services/api';
const AuthContext=createContext();
export function AuthProvider({children}) {
  const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);
  const checkAuth=useCallback(async()=>{setLoading(true);try{const r=await API.get('/auth/customer/me');setUser(r.data?.user||null);}catch{setUser(null);}finally{setLoading(false);}},[]);
  useEffect(()=>{const controller=new AbortController();API.get('/auth/customer/me',{signal:controller.signal}).then(r=>{if(!controller.signal.aborted)setUser(r.data?.user||null);}).catch(()=>{if(!controller.signal.aborted)setUser(null);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[]);
  const logout=async()=>{await API.post('/auth/customer/logout');setUser(null);};
  return <AuthContext.Provider value={{user,setUser,loading,checkAuth,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){return useContext(AuthContext);}
