import { useState } from 'react';
import { PageHead, Sheet, CompareTable, PrevNext } from '../components/Bits';
import Icon from '../components/Icon';
import { ClayToggle, AluToggle, SubmitButton, Stepper, Rotary, Calendar, SoundSwitch } from '../lab/Art';

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
    shared: 'Tap or drag · past the middle commits · Space and Enter press on key-down and switch on key-up · announced as a switch',
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

function Demo({ label, children, metal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, minWidth: 0 }}>
      <div className={metal ? '' : 'in'} style={{ borderRadius: 28, padding: '34px clamp(8px, 3vw, 22px)', minHeight: 170, width: '100%', containerType: 'inline-size', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 24, overflowX: 'auto', ...(metal ? { background: 'linear-gradient(180deg, #E8E8EA, #D6D6D9)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,.14), 0 1px 0 var(--hi)' } : {}) }}>{children}</div>
      <span className="cap">{label}</span>
    </div>
  );
}

function StudyLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="pill up-sm press" style={{ alignSelf: 'flex-start', marginTop: 24 }}>
      {children} <Icon name="link" size={16} />
    </a>
  );
}

export default function LabControls() {
  const [c1, setC1] = useState(true);
  const [a1, setA1] = useState(true);

  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab · 02" title="Controls, in two materials."
        lede="The same five controls built twice. Clay gives, stretches and settles. Aluminium resists, commits and stops dead. The outcome never changes, only how it feels to get there. Press, hold and drag them.">
        <div><SoundSwitch /></div>
      </PageHead>

      <Sheet label="Toggle switch" note="Clay: stiffness 300, damping 0.38, 7 px of overshoot room, 16% press stretch. Aluminium: accelerates into the end in 120 ms and clicks on contact.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · soft"><ClayToggle checked={c1} onChange={setC1} label="Clay toggle" /></Demo>
          <Demo label="Aluminium · hard" metal><AluToggle checked={a1} onChange={setA1} label="Aluminium toggle" /></Demo>
        </div>
        <CompareTable {...T.toggle} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <StudyLink href="/studies/clay-toggle.html">Full study · clay toggle</StudyLink>
          <StudyLink href="/studies/aluminium-toggle.html">Full study · aluminium toggle</StudyLink>
        </div>
      </Sheet>

      <Sheet label="Submit button" note="In each pair the left button saves and the right one fails, so both outcomes can be tried. Double-press while it’s busy: nothing is sent twice.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · saves / fails"><SubmitButton material="clay" outcome="ok" zoom={0.85} /><SubmitButton material="clay" outcome="err" zoom={0.85} /></Demo>
          <Demo label="Aluminium · saves / fails" metal><SubmitButton material="alu" outcome="ok" zoom={0.85} /><SubmitButton material="alu" outcome="err" zoom={0.85} /></Demo>
        </div>
        <CompareTable {...T.submit} />
        <StudyLink href="/studies/submit-button.html">Full study · submit button</StudyLink>
      </Sheet>

      <Sheet label="Plus / minus stepper" note="Hold a key to repeat; it speeds up the longer you hold. Focus the number and use the arrow keys; Shift steps by 10.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Clay · 0 to 20"><Stepper material="clay" value={3} min={0} max={20} label="Clay count" zoom={0.85} /></Demo>
          <Demo label="Aluminium · 0 to 99" metal><Stepper material="alu" value={7} min={0} max={99} label="Aluminium count" zoom={0.85} /></Demo>
        </div>
        <CompareTable {...T.stepper} />
        <StudyLink href="/studies/stepper.html">Full study · stepper</StudyLink>
      </Sheet>

      <Sheet label="Rotary switch" note="Tap to turn, or drag the knob around. A half turn reads as a deliberate act, so it replaces the toggle where a change should feel considered.">
        <div className="grid-2" style={{ marginBottom: 30 }}>
          <Demo label="Plastic"><Rotary material="plastic" label="Plastic rotary switch" zoom={0.8} /></Demo>
          <Demo label="Aluminium" metal><Rotary material="alu" on label="Aluminium rotary switch" zoom={0.8} /></Demo>
        </div>
        <CompareTable {...T.rotary} />
        <StudyLink href="/studies/rotary-switch.html">Full study · rotary switch</StudyLink>
      </Sheet>

      <Sheet label="Date range picker" note="Pick a start, then an end. Hover previews the range before the second click, and a click before the start becomes the new start.">
        <div className="grid-2" style={{ marginBottom: 30, alignItems: 'start' }}>
          <Demo label="Clay"><Calendar material="clay" /></Demo>
          <Demo label="Aluminium" metal><Calendar material="alu" /></Demo>
        </div>
        <CompareTable {...T.date} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <StudyLink href="/studies/date-picker.html">Full study · date picker</StudyLink>
          <StudyLink href="/studies/date-range-picker.html">Full study · date range decisions</StudyLink>
        </div>
      </Sheet>

      <PrevNext prev={{ to: '/lab/soft-ui', label: '01 · Soft UI language' }} next={{ to: '/lab/seat-picker', label: '03 · Seat picker' }} />
    </div>
  );
}
