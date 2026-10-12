import { useCallback, useEffect, useState } from 'react';
import API from '../services/api';

export function rows(data, key) {
  if (Array.isArray(data)) return data;
  return [data?.[key], data?.data, data?.items].find(Array.isArray) || [];
}
export const money = value => value != null && value !== '' && Number.isFinite(Number(value))
  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value)) : 'Price on request';
export const message = (error, fallback = 'Something went wrong. Please try again.') => {
  const serverMessage = error?.response?.data?.message || error?.response?.data?.msg;
  if (serverMessage) return serverMessage;
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (!error?.response && error?.isAxiosError) return 'Cannot connect to the service server. Check your connection and try again. If this continues, the API URL or server access settings need to be checked.';
  if (error?.response?.status >= 500) return 'The service server is temporarily unavailable. Please try again later.';
  return fallback;
};
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const priceOf = item => Number(item.price ?? item.service_price ?? item.service?.price ?? 0);
export const nameOf = item => item.title || item.service_title || item.service_name || item.service?.title || 'Service';
export const serviceIdOf = item => item.service_id ?? item.service?.id ?? item.id;
export const formatAddress = a => [a.fullName, a.houseNo, a.addressLine1, a.addressLine2, a.landmark, a.city, a.state, a.pincode].filter(Boolean).join(', ');
export function useResource(path, key, eventName) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: '' });
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    if (!eventName) return;
    window.addEventListener(eventName, refresh);
    return () => window.removeEventListener(eventName, refresh);
  }, [eventName, refresh]);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      if (!path) { setState({ data: null, loading: false, error: '' }); return; }
      setState(s => ({ ...s, loading: true, error: '' }));
      try {
        const response = await API.get(path, { signal: controller.signal });
        if (!controller.signal.aborted) setState({ data: key ? rows(response.data, key) : response.data, loading: false, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setState({ data: null, loading: false, error: message(error, 'Unable to load this information. Please try again.') });
      }
    }
    load();
    return () => controller.abort();
  }, [path, key, version]);
  return { ...state, refresh };
}

// Same city rule the catalog has always used: services without a city are shown everywhere.
export const cityMatches = (service, city) => !city || city === 'All cities' || !service.city || String(service.city).toLowerCase() === city.toLowerCase();
export const categoryTitle = name => /services?$/i.test(String(name).trim()) ? String(name).trim() : `${String(name).trim()} Services`;
export const HOME_LIMIT = 6;
// Groups services under backend categories (backend order kept). Services whose category is unknown
// are grouped by their own category_name so nothing is silently dropped.
export function groupByCategory(categories = [], services = []) {
  const featured = [...services].sort((a, b) => Number(b.is_popular || 0) - Number(a.is_popular || 0));
  const known = new Set(categories.map(c => String(c.id)));
  const groups = categories.map(category => ({ key: String(category.id), category, services: featured.filter(s => String(s.category_id) === String(category.id)) }));
  const orphans = new Map();
  featured.filter(s => !known.has(String(s.category_id))).forEach(s => {
    const name = s.category_name || 'More services';
    if (!orphans.has(name)) orphans.set(name, { key: `other-${name}`, category: { id: null, name }, services: [] });
    orphans.get(name).services.push(s);
  });
  return [...groups, ...orphans.values()];
}

