import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

// Components
import Nav from './components/Nav';
import HUD from './components/HUD';
import BackgroundCanvas from './components/BackgroundCanvas';
import CursorCanvas from './components/CursorCanvas';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ThreeDPrinting from './pages/ThreeDPrinting';
import Contact from './pages/Contact';
import ProjectEV from './pages/ProjectEV';
import ProjectEVScreens from './pages/ProjectEVScreens';
import ProjectCleanero from './pages/ProjectCleanero';
import Project3DHub from './pages/Project3DHub';
import ProjectTravelogue from './pages/ProjectTravelogue';
import ProjectIphoneDock from './pages/ProjectIphoneDock';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/3d-printing" element={<ThreeDPrinting />} />
          <Route path="/projects/cleanero" element={<ProjectCleanero />} />
          <Route path="/projects/3d-hub" element={<Project3DHub />} />
          <Route path="/projects/travelogue" element={<ProjectTravelogue />} />
          <Route path="/projects/iphone-dock" element={<ProjectIphoneDock />} />
          <Route path="/projects/ev-trip-intelligence" element={<ProjectEV />} />
          <Route path="/projects/ev-trip-screens" element={<ProjectEVScreens />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
