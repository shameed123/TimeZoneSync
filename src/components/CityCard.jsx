import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { X, Home } from 'lucide-react';

const CityCard = ({ city, baseTimeMinutes, homeTimezone, onRemove, isHome, onSetHome }) => {
    // city object: { name, timezone, region }
    // baseTimeMinutes: 0-1439 (Time in homeTimezone)

    // 1. Create a date object for "today" at the specified baseTimeMinutes in the HOME timezone
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const homeHours = Math.floor(baseTimeMinutes / 60);
    const homeMinutes = baseTimeMinutes % 60;

    // Correct approach with date-fns-tz:
    // Create a Date object that represents the absolute instant.
    // We know the "wall clock" time in Home Timezone.
    // We want to find the UTC timestamp that corresponds to that wall clock time.
    const wallClockDate = new Date(year, month, day, homeHours, homeMinutes);
    const utcDate = fromZonedTime(wallClockDate, homeTimezone);

    // 2. Convert that UTC timestamp to the target city's timezone
    const zonedDate = toZonedTime(utcDate, city.timezone);
    const hours = zonedDate.getHours();
    const isBusinessHours = hours >= 9 && hours < 17;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-panel"
            style={{
                height: '100%',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                background: isBusinessHours ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                border: isHome ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                overflow: 'hidden' // Ensure the top line doesn't overflow if we used a simple rect
            }}
        >
            {isHome && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#6366f1',
                }} />
            )}
            <div>
                <div className="city-header">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{city.name}</h3>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '1rem',
                        background: 'rgba(255,255,255,0.2)'
                    }}>
                        {city.region}
                    </span>

                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isBusinessHours ? '#4ade80' : '#94a3b8'
                    }} />
                    <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                        {isBusinessHours ? 'Business Hours' : 'Off Hours'}
                    </span>
                </div>

                {!isHome && (
                    <button
                        onClick={onSetHome}
                        style={{
                            marginTop: '0.75rem',
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '0.5rem',
                            background: 'var(--primary)',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#fff',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s, background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.background = 'var(--primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.background = 'var(--primary)';
                        }}
                    >
                        Make Home
                    </button>
                )}
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {format(zonedDate, 'h:mm a')}
                </div>
                <div style={{ opacity: 0.7 }}>
                    {format(zonedDate, 'EEE, MMM d')}
                </div>
            </div>

            <button
                onClick={onRemove}
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    opacity: 0.5,
                    padding: '0.25rem'
                }}
                className="hover:opacity-100"
                title="Remove city"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default CityCard;
