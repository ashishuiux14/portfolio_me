import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const TOOLS = [
  { label: 'Figma',       sub: 'UI Design',          color: 0xff4400, test: (n) => n.z < -0.3 && n.y > 0 },
  { label: 'Framer',      sub: 'Prototyping',         color: 0xff5500, test: (n) => n.z < 0.1 && n.z >= -0.3 && n.y > -0.3 },
  { label: 'Claude',      sub: 'AI Reasoning',        color: 0xff6600, test: (n) => n.y > 0.4 && n.z > -0.1 },
  { label: 'Antigravity', sub: 'AI Coding',           color: 0xff7700, test: (n) => n.z > 0.1 && n.z < 0.6 && n.y > 0 },
  { label: 'AutoCAD',     sub: 'Technical Drawing',   color: 0xff8800, test: (n) => n.x < -0.4 && n.y < 0.6 },
  { label: 'Fusion 360',  sub: '3D Engineering',      color: 0xff9900, test: (n) => n.x > 0.4 && n.y < 0.6 },
  { label: 'Spline',      sub: '3D Web Design',       color: 0xffaa00, test: (n) => n.z > 0.5 },
]

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

export default function BrainHero() {
  const containerRef = useRef(null)
  const canvasRef    = useRef(null)
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [loaded,     setLoaded]     = useState(false)
  const [progress,   setProgress]   = useState(0)

  const r = useRef({
    renderer: null, scene: null, camera: null,
    spinGroup: null, brainGroup: null, gltfScene: null,
    regionLineMap: {}, 
    animId: null, t: 0,
    bbox: new THREE.Box3(), bsize: new THREE.Vector3(), bcenter: new THREE.Vector3(),
  }).current

  // Auto-cycle every 3.5 seconds
  useEffect(() => {
    if (!loaded) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TOOLS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [loaded])

  // Sync highlights
  useEffect(() => {
    Object.values(r.regionLineMap).forEach(list => list.forEach(l => l.visible = false))
    const tool = TOOLS[activeIdx]
    if (tool && r.regionLineMap[tool.label]) {
      r.regionLineMap[tool.label].forEach(l => l.visible = true)
    }
  }, [activeIdx])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    r.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    r.renderer.setSize(container.clientWidth, container.clientHeight)
    r.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    r.renderer.setClearColor(0x000000, 0)

    r.scene  = new THREE.Scene()
    r.camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 5000)
    r.camera.position.set(0, 10, 320)

    r.spinGroup  = new THREE.Group()
    r.brainGroup = new THREE.Group()
    r.spinGroup.add(r.brainGroup)
    r.spinGroup.position.x = 90
    r.scene.add(r.spinGroup)

    const loader = new GLTFLoader()
    loader.load('/brain_human.glb', (gltf) => {
      const scene = gltf.scene
      scene.updateMatrixWorld(true)
      r.gltfScene = scene

      r.bbox.setFromObject(scene)
      r.bbox.getCenter(r.bcenter)
      r.bbox.getSize(r.bsize)
      scene.position.sub(r.bcenter)
      scene.updateMatrixWorld(true)

      const scale = 175 / Math.max(r.bsize.x, r.bsize.y, r.bsize.z)
      r.brainGroup.scale.setScalar(scale)
      r.brainGroup.add(scene)

      // Theme Red Base Wireframe
      const wireMat = new THREE.LineBasicMaterial({ color: 0xe82828, transparent: true, opacity: 0.35 })

      scene.traverse((obj) => {
        if (!obj.isMesh) return
        const sparse = buildSparseEdges(obj.geometry, 0.16)
        const lines = new THREE.LineSegments(sparse, wireMat)
        obj.add(lines)
        obj.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })

        const pos = obj.geometry.attributes.position, idx = obj.geometry.index, half = r.bsize.clone().multiplyScalar(0.5)
        TOOLS.forEach((tool) => {
          const filtered = []
          for (let i = 0; i < idx.count; i += 3) {
            const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2)
            const n = { x: pos.getX(a)/half.x, y: pos.getY(a)/half.y, z: pos.getZ(a)/half.z }
            if (tool.test(n)) {
              filtered.push(pos.getX(a),pos.getY(a),pos.getZ(a), pos.getX(b),pos.getY(b),pos.getZ(b), pos.getX(b),pos.getY(b),pos.getZ(b), pos.getX(c),pos.getY(c),pos.getZ(c), pos.getX(c),pos.getY(c),pos.getZ(c), pos.getX(a),pos.getY(a),pos.getZ(a))
            }
          }
          if (filtered.length) {
            const hlLines = new THREE.LineSegments(
              new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(filtered, 3)),
              new THREE.LineBasicMaterial({ color: tool.color, transparent: true, opacity: 1.0 })
            )
            hlLines.visible = false
            obj.add(hlLines)
            if (!r.regionLineMap[tool.label]) r.regionLineMap[tool.label] = []
            r.regionLineMap[tool.label].push(hlLines)
          }
        })
      })
      setProgress(100); setTimeout(() => setLoaded(true), 250)
    }, (xhr) => { if (xhr.total) setProgress(Math.round((xhr.loaded/xhr.total)*95)) })

    const animate = () => {
      r.animId = requestAnimationFrame(animate)
      r.t += 0.003
      r.spinGroup.rotation.y = r.t
      r.spinGroup.position.y = Math.sin(r.t * 0.8) * 4
      r.renderer.render(r.scene, r.camera)
    }
    animate()
    return () => { cancelAnimationFrame(r.animId); r.renderer.dispose() }
  }, [])

  const currentTool = TOOLS[activeIdx]

  return (
    <div className="brain-hero-wrap" ref={containerRef}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      
      {/* HUD Floating Card — Only information UI element */}
      {loaded && currentTool && (
        <div className="brain-hud-label" style={{ borderLeftColor: new THREE.Color(currentTool.color).getStyle() }}>
          <div className="brain-hud-status">// ACTIVE NEURAL CLUSTER</div>
          <div className="brain-tool-name" style={{ color: new THREE.Color(currentTool.color).getStyle() }}>{currentTool.label}</div>
          <div className="brain-tool-sub">{currentTool.sub}</div>
          
          {/* Progress Timeline Line */}
          <div className="brain-hud-timer">
            <div className="brain-hud-progress" style={{ backgroundColor: new THREE.Color(currentTool.color).getStyle() }} key={activeIdx} />
          </div>
        </div>
      )}

      {!loaded && (
        <div className="brain-loader">
          <div className="brain-loader-label">SYNCING BRAIN MODEL</div>
          <div className="brain-loader-bar"><div className="brain-loader-fill" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
    </div>
  )
}
