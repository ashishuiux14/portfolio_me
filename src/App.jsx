import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';

// Components
import Nav from './components/Nav';
import HUD from './components/HUD';
import BackgroundCanvas from './components/BackgroundCanvas';
import CursorCanvas from './components/CursorCanvas';
import Footer from './components/Footer';

// Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ThreeDPrinting = lazy(() => import('./pages/ThreeDPrinting'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectEV = lazy(() => import('./pages/ProjectEV'));
const ProjectEVScreens = lazy(() => import('./pages/ProjectEVScreens'));
const ProjectCleanero = lazy(() => import('./pages/ProjectCleanero'));
const Project3DHub = lazy(() => import('./pages/Project3DHub'));
const ProjectTravelogue = lazy(() => import('./pages/ProjectTravelogue'));
const ProjectIphoneDock = lazy(() => import('./pages/ProjectIphoneDock'));
const ProjectAtelier = lazy(() => import('./pages/ProjectAtelier'));

function App() {
  useEffect(() => {
    // We append the portfolio.js script dynamically here to initialize
    // the canvases and events after the React component mounts.
    const script = document.createElement('script');
    script.src = '/portfolio.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <Router>
      <CursorCanvas />
      <BackgroundCanvas />
      <HUD />
      <Nav />
      <div className="page">
        <Suspense fallback={<div className="page-loader"></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/3d-printing" element={<ThreeDPrinting />} />
            <Route path="/projects/cleanero" element={<ProjectCleanero />} />
            <Route path="/projects/3d-hub" element={<Project3DHub />} />
            <Route path="/projects/travelogue" element={<ProjectTravelogue />} />
            <Route path="/projects/atelier" element={<ProjectAtelier />} />
            <Route path="/projects/iphone-dock" element={<ProjectIphoneDock />} />
            <Route path="/projects/ev-trip-intelligence" element={<ProjectEV />} />
            <Route path="/projects/ev-trip-screens" element={<ProjectEVScreens />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
