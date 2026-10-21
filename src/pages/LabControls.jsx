import { useState } from 'react';
import { PageHead, Sheet, CompareTable, PrevNext } from '../components/Bits';
import { Toggle, Stepper, Rotary, SubmitButton, DateRange } from '../components/Controls';

const T = {
  toggle: {
    head: ['Moment', 'Clay', 'Aluminium'],
    rows: [
      ['Press', 'Stretches 16% toward where it will go', 'Sinks 2.5 px into its housing'],
      ['Travel', 'Stretches with speed, up to 25%', 'Keeps its exact shape'],
      ['Timing', 'Spring, about 700 ms to rest', 'Accelerates into the end, 120 ms'],
      ['Arrival', 'Overshoots 7 px, squashes, wobbles', 'Stops dead, no overshoot'],
      ['State colour', 'Fills gradually as the knob moves', 'Lights the instant contact is made'],
    ],
  },
  submit: {
    head: ['Moment', 'Clay', 'Aluminium'],
    rows: [
      ['Press', 'Flattens and widens into the surface', 'Face drops 2.5 px with a click'],
      ['Release', 'Springs back up with a small wobble', 'Rises with a softer click'],
      ['Waiting', 'Breathes, a slow even swell', 'Light runs around the rim'],
      ['Success', 'Puffs up, turns green, shows a check', 'Rim lights green with a clean click'],
      ['Failure', 'Sags and wobbles back, reason below', 'Rim blinks red twice, low double buzz'],
    ],
    shared: 'Width never changes · nothing shown for the first 150 ms · waiting shown for at least 400 ms · presses ignored while busy · every state announced to screen readers',
  },
  stepper: {
    head: ['Moment', 'Clay', 'Aluminium'],
    rows: [
      ['Press', 'Key squishes, number changes at once', 'Key clicks down 2 px, drum rolls at once'],
      ['Release', 'Key springs back with a small wobble', 'A softer click as the key rises'],
      ['Direction', 'Number swells going up, shrinks going down', 'Digits roll up or down and carry past 9'],
      ['Hold', 'Steps speed up, each one a small swell', 'Steps speed up, each one a ratchet tick'],
      ['Limit', 'Key squashes further, number shakes, value stays', 'Key won’t travel, a dull thunk, drum stays still'],
    ],
    shared: 'Changes on press · 400 ms before repeating · speeds up to 25 steps a second · Shift steps by 10 · arrows, Page Up/Down, Home/End · announced as a spin button',
  },
  rotary: {
    head: ['Moment', 'Plastic', 'Aluminium'],
    rows: [
      ['Turn', 'Smooth, light, follows the finger closely', 'Heavier, resists until halfway'],
      ['Timing', 'Eases in and out, 260 ms', 'Accelerates into the stop, 160 ms'],
      ['Arrival', 'Settles gently, no bounce', 'Stops dead'],
      ['Indicator', 'Painted line fades from red to green', 'Inlaid line snaps from red to glowing green'],
      ['Sound', 'A dull, rounded click', 'A sharp click with a short ring'],
    ],
    shared: 'Tap turns it · drag past halfway commits · red line on the left is off, green line on the right is on · Space, Enter and the arrow keys · announced as a switch',
  },
  date: {
    head: ['Moment', 'Clay', 'Aluminium'],
    rows: [
      ['Press a day', 'The tile squishes and springs back', 'The key clicks down 2 px'],
      ['Start and end', 'Tiles turn green and puff up', 'Keys latch down and glow'],
      ['Preview', 'A clay band stretches after the pointer', 'Keys light faintly, instantly'],
      ['Range set', 'The band settles, the tiles inside flatten into it', 'Keys light up one after another, like relays'],
      ['Change month', 'The grid slides over and settles with a small overshoot', 'The month drum rolls one detent per month, with a tick'],
    ],
    shared: 'Hover previews the range · a click before the start becomes the new start · arrows, Page Up/Down, Enter, Esc · every change announced',
  },
};

function Demo({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div className="in" style={{ borderRadius: 28, padding: '30px 26px', minHeight: 150, width: '100%', display: 'grid', placeItems: 'center' }}>{children}</div>
      <span className="cap">{label}</span>
    </div>
  );
}

export default function LabControls() {
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(true);
  const [s1, setS1] = useState(2);
  const [s2, setS2] = useState(7);
  const [r1, setR1] = useState(false);
  const [r2, setR2] = useState(true);

  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab · 02" title="Controls, in two materials."
        lede="The same five controls built twice. Clay gives, stretches and settles. Aluminium resists, commits and stops dead. The outcome never changes, only how it feels to get there." />

      <Sheet label="Toggle switch" note="Clay: stiffness 300, damping 0.38, 7 px of overshoot room. Aluminium: accelerates into the end in 120 ms. Both are role=switch and toggle with a tap, Space or Enter.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · soft"><Toggle checked={t1} onChange={setT1} label="Clay toggle" /></Demo>
          <Demo label="Aluminium · hard"><Toggle checked={t2} onChange={setT2} material="alu" label="Aluminium toggle" /></Demo>
        </div>
        <CompareTable {...T.toggle} />
      </Sheet>

      <Sheet label="Submit button" note="In each pair the left button saves and the right one fails, so both outcomes can be tried.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · saves / fails"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}><SubmitButton material="clay" outcome="ok" /><SubmitButton material="clay" outcome="err" /></div></Demo>
          <Demo label="Aluminium · saves / fails"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}><SubmitButton material="alu" outcome="ok" /><SubmitButton material="alu" outcome="err" /></div></Demo>
        </div>
        <CompareTable {...T.submit} />
      </Sheet>

      <Sheet label="Plus / minus stepper" note="Hold a key to repeat. Click the number and use the arrow keys; Shift steps by 10.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · 0 to 10"><Stepper value={s1} onChange={setS1} min={0} max={10} label="Clay count" /></Demo>
          <Demo label="Aluminium · 0 to 10"><Stepper value={s2} onChange={setS2} min={0} max={10} material="alu" label="Aluminium count" /></Demo>
        </div>
        <CompareTable {...T.stepper} />
      </Sheet>

      <Sheet label="Rotary switch" note="A replacement for the toggle where it matters: a half turn reads as a deliberate act.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Plastic"><Rotary on={r1} onChange={setR1} size={130} label="Plastic rotary switch" /></Demo>
          <Demo label="Aluminium"><Rotary on={r2} onChange={setR2} size={130} material="alu" label="Aluminium rotary switch" /></Demo>
        </div>
        <CompareTable {...T.rotary} />
      </Sheet>

      <Sheet label="Date range picker" note="Built on the date range study: preview the span before the second click, and treat a click before the start as a new start.">
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: 30 }}><DateRange /></div>
        <CompareTable {...T.date} />
      </Sheet>

      <PrevNext prev={{ to: '/lab/soft-ui', label: '01 · Soft UI language' }} next={{ to: '/lab/seat-picker', label: '03 · Seat picker' }} />
    </div>
  );
}
