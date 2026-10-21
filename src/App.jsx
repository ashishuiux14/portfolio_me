import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Rail, Topbar, Footer, ScrollTop, useTheme } from './components/Shell';

const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const Lab = lazy(() => import('./pages/Lab'));
const LabSoftUI = lazy(() => import('./pages/LabSoftUI'));
const LabControls = lazy(() => import('./pages/LabControls'));
const LabSeatPicker = lazy(() => import('./pages/LabSeatPicker'));
const Printing = lazy(() => import('./pages/Printing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));

const TITLES = {
  '/': 'Ashish Dixit — Senior Product Designer',
  '/work': 'Case studies — Ashish Dixit',
  '/lab': 'Interaction Lab — Ashish Dixit',
  '/lab/soft-ui': 'Soft UI language — Ashish Dixit',
  '/lab/controls': 'Controls — Ashish Dixit',
  '/lab/seat-picker': 'Seat picker — Ashish Dixit',
  '/3d-printing': '3D printing — Ashish Dixit',
  '/about': 'About — Ashish Dixit',
  '/contact': 'Contact — Ashish Dixit',
};

function Frame() {
  const [theme, setTheme] = useTheme();
  const { pathname } = useLocation();
  const isCase = pathname.startsWith('/projects/');
  useEffect(() => { if (TITLES[pathname]) document.title = TITLES[pathname]; }, [pathname]);

  return (
    <div className="shell">
      <Rail theme={theme} setTheme={setTheme} />
      <main className="main" id="content">
        <Topbar theme={theme} setTheme={setTheme} />
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/projects" element={<Navigate to="/work" replace />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/soft-ui" element={<LabSoftUI />} />
            <Route path="/lab/controls" element={<LabControls />} />
            <Route path="/lab/seat-picker" element={<LabSeatPicker />} />
            <Route path="/3d-printing" element={<Printing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* retired links from the previous site */}
            <Route path="/projects/ev-trip-intelligence" element={<Navigate to="/work" replace />} />
            <Route path="/projects/ev-trip-screens" element={<Navigate to="/work" replace />} />
            <Route path="/projects/:slug" element={<CaseStudy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        {!isCase && <Footer />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollTop />
      <Frame />
    </Router>
  );
}
