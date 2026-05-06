const fs = require('fs');

const PV = [];
const PE = [];

function addPoint(x, y, z) {
  PV.push([Math.round(x*1000)/1000, Math.round(y*1000)/1000, Math.round(z*1000)/1000]);
  return PV.length - 1;
}

function addLine(a, b) {
  PE.push([a, b]);
}

// Generate a dense cylinder
function addCylinder(cx, cy, cz, r, h, segments, isHorizontalX = false, isHorizontalZ = false) {
  const cap1 = [];
  const cap2 = [];
  for (let i=0; i<segments; i++) {
    const angle = (i/segments)*Math.PI*2;
    const a = Math.cos(angle)*r;
    const b = Math.sin(angle)*r;
    let x1, y1, z1, x2, y2, z2;
    if (isHorizontalX) {
      x1 = cx - h/2; y1 = cy + a; z1 = cz + b;
      x2 = cx + h/2; y2 = cy + a; z2 = cz + b;
    } else if (isHorizontalZ) {
      x1 = cx + a; y1 = cy + b; z1 = cz - h/2;
      x2 = cx + a; y2 = cy + b; z2 = cz + h/2;
    } else { // vertical
      x1 = cx + a; y1 = cy - h/2; z1 = cz + b;
      x2 = cx + a; y2 = cy + h/2; z2 = cz + b;
    }
    cap1.push(addPoint(x1, y1, z1));
    cap2.push(addPoint(x2, y2, z2));
  }
  for (let i=0; i<segments; i++) {
    const next = (i+1)%segments;
    addLine(cap1[i], cap1[next]);
    addLine(cap2[i], cap2[next]);
    addLine(cap1[i], cap2[i]);
  }
}

// Generate a sphere
function addSphere(cx, cy, cz, r, latSegments, lonSegments) {
  const pts = [];
  for (let lat=0; lat<=latSegments; lat++) {
    const theta = (lat/latSegments)*Math.PI;
    const y = cy - Math.cos(theta)*r;
    const sr = Math.sin(theta)*r;
    pts.push([]);
    for (let lon=0; lon<lonSegments; lon++) {
      const phi = (lon/lonSegments)*Math.PI*2;
      const x = cx + Math.cos(phi)*sr;
      const z = cz + Math.sin(phi)*sr;
      pts[lat].push(addPoint(x, y, z));
    }
  }
  for (let lat=0; lat<latSegments; lat++) {
    for (let lon=0; lon<lonSegments; lon++) {
      const nextLon = (lon+1)%lonSegments;
      addLine(pts[lat][lon], pts[lat][nextLon]); // Horizontal
      addLine(pts[lat][lon], pts[lat+1][lon]);   // Vertical
    }
  }
}

function addBox(x, y, z, w, h, d) {
  const p0 = addPoint(x - w/2, y - h/2, z - d/2);
  const p1 = addPoint(x + w/2, y - h/2, z - d/2);
  const p2 = addPoint(x + w/2, y + h/2, z - d/2);
  const p3 = addPoint(x - w/2, y + h/2, z - d/2);
  const p4 = addPoint(x - w/2, y - h/2, z + d/2);
  const p5 = addPoint(x + w/2, y - h/2, z + d/2);
  const p6 = addPoint(x + w/2, y + h/2, z + d/2);
  const p7 = addPoint(x - w/2, y + h/2, z + d/2);

  addLine(p0, p1); addLine(p1, p2); addLine(p2, p3); addLine(p3, p0);
  addLine(p4, p5); addLine(p5, p6); addLine(p6, p7); addLine(p7, p4);
  addLine(p0, p4); addLine(p1, p5); addLine(p2, p6); addLine(p3, p7);
}

// --- DESK ---
addBox(0, 0.2, 0.4, 1.2, 0.05, 0.6); // top
addBox(-0.5, 0.6, 0.6, 0.05, 0.8, 0.05); // legs
addBox(0.5, 0.6, 0.6, 0.05, 0.8, 0.05);
addBox(-0.5, 0.6, 0.2, 0.05, 0.8, 0.05);
addBox(0.5, 0.6, 0.2, 0.05, 0.8, 0.05);

// --- LAPTOP ---
addBox(0, 0.15, 0.25, 0.35, 0.02, 0.25); // base
// Screen
const p0 = addPoint(-0.175, 0.14, 0.125);
const p1 = addPoint(0.175, 0.14, 0.125);
const p2 = addPoint(0.175, -0.1, 0.05);
const p3 = addPoint(-0.175, -0.1, 0.05);
addLine(p0, p1); addLine(p1, p2); addLine(p2, p3); addLine(p3, p0);

// --- CHAIR ---
addCylinder(0, 0.45, -0.2, 0.2, 0.05, 12); // seat
addCylinder(0, 0.15, -0.35, 0.18, 0.25, 8, true); // backrest (horizontal cylinder approx)
addCylinder(0, 0.7, -0.2, 0.02, 0.5, 6); // stand
addCylinder(0, 0.95, -0.2, 0.25, 0.02, 12); // base

// --- PERSON ---
addSphere(0, -0.25, -0.15, 0.12, 6, 8); // Head
addSphere(0, 0.1, -0.1, 0.15, 6, 8); // Torso

// Arms
addCylinder(-0.2, 0, -0.1, 0.04, 0.25, 6); // Upper arm L
addCylinder(0.2, 0, -0.1, 0.04, 0.25, 6);  // Upper arm R
addCylinder(-0.15, 0.1, 0.1, 0.03, 0.25, 6, false, true); // Lower arm L
addCylinder(0.15, 0.1, 0.1, 0.03, 0.25, 6, false, true);  // Lower arm R

// Legs
addCylinder(-0.1, 0.45, 0, 0.05, 0.3, 6, false, true); // Thigh L
addCylinder(0.1, 0.45, 0, 0.05, 0.3, 6, false, true);  // Thigh R
addCylinder(-0.1, 0.75, 0.15, 0.04, 0.4, 6); // Calf L
addCylinder(0.1, 0.75, 0.15, 0.04, 0.4, 6);  // Calf R

// --- HUD RINGS ---
// Add concentric rings that rotate around (just static here, the whole scene rotates)
const numRings = 4;
for (let r=0; r<numRings; r++) {
  const radius = 0.8 + r*0.15;
  const pts = [];
  const segments = 32;
  // Let's angle the rings
  const pitch = Math.PI/4 * (r%2==0 ? 1 : -1);
  for(let i=0; i<segments; i++) {
    const a = (i/segments)*Math.PI*2;
    const x = Math.cos(a)*radius;
    const z = Math.sin(a)*radius;
    // apply pitch
    const xp = x;
    const yp = z*Math.sin(pitch);
    const zp = z*Math.cos(pitch);
    pts.push(addPoint(xp, yp + 0.2, zp));
  }
  for(let i=0; i<segments; i++) {
    addLine(pts[i], pts[(i+1)%segments]);
  }
}

fs.writeFileSync('mesh.json', JSON.stringify({ PV, PE }));
