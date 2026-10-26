import { PageHead, ProjectCard, PrevNext } from '../components/Bits';
import { PRINTS } from '../data/site';

export default function Printing() {
  return (
    <div className="page">
      <PageHead eyebrow="3D printing · industrial design" title="Printed objects."
        lede="Physical products, designed, modelled and 3D printed from sketch to finished object." />
      <div className="grid-2">
        {PRINTS.map((p) => <ProjectCard key={p.slug} to={`/projects/${p.slug}`} {...p} />)}
        <div className="card in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: 300, textAlign: 'center', gap: 8 }}>
          <span className="cap">Next print</span>
          <span className="muted">More industrial design work in progress.</span>
        </div>
      </div>
      <PrevNext prev={{ to: '/lab', label: 'Interaction Lab' }} next={{ to: '/about', label: 'About' }} />
    </div>
  );
}
