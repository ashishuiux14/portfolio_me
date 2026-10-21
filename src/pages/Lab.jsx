import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHead, PrevNext } from '../components/Bits';
import { Toggle, Rotary } from '../components/Controls';
import SeatMap from '../components/SeatMap';
import { LAB } from '../data/site';

function Preview({ slug }) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  if (slug === 'soft-ui') return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <span className="up" style={{ width: 70, height: 70, borderRadius: 22 }} />
      <span className="in" style={{ width: 70, height: 70, borderRadius: 22 }} />
      <span className="lcd" style={{ fontSize: 22 }}>21°C</span>
    </div>
  );
  if (slug === 'controls') return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Toggle checked={a} onChange={setA} label="Clay toggle preview" />
      <Toggle checked={b} onChange={setB} material="alu" label="Aluminium toggle preview" />
      <Rotary on={b} onChange={setB} size={70} material="alu" label="Rotary preview" />
    </div>
  );
  return <SeatMap seatSize={18} cols={8} rows={['A', 'B', 'C']} booked={['A2', 'A3', 'B6', 'C1']} initial={['B3', 'B4']} interactive={false} />;
}

export default function Lab() {
  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab" title="Small controls, fully thought through."
        lede="Everyday components built as studies: every state, size and sound, and the reasoning behind each choice. Most of them twice, once in soft clay and once in machined aluminium." />
      <div className="grid-3">
        {LAB.map((l) => (
          <article key={l.slug} className="up" style={{ borderRadius: 34, padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="in" style={{ height: 190, borderRadius: 24, display: 'grid', placeItems: 'center', padding: 16 }}><Preview slug={l.slug} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 6px', flex: 1 }}>
              <span className="cap accent">{l.n}</span>
              <h2 className="h3">{l.name}</h2>
              <p className="muted" style={{ fontSize: 16 }}>{l.sub}</p>
            </div>
            <Link to={`/lab/${l.slug}`} className="pill up-sm press" style={{ justifyContent: 'space-between' }}>Open study <Icon name="arrow" /></Link>
          </article>
        ))}
      </div>
      <PrevNext prev={{ to: '/work', label: 'Case studies' }} next={{ to: '/lab/soft-ui', label: '01 · Soft UI language' }} />
    </div>
  );
}
