import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const TimeSlider = ({ value, onChange, homeCity }) => {
    // Value is 0-1439 (minutes in a day)

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    return (
        <div className="glass-panel" style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            borderColor: 'rgba(255,255,255,0.2)'
        }}>
            <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                    fontSize: '0.9rem',
                    opacity: 0.8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>Home Time</span>
                    <span style={{ width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{homeCity}</span>
                </div>
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {formatTime(value)}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <Sun size={24} />
                    <input
                        type="range"
                        min="0"
                        max="1439"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: 'var(--primary)'
                        }}
                        step="5"
                    />
                    <Moon size={24} />
                </div>
                <p style={{ opacity: 0.8 }}>Drag to adjust home time</p>
            </div>
        </div>
    );
};

export default TimeSlider;
