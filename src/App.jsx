import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonationForm from './pages/DonationForm';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import HungerHeatmap from './pages/HungerHeatmap';
import DonorDashboard from './pages/DonorDashboard';
import CityAdminConsole from './pages/CityAdminConsole';
import Footer from './components/Footer';

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (route === '/admin') {
    return <CityAdminConsole />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
        {/* Each section is min-height:100vh — fills the viewport */}
        <div id="home" style={{ minHeight: '100vh' }}><Home /></div>
        <div id="donate" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><DonationForm /></div>
        <div id="donor-dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0f172a' }}><DonorDashboard /></div>
        <div id="request" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Emergency /></div>
        <div id="volunteer-dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Dashboard /></div>
        <div id="heatmap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--cream)' }}><HungerHeatmap /></div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

