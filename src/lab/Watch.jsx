import { useEffect, useRef, useState } from 'react';
import { Seg, Dots } from './Seg';
import { Snd } from './engines';

/* A full-width digital-watch LCD module.
   LIGHT  backlight for 3 s        MODE   local → Chicago → Pune → stopwatch
   START  start / stop stopwatch   RESET  12/24 h, or clears the stopwatch */

const MODES = [
  { id: 'local', label: 'LOCAL', tz: undefined },
  { id: 'chi', label: 'CHICAGO', tz: 'America/Chicago' },
  { id: 'pune', label: 'PUNE', tz: 'Asia/Kolkata' },
  { id: 'chr', label: 'STOPWATCH' },
];
const DAYS = { Sun: 'SU', Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA' };

function partsIn(tz, d) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hourCycle: 'h23', weekday: 'short', month: 'numeric', day: 'numeric' });
  const o = {};
  f.formatToParts(d).forEach((p) => { o[p.type] = p.value; });
  return { h: +o.hour % 24, m: +o.minute, s: +o.second, wd: DAYS[o.weekday] || '--', mo: +o.month, day: +o.day };
}
const p2 = (n) => String(n).padStart(2, '0');

function beep(f = 4100, len = 0.05) {
  if (!Snd.on) return;
  const c = Snd.ensure(); if (!c) return;
  Snd.tone(c.currentTime + 0.002, f, 0.035, len, 'square');
}

export default function Watch() {
  const [mode, setMode] = useState(0);
  const [h24, setH24] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [light, setLight] = useState(false);
  const [run, setRun] = useState(false);
  const [acc, setAcc] = useState(0);          // stopwatch ms banked
  const [t0, setT0] = useState(0);            // start time while running
  const [, force] = useState(0);
  const [pressed, setPressed] = useState('');
  const [said, setSaid] = useState('');
  const lightT = useRef(0);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!run) return undefined;
    let raf; const tick = () => { force((n) => n + 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  useEffect(() => () => clearTimeout(lightT.current), []);

  const M = MODES[mode];
  const chrono = M.id === 'chr';
  const ms = acc + (run ? performance.now() - t0 : 0);
  const p = partsIn(M.tz, now);

  let main; let sec; let ampm = ''; let day; let date; let colonOn;
  if (chrono) {
    const totalS = Math.floor(ms / 1000);
    main = `${p2(Math.floor(totalS / 60) % 100)}:${p2(totalS % 60)}`;
    sec = p2(Math.floor((ms % 1000) / 10));
    day = 'ST'; date = '     ';
    colonOn = true;
  } else {
    let hh = p.h;
    if (!h24) { ampm = hh >= 12 ? 'PM' : 'AM'; hh = hh % 12 || 12; }
    main = `${h24 ? p2(hh) : String(hh).padStart(2, ' ')}:${p2(p.m)}`;
    sec = p2(p.s);
    day = p.wd; date = `${String(p.mo).padStart(2, ' ')}-${p2(p.day)}`;
    colonOn = reduce || now.getMilliseconds() < 500;
  }

  const press = (k, fn) => { setPressed(k); beep(k === 'light' ? 3500 : 4100); fn(); setTimeout(() => setPressed(''), 140); };
  const onLight = () => press('light', () => {
    setLight(true); clearTimeout(lightT.current);
    lightT.current = setTimeout(() => setLight(false), 3000);
  });
  const onMode = () => press('mode', () => {
    const n = (mode + 1) % MODES.length; setMode(n);
    const q = partsIn(MODES[n].tz, new Date());
    setSaid(MODES[n].id === 'chr' ? 'Stopwatch mode' : `${MODES[n].label.toLowerCase()} time, ${q.h % 12 || 12}:${p2(q.m)} ${q.h >= 12 ? 'PM' : 'AM'}`);
  });
  const onStart = () => press('start', () => {
    if (!chrono) { setMode(3); setSaid('Stopwatch mode'); return; }
    if (run) { setAcc(acc + performance.now() - t0); setRun(false); setSaid('Stopwatch stopped'); } else { setT0(performance.now()); setRun(true); setSaid('Stopwatch running'); }
  });
  const onReset = () => press('reset', () => {
    if (chrono) { if (!run) { setAcc(0); setSaid('Stopwatch cleared'); } } else { setH24(!h24); setSaid(h24 ? '12 hour time' : '24 hour time'); }
  });

  // LCD inks: the crystal is the same when lit; the reflector behind it changes
  const ink = '#171A15';
  const ghost = light ? 'rgba(18,40,36,.10)' : 'rgba(23,26,21,.075)';
  const sh = { dx: 3.2, dy: 4.2, color: light ? 'rgba(10,50,44,.16)' : 'rgba(23,26,21,.24)', filter: 'lcdsh' };
  const mainX = 52;
  const secX = 792;

  return (
    <div className={`watch${light ? ' lit' : ''}`} role="group" aria-label="Digital watch, interactive">
      <div className="watch-bezel">
        <span className="watch-print top">SOFT UI · LCD MODULE 01</span>
        <span className="watch-print bot">ILLUMINATOR · DUAL TIME · 1/100 SEC</span>
        <div className="watch-face">
          <span className="face-label tl">LIGHT</span>
          <span className="face-label tr">START · STOP</span>
          <span className="face-label bl">MODE</span>
          <span className="face-label br">RESET · 12/24</span>
          <div className="watch-lcd">
            <svg viewBox="0 0 1000 420" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="lcdsh" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6" /></filter>
              </defs>
              <Dots text={day} x={56} y={40} dot={7.4} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 2.4, dy: 3 }} />
              <Dots text={M.label.padEnd(9, ' ')} x={170} y={52} dot={5} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 2, dy: 2.6 }} />
              <Seg text={date} x={718} y={36} h={64} ink={ink} ghost={ghost} shadow={sh} />
              <line x1="40" y1="124" x2="960" y2="124" stroke={ink} strokeOpacity=".16" strokeWidth="2" strokeDasharray="2 7" />
              <Seg text={main} x={mainX} y={150} h={232} ink={ink} ghost={ghost} shadow={sh} colonOn={colonOn} />
              <Dots text={ampm || '  '} x={800} y={196} dot={5.4} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 2, dy: 2.6 }} />
              <Dots text={h24 && !chrono ? '24H' : '   '} x={880} y={196} dot={5.4} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 2, dy: 2.6 }} />
              <Seg text={sec} x={secX} y={262} h={120} ink={ink} ghost={ghost} shadow={sh} />
            </svg>
            <span className="watch-glare" aria-hidden="true" />
          </div>
        </div>
        <button type="button" className={`pusher l t${pressed === 'light' ? ' down' : ''}`} onClick={onLight} aria-label="Light: backlight the display" />
        <button type="button" className={`pusher l b${pressed === 'mode' ? ' down' : ''}`} onClick={onMode} aria-label="Mode: local, Chicago, Pune, stopwatch" />
        <button type="button" className={`pusher r t${pressed === 'start' ? ' down' : ''}`} onClick={onStart} aria-label={chrono ? (run ? 'Stop the stopwatch' : 'Start the stopwatch') : 'Start: switch to the stopwatch'} />
        <button type="button" className={`pusher r b${pressed === 'reset' ? ' down' : ''}`} onClick={onReset} aria-label={chrono ? 'Reset the stopwatch' : 'Switch between 12 and 24 hour time'} />
      </div>
      <span className="sr-only" aria-live="polite">{said}</span>
    </div>
  );
}
