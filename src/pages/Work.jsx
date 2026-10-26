import { PageHead, ProjectCard, PrevNext } from '../components/Bits';
import { CASE_STUDIES } from '../data/site';

export default function Work() {
  return (
    <div className="page">
      <PageHead eyebrow="Case studies" title="Products, end to end."
        lede="Four projects taken from research to a working design. Client work under NDA is described in conversation, never shown." />
      <div className="grid-2">
        {CASE_STUDIES.map((c) => <ProjectCard key={c.slug} to={`/projects/${c.slug}`} {...c} />)}
      </div>
      <PrevNext prev={{ to: '/', label: 'Home', eyebrow: 'Back' }} next={{ to: '/lab', label: 'Interaction Lab' }} />
    </div>
  );
}
