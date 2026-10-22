import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHead, PrevNext } from '../components/Bits';
import { ClayToggle, AluToggle, Rotary } from '../lab/Art';
import SeatMap from '../components/SeatMap';
import { LAB } from '../data/site';
import { SeatPreview, SoftUiPreview } from '../components/LabPreviews';

function Preview({ slug }) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  if (slug === 'soft-ui') return <SoftUiPreview />;
  if (slug === 'controls') return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <ClayToggle checked={a} onChange={setA} zoom={0.5} label="Clay toggle preview" />
      <AluToggle checked={b} onChange={setB} zoom={0.48} label="Aluminium toggle preview" />
      <Rotary material="alu" on zoom={0.36} label="Rotary preview" />
    </div>
  );
  return <SeatPreview />;
}

export default function Lab() {
  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab" title="Small controls, fully thought through."
        lede="Everyday components built as studies: every state, size and sound, and the reasoning behind each choice. Most of them twice, once in soft clay and once in machined aluminium." />
      <div className="grid-3">
        {LAB.map((l) => (
          <article key={l.slug} className="up" style={{ borderRadius: 34, padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="in" style={{ position: 'relative', height: 190, borderRadius: 24, display: 'grid', placeItems: 'center', padding: 16 }}><Preview slug={l.slug} /></div>
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
