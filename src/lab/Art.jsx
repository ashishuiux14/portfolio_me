import { useEffect, useRef, useState } from 'react';
import { clayToggle, aluToggle, submitHTML, submitButton, stepperHTML, stepper, rotaryHTML, rotary, calendar, Snd } from './engines';
import './lab.css';

/* React shells around the study engines. Each mounts its markup once and lets
   the engine own the element; props are passed through refs so the engine
   always calls the latest handler. `zoom` scales a control without changing its physics. */

function useEngine(build, deps = []) {
  const host = useRef(null);
  const api = useRef(null);
  useEffect(() => {
    const el = host.current;
    api.current = build(el);
    return () => { if (api.current) api.current.destroy(); api.current = null; el.innerHTML = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [host, api];
}

const esc = (s) => String(s).replace(/"/g, '&quot;');

export function ClayToggle({ checked = false, onChange, label = 'Toggle', zoom = 1 }) {
  const cb = useRef(onChange); cb.current = onChange;
  const [host, api] = useEngine((el) => {
    el.innerHTML = `<button type="button" class="ct" role="switch" aria-checked="${checked}" aria-label="${esc(label)}"><span class="ct-floor"></span><span class="ct-knob"></span></button>`;
    return clayToggle(el.firstElementChild, { onChange: (v) => cb.current && cb.current(v) });
  });
  useEffect(() => { if (api.current) api.current.set(checked); }, [checked, api]);
  return <span ref={host} className="ctl-zoom" style={{ zoom }} />;
}

export function AluToggle({ checked = false, onChange, label = 'Toggle', zoom = 1 }) {
  const cb = useRef(onChange); cb.current = onChange;
  const [host, api] = useEngine((el) => {
    el.innerHTML = `<button type="button" class="hk" role="switch" aria-checked="${checked}" aria-label="${esc(label)}"><span class="hk-well tex-dark"><span class="hk-lit tex-green"></span></span><span class="hk-sh"></span><span class="hk-knob"></span></button>`;
    return aluToggle(el.firstElementChild, { onChange: (v) => cb.current && cb.current(v) });
  });
  useEffect(() => { if (api.current) api.current.set(checked); }, [checked, api]);
  return <span ref={host} className="ctl-zoom" style={{ zoom }} />;
}

export function SubmitButton({ material = 'clay', outcome = 'ok', server = 900, set = 'save', zoom = 1 }) {
  const msg = useRef(null);
  const [host, api] = useEngine((el) => {
    el.innerHTML = submitHTML(material, set);
    return submitButton(el.firstElementChild, material, { outcome, server, msg: msg.current });
  }, [material, set]);
  useEffect(() => { if (api.current) { api.current.o.outcome = outcome; api.current.o.server = server; } }, [outcome, server, api]);
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <span ref={host} className="ctl-zoom" style={{ zoom }} />
      <span ref={msg} role="status" style={{ minHeight: 22, maxWidth: 300, textAlign: 'center', fontSize: 14, color: 'var(--accent-ink)' }} />
    </span>
  );
}

export function Stepper({ material = 'clay', value = 3, min = 0, max = 20, label = 'Quantity', zoom = 1, onChange }) {
  const cb = useRef(onChange); cb.current = onChange;
  const [host] = useEngine((el) => {
    el.innerHTML = stepperHTML(material, { value, min, max, label: esc(label) });
    return stepper(el.firstElementChild, material, { value, min, max, label, onChange: (v) => cb.current && cb.current(v) });
  }, [material, min, max]);
  return <span ref={host} className="ctl-zoom" style={{ zoom }} />;
}

export function Rotary({ material = 'plastic', on = false, label = 'Rotary switch', zoom = 1, onChange }) {
  const cb = useRef(onChange); cb.current = onChange;
  const [host] = useEngine((el) => {
    el.innerHTML = rotaryHTML(material, esc(label), on);
    return rotary(el.firstElementChild, material, { onChange: (v) => cb.current && cb.current(v) });
  }, [material]);
  return <span ref={host} className="ctl-zoom" style={{ zoom }} />;
}

export function Calendar({ material = 'clay', zoom = 1 }) {
  const [host] = useEngine((el) => calendar(el, material, {}), [material]);
  return <div ref={host} style={{ zoom, maxWidth: '100%' }} />;
}

/* Sound on/off for the aluminium parts (synthesised, no audio files). */
export function SoundSwitch() {
  const [on, setOn] = useState(Snd.on);
  useEffect(() => { const l = (v) => setOn(v); Snd.listeners.add(l); return () => Snd.listeners.delete(l); }, []);
  return (
    <button type="button" className="sound-btn" aria-pressed={on} onClick={() => { Snd.set(!on); if (!on) Snd.play('snap'); }}>
      <span className="ic" aria-hidden="true">
        {on
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M17 10l4 4M21 10l-4 4" /></svg>}
      </span>
      {on ? 'Sound on' : 'Sound off'}
    </button>
  );
}
