import { ClayToggle, SubmitButton } from '../lab/Art';
import SeatMap from './SeatMap';

/* Small, non-interactive previews for lab tiles that sit inside links. */
const still = { pointerEvents: 'none' };

export function ControlsPreview() {
  return (
    <div className="lab-prev" aria-hidden="true" inert="" style={{ ...still, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, flexWrap: 'wrap' }}>
      <ClayToggle checked zoom={0.5} label="Clay toggle preview" onChange={() => {}} />
      <SubmitButton material="alu" zoom={0.5} />
    </div>
  );
}

// the seats you picked draw a face
const FACE = ['B3', 'B6', 'D2', 'D7', 'E3', 'E4', 'E5', 'E6'];
export function SeatPreview({ seatSize = 15 }) {
  return (
    <div aria-hidden="true" inert="" style={{ ...still, position: 'relative', display: 'grid', placeItems: 'center' }}>
      <SeatMap seatSize={seatSize} cols={8} rows={['A', 'B', 'C', 'D', 'E']} booked={[]} initial={FACE} max={8} interactive={false} label="Seat map preview" />
    </div>
  );
}
