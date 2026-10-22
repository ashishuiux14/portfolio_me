import { useEffect, useState } from 'react';
import { ClayToggle, SubmitButton } from '../lab/Art';
import CyberCard from '../lab/CyberCard';
import { Seg, Dots } from '../lab/Seg';

/* Small, non-interactive previews for lab tiles that sit inside links. */
const still = { pointerEvents: 'none' };

export function ControlsPreview() {
  return (
    <div className="lab-prev" aria-hidden="true" inert="" style={{ ...still, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, flexWrap: 'wrap' }}>
      <ClayToggle checked zoom={0.68} label="Clay toggle preview" onChange={() => {}} />
      <SubmitButton material="alu" zoom={0.66} />
    </div>
  );
}

/* A tiny digital watch: live time on a segment display. */
const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const p2 = (n) => String(n).padStart(2, '0');
export function MiniWatch() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const h = now.getHours() % 12 || 12;
  const ink = '#171A15', ghost = 'rgba(23,26,21,.08)';
  const sh = { dx: 2.4, dy: 3, color: 'rgba(23,26,21,.24)' };
  return (
    <div className="mini-watch" aria-hidden="true">
      <div className="mw-face">
        <div className="mw-lcd">
          <svg viewBox="0 0 300 150">
            <Dots text={DAYS[now.getDay()]} x={22} y={16} dot={5} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 1.5, dy: 2 }} />
            <Dots text={now.getHours() >= 12 ? 'PM' : 'AM'} x={232} y={16} dot={5} ink={ink} ghost={ghost} shadow={{ ...sh, dx: 1.5, dy: 2 }} />
            <Seg text={`${String(h).padStart(2, ' ')}:${p2(now.getMinutes())}`} x={22} y={60} h={66} ink={ink} ghost={ghost} shadow={sh} colonOn={now.getSeconds() % 2 === 0} />
            <Seg text={p2(now.getSeconds())} x={234} y={90} h={36} ink={ink} ghost={ghost} shadow={sh} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SoftUiPreview() {
  return (
    <div className="sui-prev" aria-hidden="true" inert="">
      <div className="sui-prev-card"><CyberCard compact /></div>
      <MiniWatch />
    </div>
  );
}

/* Side elevation, drawn in the text colour: someone goes to sit down,
   finds a lap already taken, and leaves in a hurry. Loops. */
export function SeatGag() {
  return (
    <svg className="gag" viewBox="0 0 300 150" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 128H290" strokeOpacity=".25" strokeWidth="2" />
        {/* chair */}
        <path d="M80 56V128M80 96H120M116 96V128" />
        {/* the person already sitting */}
        <g>
          <circle cx="96" cy="52" r="9" />
          <circle cx="100" cy="50" r="1.2" fill="currentColor" className="g-calm" />
          <path d="M95 61L92 92H124V124H131" />
          <path d="M94 70L116 86" />
          <text x="86" y="30" className="g-q" fill="currentColor" stroke="none">?</text>
        </g>
        {/* the one who wants to sit */}
        <g className="g-move">
          <g className="g-walkA"><circle cx="134" cy="40" r="9" /><circle cx="130" cy="38" r="1.2" fill="currentColor" /><path d="M134 49V86L124 128M134 86L144 128M134 58L124 76M134 58L146 74" /></g>
          <g className="g-walkB"><circle cx="134" cy="40" r="9" /><circle cx="130" cy="38" r="1.2" fill="currentColor" /><path d="M134 49V86L131 128M134 86L137 128M134 58L131 80M134 58L138 80" /></g>
          <g className="g-stand"><circle cx="134" cy="40" r="9" /><circle cx="138" cy="38" r="1.2" fill="currentColor" /><path d="M134 49V86L130 128M134 86L139 128M134 58L144 76" /></g>
          <g className="g-sit"><g className="g-lower"><circle cx="112" cy="42" r="9" /><circle cx="116" cy="40" r="1.2" fill="currentColor" /><path d="M111 51L108 85H140L142 124H149M110 62L130 74" /></g></g>
          <g className="g-shock">
            <g className="g-jump">
              <circle cx="144" cy="30" r="9" />
              <circle cx="148" cy="28" r="2.4" />
              <ellipse cx="150" cy="35" rx="1.6" ry="2.4" fill="currentColor" />
              <path d="M138 21L134 14M144 20V12M150 21L154 14" />
              <path d="M144 39L142 72L130 100M142 72L158 96M143 48L127 46L121 30M143 48L159 46L165 30" />
              <path d="M118 30H110M118 40H106M120 50H112" strokeOpacity=".6" />
              <text x="170" y="22" className="g-bang" fill="currentColor" stroke="none">!</text>
            </g>
          </g>
          <g className="g-runA"><circle cx="146" cy="40" r="9" /><circle cx="150" cy="38" r="2" /><path d="M144 49L136 84L120 110L128 128M136 84L156 104L170 100M142 58L126 52M142 58L158 70" /></g>
          <g className="g-runB"><circle cx="146" cy="40" r="9" /><circle cx="150" cy="38" r="2" /><path d="M144 49L136 84L144 128M136 84L128 106L114 112M142 58L156 50M142 58L128 72" /></g>
        </g>
      </g>
    </svg>
  );
}

export function SeatPreview() {
  return <div aria-hidden="true" style={{ ...still, position: 'absolute', inset: 6, color: 'var(--ink)' }}><SeatGag /></div>;
}
