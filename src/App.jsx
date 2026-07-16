import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonationForm from './pages/DonationForm';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import HungerHeatmap from './pages/HungerHeatmap';
import DonorDashboard from './pages/DonorDashboard';
import CityAdminConsole from './pages/CityAdminConsole';
import NGODashboard from './pages/NGODashboard';
import EducationModule from './pages/EducationModule';
import ClothesModule from './pages/ClothesModule';
import VolunteersManagement from './pages/VolunteersManagement';
import Footer from './components/Footer';

const LandingPage = () => (
  <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '80px' }}>
    <div id="home" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><Home /></div>
    <div id="donate" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><DonationForm /></div>
    <div id="request" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><Emergency /></div>
    <div id="heatmap" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(248, 250, 252, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><HungerHeatmap /></div>
    <div id="education" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><EducationModule /></div>
    <div id="clothes" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><ClothesModule /></div>
    <div id="volunteers" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><VolunteersManagement /></div>
    <div id="ngo" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', margin: '0 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)' }}><NGODashboard /></div>
  </main>
);

const PageLayout = ({ children }) => (
  <main style={{ flex: 1, padding: '40px', background: '#F8FAFC' }}>
    {children}
  </main>
);

function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donor" element={<PageLayout><DonorDashboard /></PageLayout>} />
        <Route path="/volunteer" element={<PageLayout><Dashboard /></PageLayout>} />
        <Route path="/admin" element={<PageLayout><AdminDashboard /></PageLayout>} />
        <Route path="/city-admin" element={<PageLayout><CityAdminConsole /></PageLayout>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

