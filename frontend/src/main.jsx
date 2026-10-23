import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const sections = ['Overview', 'Licences', 'Users', 'Security'];
const stats = [
  { label: 'Active licences', value: '1,248', accent: 'violet' },
  { label: 'API validations', value: '98.7%', accent: 'cyan' },
  { label: 'Active users', value: '326', accent: 'pink' },
];

function CoreObject() {
  const mesh = useRef(null);
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.18;
      mesh.current.rotation.y += delta * 0.28;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.7}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.15, 2]} />
        <meshStandardMaterial color="#7659ff" emissive="#24135f" emissiveIntensity={1.2} roughness={0.28} metalness={0.68} />
      </mesh>
    </Float>
  );
}

function OrbitalScene() {
  return (
    <div className="orbital-stage three-stage" aria-label="Interactive Black Bunny 3D visual">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.7]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 3, 3]} color="#9d84ff" intensity={12} />
        <pointLight position={[-3, -2, 2]} color="#50e6ff" intensity={8} />
        <CoreObject />
        <Sparkles count={55} scale={4.5} size={2.2} speed={0.35} color="#bbaeff" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
      <div className="scene-label">DRAG TO EXPLORE</div>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('Overview');
  const [showNotice, setShowNotice] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API health check failed');
        return response.json();
      })
      .then((payload) => setApiStatus(payload.ok ? 'online' : 'offline'))
      .catch((error) => {
        if (error.name !== 'AbortError') setApiStatus('offline');
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="topbar">
        <div className="brand-mark"><span>BB</span><div><strong>BLACK BUNNY</strong><small>CONTROL PANEL</small></div></div>
        <div className={`status-pill ${apiStatus}`}><i /> API {apiStatus}</div>
        <button className="profile-button" onClick={() => setShowNotice(true)} aria-label="Open profile">SB</button>
      </nav>

      <section className="hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <p className="eyebrow">OWNER CONSOLE / 01</p>
          <h1>Build with <span>control.</span></h1>
          <p className="hero-text">A secure command center for licences, users and API activity—rebuilt for a faster, more expressive workflow.</p>
          <button className="primary-button" onClick={() => setShowNotice(true)}>Enter workspace <b>↗</b></button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .15 }}><OrbitalScene /></motion.div>
      </section>

      <section className="workspace-card">
        <div className="section-tabs" role="tablist" aria-label="Dashboard sections">
          {sections.map((section) => <button key={section} role="tab" aria-selected={activeSection === section} className={activeSection === section ? 'tab active' : 'tab'} onClick={() => setActiveSection(section)}>{section}</button>)}
        </div>
        <div className="workspace-heading"><div><p className="eyebrow">LIVE SNAPSHOT</p><h2>{activeSection}</h2></div><span className="secure-label">● SECURE SESSION</span></div>
        <div className="stats-grid">{stats.map((stat) => <motion.article className={`stat-card ${stat.accent}`} key={stat.label} whileHover={{ y: -5, scale: 1.015 }}><span>{stat.label}</span><strong>{stat.value}</strong><small>↗ compared to last cycle</small></motion.article>)}</div>
        <div className="activity-row"><div><span className="activity-icon">✦</span><div><strong>Migration foundation ready</strong><small>React shell connected to the new API boundary</small></div></div><span className="activity-time">JUST NOW</span></div>
      </section>
      {showNotice && <motion.div className="toast" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><span>✓</span> Interaction ready for the next migration phase <button onClick={() => setShowNotice(false)}>×</button></motion.div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
