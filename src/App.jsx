import React, { useState, useEffect } from 'react';
import { Plus, Sun, Moon, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toZonedTime } from 'date-fns-tz';
import Layout from './components/Layout';
import TimeSlider from './components/TimeSlider';
import CityCard from './components/CityCard';
import AddCityModal from './components/AddCityModal';
import HelpModal from './components/HelpModal';

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout hour={getDisplayHour()} theme={theme}>
      <header style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
        <div className="header-controls">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsHelpOpen(true)}
            className="glass-panel"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.2)',
              color: 'inherit'
            }}
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="glass-panel"
            style={{
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
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <img
              src="/images/android-chrome-192x192.png"
              alt="Logo"
              style={{ width: '120px', height: '120px', borderRadius: '15px' }}
            />
            <h1 className="text-gradient" style={{
              fontSize: '3rem',
              fontWeight: '800',
              letterSpacing: '-0.05em',
              margin: 0
            }}>
              Time Zone Sync
            </h1>
          </div>
          <p style={{ opacity: 0.8, fontSize: '1.3rem' }}>
            Welcome to Time Zone Sync! This tool helps you coordinate times across different time zones effortlessly for your meetings.
          </p>
          <p style={{ opacity: 0.8, fontSize: '1.5rem' }}>
            &nbsp;
          </p>

          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>
            Home Time: <span style={{ fontWeight: 'bold' }}>{homeCityName}</span>
          </p>
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TimeSlider value={baseTime} onChange={setBaseTime} homeCity={homeCityName} />
      </motion.div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Active Time Zones</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          <AnimatePresence mode='popLayout'>
            {cities.map(city => (
              <motion.div key={city.name} variants={itemVariants} layout style={{ height: '100%' }}>
                <CityCard
                  city={city}
                  baseTimeMinutes={baseTime}
                  homeTimezone={homeTimezone}
                  isHome={city.timezone === homeTimezone}
                  onSetHome={() => handleSetHome(city)}
                  onRemove={() => handleRemoveCity(city.name)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AddCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCity}
        theme={theme}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        theme={theme}
      />
    </Layout>
  );
}

export default App;
