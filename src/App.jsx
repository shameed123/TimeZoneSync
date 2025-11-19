import React, { useState, useEffect } from 'react';
import { Plus, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toZonedTime } from 'date-fns-tz';
import Layout from './components/Layout';
import TimeSlider from './components/TimeSlider';
import CityCard from './components/CityCard';
import AddCityModal from './components/AddCityModal';

function App() {
  const [homeTimezone, setHomeTimezone] = useState(() => localStorage.getItem('homeTimezone') || 'America/Chicago');
  const [homeCityName, setHomeCityName] = useState(() => localStorage.getItem('homeCityName') || 'Houston');

  // State for the selected time (minutes from 00:00 in homeTimezone)
  const [baseTime, setBaseTime] = useState(() => {
    const now = new Date();
    const zoned = toZonedTime(now, homeTimezone); // Use the initialized homeTimezone
    return zoned.getHours() * 60 + zoned.getMinutes();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cities from localStorage", e);
      }
    }
    return [
      { name: 'Houston', timezone: 'America/Chicago', region: 'USA' },
      { name: 'New York', timezone: 'America/New_York', region: 'USA' },
      { name: 'London', timezone: 'Europe/London', region: 'UK' },
      { name: 'Tokyo', timezone: 'Asia/Tokyo', region: 'Japan' },
    ];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('homeTimezone', homeTimezone);
    localStorage.setItem('homeCityName', homeCityName);
  }, [homeTimezone, homeCityName]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cities', JSON.stringify(cities));
  }, [cities]);

  // Calculate "local" hour for the background effect
  // We use the baseTime directly since it's now our "Home" time
  const getDisplayHour = () => {
    return Math.floor(baseTime / 60);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAddCity = (city) => {
    if (!cities.find(c => c.name === city.name)) {
      setCities([...cities, city]);
    }
  };

  const handleRemoveCity = (cityName) => {
    setCities(cities.filter(c => c.name !== cityName));
  };

  const handleSetHome = (city) => {
    setHomeTimezone(city.timezone);
    setHomeCityName(city.name);

    // Reset baseTime to current time in new timezone to avoid confusion? 
    // Or keep the relative offset? 
    // Let's reset to "now" in the new timezone for simplicity, or keep the same "absolute" moment?
    // If we keep the same "absolute" moment, we need to convert the old baseTime (which is relative to old home) to new home.
    // For now, let's just snap to "current time" in the new timezone to be safe and simple.
    const now = new Date();
    const zoned = toZonedTime(now, city.timezone);
    setBaseTime(zoned.getHours() * 60 + zoned.getMinutes());
  };

  return (
    <Layout hour={getDisplayHour()} theme={theme}>
      <header style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={toggleTheme}
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            color: 'inherit'
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <h1 className="text-gradient" style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          letterSpacing: '-0.05em'
        }}>
          Time Zone Sync
        </h1>
        <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>
          Base Time: <span style={{ fontWeight: 'bold' }}>{homeCityName}</span>
        </p>
      </header>

      <TimeSlider value={baseTime} onChange={setBaseTime} homeCity={homeCityName} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Active Time Zones</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-panel"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'inherit',
              fontWeight: '500'
            }}
          >
            <Plus size={18} /> Add City
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          <AnimatePresence>
            {cities.map(city => (
              <CityCard
                key={city.name}
                city={city}
                baseTimeMinutes={baseTime}
                homeTimezone={homeTimezone}
                isHome={city.timezone === homeTimezone}
                onSetHome={() => handleSetHome(city)}
                onRemove={() => handleRemoveCity(city.name)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AddCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCity}
        theme={theme}
      />
    </Layout>
  );
}

export default App;
