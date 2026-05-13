import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/* ── Tool definitions ── */
const TOOLS = [
  { label: 'Figma',       sub: 'UI Design',        color: 0xff4400, seed: [0,    0.3, -0.7]  },
  { label: 'Framer',      sub: 'Prototyping',       color: 0xff5500, seed: [-0.6, -0.1, -0.2] },
  { label: 'Claude',      sub: 'AI Reasoning',      color: 0xff6600, seed: [0,    0.8,  0]    },
  { label: 'Antigravity', sub: 'AI Coding',         color: 0xff7700, seed: [0,    0.4,  0.4]  },
  { label: 'AutoCAD',     sub: 'Technical Drawing', color: 0xff8800, seed: [0,   -0.2,  0.7]  },
  { label: 'Fusion 360',  sub: '3D Engineering',    color: 0xff9900, seed: [0.6, -0.1, -0.2]  },
  { label: 'Spline',      sub: '3D Web Design',     color: 0xffaa00, seed: [0,   -0.7,  0.3]  },
]

function noise3D(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const fx = x - ix, fy = y - iy, fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)
  const h = (a, b, c) => {
    let n = a * 127 + b * 311 + c * 593
    n = (n << 13) ^ n
    return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 0x7fffffff
  }
  const lerp = (a, b, t) => a + t * (b - a)
  return lerp(
    lerp(
      lerp(h(ix, iy, iz),     h(ix + 1, iy, iz),     ux),
      lerp(h(ix, iy + 1, iz), h(ix + 1, iy + 1, iz), ux),
      uy
    ),
    lerp(
      lerp(h(ix, iy, iz + 1),     h(ix + 1, iy, iz + 1),     ux),
      lerp(h(ix, iy + 1, iz + 1), h(ix + 1, iy + 1, iz + 1), ux),
      uy
    ),
    uz
  )
}

function fbm3D(x, y, z) {
  let val = 0, amp = 1, freq = 1, total = 0
  for (let i = 0; i < 4; i++) {
    val += amp * noise3D(x * freq, y * freq, z * freq)
    total += amp
    amp *= 0.5
    freq *= 2.1
  }
  return val / total
}

function findOwnerTool(nx, ny, nz) {
  let bestIdx = 0, bestDist = Infinity
  const noiseScale = 2.8, noiseMag = 0.35
  for (let i = 0; i < TOOLS.length; i++) {
    const [sx, sy, sz] = TOOLS[i].seed
    const dx = nx - sx, dy = ny - sy, dz = nz - sz
    let dist = Math.hypot(dx, dy, dz)
    const warp = fbm3D(nx * noiseScale + i * 7.3, ny * noiseScale + i * 3.1, nz * noiseScale + i * 5.7)
    dist += (warp - 0.5) * noiseMag
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  }
  return bestIdx
}

function buildSparseEdges(geo, ratio = 0.16) {
  const pos = geo.attributes.position, idx = geo.index
  if (!idx) return new THREE.BufferGeometry()
  const seen = new Set(), verts = [], step = Math.max(1, Math.round(1 / ratio))
  const add = (a, b) => {
    const k = a < b ? `${a}_${b}` : `${b}_${a}`
    if (seen.has(k)) return
    seen.add(k)
    verts.push(pos.getX(a), pos.getY(a), pos.getZ(a), pos.getX(b), pos.getY(b), pos.getZ(b))
  }
  for (let i = 0; i < idx.count; i += 3) {
    if ((i / 3) % step !== 0) continue
    const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2)
    add(a, b); add(b, c); add(c, a)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  return g
}

function buildToolHighlights(obj, toolIdx, pos, idx, half, regionLineMap) {
  const tool = TOOLS[toolIdx], filtered = []
  for (let i = 0; i < idx.count; i += 3) {
    const a = idx.getX(i), nx = pos.getX(a) / half.x, ny = pos.getY(a) / half.y, nz = pos.getZ(a) / half.z
    if (findOwnerTool(nx, ny, nz) === toolIdx) {
      const b = idx.getX(i + 1), c = idx.getX(i + 2)
      filtered.push(
        pos.getX(a), pos.getY(a), pos.getZ(a), pos.getX(b), pos.getY(b), pos.getZ(b),
        pos.getX(b), pos.getY(b), pos.getZ(b), pos.getX(c), pos.getY(c), pos.getZ(c),
        pos.getX(c), pos.getY(c), pos.getZ(c), pos.getX(a), pos.getY(a), pos.getZ(a)
      )
    }
  }
  if (filtered.length) {
    const hlGeo = new THREE.BufferGeometry()
    hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(filtered, 3))
    const hlLines = new THREE.LineSegments(hlGeo, new THREE.LineBasicMaterial({ color: tool.color, transparent: true, opacity: 1 }))
    hlLines.visible = false
    obj.add(hlLines)
    if (!regionLineMap[tool.label]) regionLineMap[tool.label] = []
    regionLineMap[tool.label].push(hlLines)
  }
}

function processMesh(obj, wireMat, bsize, regionLineMap) {
  const sparse = buildSparseEdges(obj.geometry, 0.16)
  const lines = new THREE.LineSegments(sparse, wireMat)
  obj.add(lines)
  obj.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  const pos = obj.geometry.attributes.position, idx = obj.geometry.index, half = bsize.clone().multiplyScalar(0.5)
  for (let t = 0; t < TOOLS.length; t++) { buildToolHighlights(obj, t, pos, idx, half, regionLineMap) }
}

export default function BrainHero() {
  const containerRef = useRef(null), canvasRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0), [loaded, setLoaded] = useState(false), [progress, setProgress] = useState(0)
  const r = useRef({
    renderer: null, scene: null, camera: null, spinGroup: null, brainGroup: null, gltfScene: null, regionLineMap: {},
    animId: null, t: 0, bbox: new THREE.Box3(), bsize: new THREE.Vector3(), bcenter: new THREE.Vector3(),
  }).current

  useEffect(() => {
    if (!loaded) return
    const interval = setInterval(() => { setActiveIdx((prev) => (prev + 1) % TOOLS.length) }, 3500)
    return () => clearInterval(interval)
  }, [loaded])

  useEffect(() => {
    Object.values(r.regionLineMap).forEach(list => list.forEach(l => { l.visible = false }))
    const tool = TOOLS[activeIdx]
    if (tool && r.regionLineMap[tool.label]) { r.regionLineMap[tool.label].forEach(l => { l.visible = true }) }
  }, [activeIdx])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    r.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    r.renderer.setSize(container.clientWidth, container.clientHeight)
    r.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2))
    r.scene = new THREE.Scene()
    r.camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 5000)
    r.camera.position.set(0, 0, 300)

    r.spinGroup = new THREE.Group()
    r.brainGroup = new THREE.Group()
    r.spinGroup.add(r.brainGroup)
    r.spinGroup.position.x = 0
    r.scene.add(r.spinGroup)

    new GLTFLoader().load('/brain_human.glb', (gltf) => {
      const scene = gltf.scene
      scene.updateMatrixWorld(true)
      r.gltfScene = scene
      r.bbox.setFromObject(scene)
      r.bbox.getCenter(r.bcenter)
      r.bbox.getSize(r.bsize)
      scene.position.sub(r.bcenter)
      const scale = 220 / Math.max(r.bsize.x, r.bsize.y, r.bsize.z)
      r.brainGroup.scale.setScalar(scale)
      r.brainGroup.add(scene)
      const wireMat = new THREE.LineBasicMaterial({ color: 0xe82828, transparent: true, opacity: 0.35 })
      scene.traverse((obj) => { if (obj.isMesh) processMesh(obj, wireMat, r.bsize, r.regionLineMap) })
      setProgress(100); setTimeout(() => setLoaded(true), 250)
    }, (xhr) => { if (xhr.total) setProgress(Math.round((xhr.loaded / xhr.total) * 95)) })

    const animate = () => {
      r.animId = requestAnimationFrame(animate); r.t += 0.003
      r.spinGroup.rotation.y = r.t; r.spinGroup.position.y = Math.sin(r.t * 0.8) * 4
      r.renderer.render(r.scene, r.camera)
    }
    animate()
    return () => { cancelAnimationFrame(r.animId); r.renderer.dispose() }
  }, [])

  const currentTool = TOOLS[activeIdx]

  return (
    <div className="brain-hero-wrap" ref={containerRef}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {loaded && currentTool && (
        <div className="brain-hud-label" style={{ borderLeftColor: new THREE.Color(currentTool.color).getStyle() }}>
          <div className="brain-hud-status">{'// ACTIVE NEURAL CLUSTER'}</div>
          <div className="brain-tool-name" style={{ color: new THREE.Color(currentTool.color).getStyle() }}>{currentTool.label}</div>
          <div className="brain-tool-sub">{currentTool.sub}</div>
          <div className="brain-hud-timer"><div className="brain-hud-progress" style={{ backgroundColor: new THREE.Color(currentTool.color).getStyle() }} key={activeIdx} /></div>
        </div>
      )}
      {!loaded && (
        <div className="brain-loader">
          <div className="brain-loader-label">{'SYNCING BRAIN MODEL'}</div>
          <div className="brain-loader-bar"><div className="brain-loader-fill" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
    </div>
  )
}
