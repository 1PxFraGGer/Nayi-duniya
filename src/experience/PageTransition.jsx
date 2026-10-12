import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrandMark } from './UI';
import './transition.css';

// Total visible time of a navigation transition (ms). Phases: cover (0-290) -> hold -> reveal (700-1000).
export const TRANSITION_MS = 1000;
const SWAP_AT = 290;      // panels fully cover the screen; the new route is mounted here
const REVEAL_AT = 700;   // panels start leaving
const REVEAL_MS = TRANSITION_MS - REVEAL_AT;
const MAX_WAIT = 5000;    // never trap the user behind the overlay

/**
 * Global route transition. The previous page stays mounted until the cover is complete, then the new
 * route is swapped in underneath it, so unfinished content is never visible. Works for links, programmatic
 * navigation and browser back/forward. Search-string-only changes (filters) are applied instantly.
 * `children` receives the location that should currently be rendered.
 */
export default function PageTransition({ children, onSettled }) {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [target, setTarget] = useState(location);
  const [prev, setPrev] = useState(location);
  const [phase, setPhase] = useState('idle');
  const [run, setRun] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const targetRef = useRef(location);
  const timers = useRef([]);

  // Derived-state update: runs in the same render pass as the location change, so there is no flash.
  if (location !== prev) {
    setPrev(location);
    setTarget(location);
    if (location.pathname !== target.pathname) { setPhase('in'); setRun(n => n + 1); setWaiting(false); }
    else if (phase === 'idle') setShown(location);
  }

  useEffect(() => { targetRef.current = target; }, [target]);
  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  useEffect(() => clear, [clear]);

  useEffect(() => {
    if (!run) return undefined;
    clear();
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const started = performance.now();
    later(() => { setShown(targetRef.current); setPhase('hold'); onSettled?.(targetRef.current); }, SWAP_AT);
    const reveal = () => {
      const busy = document.querySelector('#main-content [aria-busy="true"]');
      if (busy && performance.now() - started < MAX_WAIT) { setWaiting(true); later(reveal, 120); return; }
      setWaiting(false); setPhase('out');
      const elapsed = performance.now() - started;
      later(() => setPhase('idle'), elapsed < REVEAL_AT + 80 ? Math.max(TRANSITION_MS - elapsed - 24, 270) : REVEAL_MS);
    };
    later(reveal, REVEAL_AT);
    return clear;
  }, [run, clear, onSettled]);

  const active = phase !== 'idle';
  useEffect(() => {
    const shell = document.querySelector('.sh-shell');
    if (!shell) return undefined;
    shell.toggleAttribute('inert', active);
    return () => shell.removeAttribute('inert');
  }, [active]);

  return <>
    {children(shown)}
    {active && <div key={run} className={`pt-root pt-${phase}${waiting ? ' is-waiting' : ''}`} aria-hidden="false" role="status">
      <span className="sh-sr-only">Loading page</span>
      <div className="pt-panel pt-accent" aria-hidden="true" />
      <div className="pt-panel pt-brand" aria-hidden="true">
        <div className="pt-center">
          <BrandMark className="pt-mark" animated />
          <p className="pt-word">service<span>hub</span></p>
          <div className="pt-bar"><i /></div>
        </div>
      </div>
    </div>}
  </>;
}
