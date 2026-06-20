import React from 'react';
import { activeDonations } from '../services/mockData';
import { MapPin, Clock, Package, Star, Award, CheckCircle, XCircle, Map } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="container mt-12 mb-20">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold">Volunteer Dashboard</h2>
          <p className="text-muted">Rescue meals, earn points, climb the leaderboard.</p>
        </div>
        <div className="badge flex items-center" style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0.5rem 1rem', fontSize: '1rem' }}>
          <Star size={18} className="mr-1" fill="#854d0e"/> 4.9 Super Volunteer
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Active Pickups */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-secondary"/> Nearby Pickup Tasks</h3>
          <div className="flex flex-col gap-6">
            {activeDonations.map(donation => (
              <div key={donation.id} className="card flex flex-col md:flex-row justify-between gap-4 border-2" style={{ borderColor: donation.status === 'Claimed' ? 'var(--primary)' : 'var(--border)' }}>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold">{donation.donor}</h4>
                    <span className="badge bg-gray-100 text-gray-700 text-xs">2.5 km away</span>
                  </div>
                  <p className="text-muted text-sm flex items-center gap-2 mt-1">
                    <Package size={14}/> {donation.type} ({donation.quantity})
                  </p>
                  <p className="text-muted text-sm flex items-center gap-2 mt-1">
                    <MapPin size={14}/> {donation.location}
                  </p>
                  <p className="text-muted text-sm flex items-center gap-2 mt-1">
                    <Clock size={14}/> Posted: {donation.timePosted}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 items-end justify-center w-full md:w-auto border-t md:border-t-0 md:border-l pl-0 md:pl-4 pt-4 md:pt-0">
                  {donation.status !== 'Claimed' ? (
                    <>
                      <button className="btn btn-primary text-sm w-full flex items-center justify-center gap-1"><CheckCircle size={16}/> Accept Task</button>
                      <button className="btn btn-outline text-sm w-full flex items-center justify-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-600"><XCircle size={16}/> Reject</button>
                    </>
                  ) : (
                    <>
                      <span className="badge badge-success mb-2 w-full text-center">Claimed by You</span>
                      <button className="btn btn-secondary text-sm w-full flex items-center justify-center gap-1"><Map size={16}/> Start Navigation</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats & Gamification */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-primary"/> Your Impact</h3>
          
          <div className="card text-center mb-6 flex flex-col items-center shadow-lg border-2 border-primary">
            <Award size={56} className="text-primary mb-2" />
            <h4 className="text-5xl font-bold text-main mb-1">1,250</h4>
            <p className="text-primary font-bold tracking-widest uppercase text-sm">Impact Points</p>
            <p className="text-sm text-muted mt-4 bg-gray-100 px-3 py-1 rounded-full">Rank: <strong>Gold Tier</strong></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center p-4 bg-surface shadow-sm">
              <h4 className="text-3xl font-bold text-secondary">14</h4>
              <p className="text-xs text-muted uppercase font-bold tracking-wide mt-1">Deliveries</p>
            </div>
            <div className="card text-center p-4 bg-surface shadow-sm">
              <h4 className="text-3xl font-bold text-primary">320kg</h4>
              <p className="text-xs text-muted uppercase font-bold tracking-wide mt-1">Transported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
