import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children, hour, theme }) => {
  // Determine if it's day or night based on the hour (6am to 6pm is day)
  // If theme is provided, it overrides the time-based logic
  const isDay = theme ? theme === 'light' : (hour >= 6 && hour < 18);

  // Calculate gradient colors based on hour for a smooth transition
  const getBackground = () => {
    if (theme === 'light') return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'; // Fixed Day
    if (theme === 'dark') return 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)'; // Fixed Night

    // Fallback to dynamic if no theme is forced (though we are forcing it now)
    if (hour >= 5 && hour < 8) return 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)';
    if (hour >= 8 && hour < 16) return 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
    if (hour >= 16 && hour < 19) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
    return 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)';
  };

  return (
    <motion.div
      className={`layout theme-${theme}`}
      animate={{
        background: getBackground(),
      }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        color: isDay ? 'var(--text-day)' : 'var(--text-night)',
        padding: '2rem 0'
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: `${20 + i * 30}%`,
              left: `${10 + i * 40}%`,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: theme === 'light'
                ? 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(255,255,255,0) 70%)'
                : 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Layout;
