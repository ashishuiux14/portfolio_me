import { useState } from 'react';
import { PageHead, Sheet, PrevNext } from '../components/Bits';
import Icon from '../components/Icon';
import SeatMap, { SeatLegend } from '../components/SeatMap';

export default function LabSeatPicker() {
  const [grey, setGrey] = useState(false);

  return (
    <div className="page">
      <PageHead eyebrow="Interaction Lab · 03 · Seat picker" title="Draw what you can book boldest."
        lede="Most seat maps get their own hierarchy backwards. Booked seats are drawn as bold, empty outlines that look like open spaces, while the seats you can actually choose are flat fills that look already taken. Architects solved this long ago: the line closest to you is drawn darkest and thickest. This study applies that rule to a seat map." />

      <Sheet label="01 · Which seats can you book?" note="Same theatre, same bookings, drawn two ways. Look at each for one second before reading the legend, then point at a seat you could book right now.">
        <div className="grid-2" style={{ gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <span className="cap">Before · how most apps draw it</span>
            <div className="in" style={{ borderRadius: 28, padding: 22, width: '100%', overflowX: 'auto' }}>
              <SeatMap variant="before" seatSize={24} label="Seat map, common style" interactive={false} />
            </div>
            <SeatLegend variant="before" />
            <p className="muted" style={{ fontSize: 16 }}>The boldest marks are the booked seats: crisp empty outlines that look like open spaces. The seats you can book are flat fills that look occupied. Selected turns orange, a third, unrelated colour, so the legend has to be read every time.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <span className="cap accent">After · the line-weight rule</span>
            <div className="in" style={{ borderRadius: 28, padding: 22, width: '100%', overflowX: 'auto' }}>
              <SeatMap seatSize={24} label="Seat map, line-weight rule" />
            </div>
            <SeatLegend />
            <p className="muted" style={{ fontSize: 16 }}>Available seats get the boldest line and the brightest colour. Your selection is a solid fill of that same colour, so it reads as “one of those, now mine”. Booked seats shrink back to thin grey outlines, still visible for orientation but clearly out of reach.</p>
          </div>
        </div>
      </Sheet>

      <Sheet label="02 · The line-weight rule, from architecture">
        <div className="grid-2" style={{ alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[['Cut', '0.7 mm', 3.2], ['Seen', '0.35 mm', 1.6], ['Beyond', '0.18 mm', .8]].map(([n, w, px]) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 70px', alignItems: 'center', gap: 16 }}>
                <span className="cap">{n}</span>
                <span style={{ height: px, background: 'var(--ink)', borderRadius: 2 }} aria-hidden="true" />
                <span className="cap tabular">{w}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p>In a section drawing, what the cutting plane passes through is drawn heaviest. Things seen beyond it get lighter and thinner the further back they are. Weight tells you distance, and distance tells you what matters.</p>
            <p className="muted">A seat map is a drawing with a job: help you act. The seats you can act on are “closest” to you, so they get the heavy line. The booked ones are scenery and step back. Line weight and size survive bad screens, sunlight and colour blindness; colour alone doesn’t.</p>
          </div>
        </div>
      </Sheet>

      <Sheet label="03 · Someone is sitting there: you">
        <div className="grid-2" style={{ alignItems: 'center', gap: 36 }}>
          <div className="in" style={{ borderRadius: 28, padding: 22, overflowX: 'auto' }}>
            <SeatMap seatSize={34} cols={8} rows={['A', 'B', 'C']} booked={['A2', 'B7', 'C3']} initial={['B3', 'B4', 'B5']} label="Group booking example" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p>A selected seat gets a small human figure. It turns an abstract fill into “this is where you’ll be”, and with a group it shows at a glance how many people you’ve seated.</p>
            <p className="muted"><b style={{ color: 'var(--ink)', fontWeight: 500 }}>Why a person.</b> Booking for four, people count seats against heads. One figure per seat makes that count instant.</p>
            <p className="muted"><b style={{ color: 'var(--ink)', fontWeight: 500 }}>Why it drops in.</b> The figure settles into the seat like someone sitting down. It is the only motion on the map, so it is also the confirmation that the tap registered.</p>
          </div>
        </div>
      </Sheet>

      <Sheet label="04 · The greyscale test" note="On the usual map the pale blue and the orange collapse into similar greys, and the only bold marks left are the seats you can’t book. With the line-weight rule every state still reads, because it was never carried by colour alone.">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button type="button" role="switch" aria-checked={grey} onClick={() => setGrey(!grey)} className={`pill ${grey ? 'in-sm' : 'up-sm press'}`} style={{ cursor: 'pointer', fontWeight: 500 }}>
            {grey ? 'Colour off' : 'Turn colour off'}
          </button>
        </div>
        <div className="grid-2" style={{ gap: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><span className="cap">Before</span><div className="in" style={{ borderRadius: 28, padding: 18, width: '100%', overflowX: 'auto' }}><SeatMap variant="before" seatSize={22} grey={grey} interactive={false} label="Before, greyscale test" /></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><span className="cap">After</span><div className="in" style={{ borderRadius: 28, padding: 18, width: '100%', overflowX: 'auto' }}><SeatMap seatSize={22} grey={grey} interactive={false} label="After, greyscale test" /></div></div>
        </div>
      </Sheet>

      <Sheet label="05 · Every seat has a voice">
        <div className="grid-2" style={{ alignItems: 'start', gap: 36 }}>
          <div className="in" style={{ borderRadius: 28, padding: 22, overflowX: 'auto' }}>
            <SeatMap seatSize={30} label="Keyboard seat map" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p>Click a seat, then use the arrow keys. A screen reader hears the row, the number, the price and the state, including seats that are already booked, so the layout makes sense without seeing it.</p>
            <div className="up-sm" style={{ borderRadius: 22, padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink-2)' }}>“Row C, seat 5, $16, selected”</div>
            <p className="muted"><b style={{ color: 'var(--ink)', fontWeight: 500 }}>Why booked seats stay focusable.</b> Skipping them would make the rows jump unpredictably. Landing on one and hearing “booked” tells you where the gaps are.</p>
            <p className="muted"><b style={{ color: 'var(--ink)', fontWeight: 500 }}>Why the price is in the name.</b> Price is the second question after “is it free?”. Hearing it with the seat saves a trip to a summary somewhere else.</p>
          </div>
        </div>
      </Sheet>

      <a href="/studies/seat-map.html" target="_blank" rel="noreferrer" className="pill up-sm press" style={{ alignSelf: 'flex-start' }}>Read the full seat map study <Icon name="ext" size={16} /></a>

      <PrevNext prev={{ to: '/lab/controls', label: '02 · Controls' }} next={{ to: '/lab/crosshair', label: '04 · Crosshair' }} />
    </div>
  );
}
