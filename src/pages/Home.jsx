import React from 'react';
import { ArrowRight, Utensils, Users, Building, Truck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="container mt-16 mb-24 flex flex-col md:flex-row items-center gap-12" style={{ minHeight: '70vh' }}>
        <div className="flex-1">
          <div className="badge badge-success mb-6" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}>
            🌟 Joining hands to end hunger
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
            Don’t Waste Food. <br/> <span className="text-gradient">Feed a Life.</span>
          </h1>
          <p className="text-lg text-muted mb-12 max-w-2xl" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            Surplus food from homes, restaurants, events, and hotels can be delivered safely to nearby people in need through NGOs, volunteers, and trusted community partners.
          </p>
          <div className="flex gap-4">
            <button onClick={() => scrollTo('donate')} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Donate Food Now
            </button>
            <button onClick={() => scrollTo('request')} className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Request Food Help
            </button>
          </div>
        </div>
        <div className="flex-1 hidden md:block relative">
          {/* Symmetrical Grid Layout Graphic with Floating Animation */}
          <div className="grid grid-cols-2 gap-8 p-6 relative z-10">
            <div onClick={() => scrollTo('donate')} className="card glass-panel shadow-xl p-8 flex flex-col items-center justify-center transform hover:-translate-y-3 transition duration-300 cursor-pointer animate-float" style={{ borderColor: 'var(--border)' }}>
              <span className="text-6xl mb-6" style={{ fontSize: '4rem' }}>🍽️</span>
              <p className="font-bold text-xl">Donors</p>
            </div>
            <div onClick={() => scrollTo('volunteer-dashboard')} className="card glass-panel shadow-xl p-8 flex flex-col items-center justify-center transform hover:-translate-y-3 transition duration-300 cursor-pointer animate-float delay-100" style={{ borderColor: 'var(--secondary)' }}>
              <Truck size={64} className="text-secondary mb-6" />
              <p className="font-bold text-xl text-secondary">Volunteers</p>
            </div>
            <div onClick={() => scrollTo('ngo-dashboard')} className="card glass-panel shadow-xl p-8 flex flex-col items-center justify-center transform hover:-translate-y-3 transition duration-300 cursor-pointer animate-float delay-200" style={{ borderColor: 'var(--primary)' }}>
              <Building size={64} className="text-primary mb-6" />
              <p className="font-bold text-xl text-primary">NGOs</p>
            </div>
            <div onClick={() => scrollTo('request')} className="card glass-panel shadow-xl p-8 flex flex-col items-center justify-center transform hover:-translate-y-3 transition duration-300 cursor-pointer animate-float delay-300" style={{ borderColor: 'var(--border)' }}>
              <span className="text-6xl mb-6" style={{ fontSize: '4rem' }}>👨‍👩‍👧‍👦</span>
              <p className="font-bold text-xl text-main">Hungry Families</p>
            </div>
          </div>
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-30 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Live Impact Cards */}
      <section className="container mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="card" style={{ padding: '2rem 1rem' }}>
            <div className="w-16 h-16 mx-auto bg-green-100 text-primary rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#d1fae5' }}>
              <Utensils size={28} />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-main">2,480</h3>
            <p className="text-muted font-bold text-sm uppercase tracking-wider">Meals Shared</p>
          </div>
          <div className="card" style={{ padding: '2rem 1rem' }}>
            <div className="w-16 h-16 mx-auto bg-orange-100 text-secondary rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#ffedd5' }}>
              <Users size={28} />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-main">1,120</h3>
            <p className="text-muted font-bold text-sm uppercase tracking-wider">People Fed</p>
          </div>
          <div className="card" style={{ padding: '2rem 1rem' }}>
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
              <Building size={28} />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-main">28</h3>
            <p className="text-muted font-bold text-sm uppercase tracking-wider">Partner NGOs</p>
          </div>
          <div className="card" style={{ padding: '2rem 1rem' }}>
            <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <Truck size={28} />
            </div>
            <h3 className="text-4xl font-bold mb-2 text-main">340</h3>
            <p className="text-muted font-bold text-sm uppercase tracking-wider">Active Volunteers</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mb-24">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* For Donor Flow */}
          <div className="card glass-panel border-2" style={{ padding: '3rem 2rem', borderColor: 'var(--primary)' }}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center text-xl">🤝</span>
              For Donors
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Add food details</h4>
                  <p className="text-muted">Type of food, quantity, and whether it's veg or non-veg.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Choose pickup time</h4>
                  <p className="text-muted">Set when the food will be ready for pickup.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Nearby NGO/Volunteer gets alert</h4>
                  <p className="text-muted">Our smart system pings nearby verified partners instantly.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-primary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Food delivered to needy people</h4>
                  <p className="text-muted">Food reaches the hungry before it spoils.</p>
                </div>
              </div>
            </div>
            <button onClick={() => scrollTo('donate')} className="btn btn-primary mt-8 w-full">Start Donating</button>
          </div>

          {/* For Hungry Person Flow */}
          <div className="card glass-panel border-2" style={{ padding: '3rem 2rem', borderColor: 'var(--secondary)' }}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center text-xl">❤️</span>
              For Hungry Person / Trust
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Request food</h4>
                  <p className="text-muted">Submit an emergency or regular food request.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Add number of people / location</h4>
                  <p className="text-muted">Let us know exactly how many are hungry and where.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">System finds nearby donor</h4>
                  <p className="text-muted">We automatically match you with active donors.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Delivery arranged</h4>
                  <p className="text-muted">A volunteer brings the meals directly to your door.</p>
                </div>
              </div>
            </div>
            <button onClick={() => scrollTo('request')} className="btn btn-secondary mt-8 w-full">Request Food</button>
          </div>
          
        </div>
      </section>

    </div>
  );
};

export default Home;
