import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import './styles.css';

const stats = [
  { label: 'Active licences', value: '1,248', accent: 'violet' },
  { label: 'API validations', value: '98.7%', accent: 'cyan' },
  { label: 'Active users', value: '326', accent: 'pink' },
];

function App() {
  const [activeSection, setActiveSection] = useState('Overview');
  const [showNotice, setShowNotice] = useState(false);

  const sections = ['Overview', 'Licences', 'Users', 'Security'];

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="topbar">
        <div className="brand-mark"><span>BB</span><div><strong>BLACK BUNNY</strong><small>CONTROL PANEL</small></div></div>
        <div className="status-pill"><i /> API online</div>
        <button className="profile-button" onClick={() => setShowNotice(true)} aria-label="Open profile">SB</button>
      </nav>

      <section className="hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <p className="eyebrow">OWNER CONSOLE / 01</p>
          <h1>Build with <span>control.</span></h1>
          <p className="hero-text">A secure command center for licences, users and API activity—rebuilt for a faster, more expressive workflow.</p>
          <button className="primary-button" onClick={() => setShowNotice(true)}>Enter workspace <b>↗</b></button>
        </motion.div>
        <motion.div className="orbital-stage" initial={{ opacity: 0, scale: .86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .15 }} aria-hidden="true">
          <div className="orbital-ring ring-a" /><div className="orbital-ring ring-b" /><div className="orbital-core">BB</div><div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" />
        </motion.div>
      </section>

      <section className="workspace-card">
        <div className="section-tabs" role="tablist" aria-label="Dashboard sections">
          {sections.map((section) => <button key={section} className={activeSection === section ? 'tab active' : 'tab'} onClick={() => setActiveSection(section)}>{section}</button>)}
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
