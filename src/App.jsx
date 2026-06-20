import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonationForm from './pages/DonationForm';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import HungerHeatmap from './pages/HungerHeatmap';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div id="home"><Home /></div>
        <div className="section-divider"></div>
        <div id="donate"><DonationForm /></div>
        <div className="section-divider"></div>
        <div id="request"><Emergency /></div>
        <div className="section-divider"></div>
        <div id="ngo-dashboard"><NGODashboard /></div>
        <div className="section-divider"></div>
        <div id="volunteer-dashboard"><Dashboard /></div>
        <div className="section-divider"></div>
        <div id="heatmap"><HungerHeatmap /></div>
        <div className="section-divider"></div>
        <div id="admin-dashboard"><AdminDashboard /></div>
      </main>
    </div>
  );
}

export default App;
