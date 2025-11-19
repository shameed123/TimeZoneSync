import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, MapPin, Clock, Sliders, Trash2, Sun, Moon } from 'lucide-react';

const HelpModal = ({ isOpen, onClose, theme }) => {
    const isLight = theme === 'light';
    const bgColor = isLight ? 'rgba(255, 255, 255, 0.95)' : '#1e293b';
    const textColor = isLight ? '#1e293b' : '#fff';
    const sectionBg = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)';

    const features = [
        {
            icon: <MapPin size={20} className="text-blue-500" />,
            title: "Adding Cities",
            description: "Click 'Add City' to open the selection modal. You can use the 'Search' tab to find any city worldwide using our online database, or select from a list of popular major cities. Alternatively, switch to the 'Custom' tab to manually create a location with a custom name (like 'Remote Office') and a specific timezone."
        },
        {
            icon: <Clock size={20} className="text-green-500" />,
            title: "Setting Home City",
            description: "Click the 'Make Home' button on any city card to set it as your primary reference. All time calculations will be relative to this city."
        },
        {
            icon: <Sliders size={20} className="text-purple-500" />,
            title: "Time Travel",
            description: "Drag the slider at the top to change the time in your home city. Watch as all other cities update instantly to show their corresponding local times."
        },
        {
            icon: <Trash2 size={20} className="text-red-500" />,
            title: "Removing Cities",
            description: "Click the 'X' icon in the top-right corner of any city card to remove it from your dashboard."
        },
        {
            icon: isLight ? <Moon size={20} /> : <Sun size={20} />,
            title: "Theme Toggle",
            description: "Toggle between Light and Dark modes using the icon in the top-right corner of the screen."
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{
                            width: '90%',
                            maxWidth: '600px',
                            background: bgColor,
                            color: textColor,
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)',
                                    color: '#6366f1'
                                }}>
                                    <HelpCircle size={24} />
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>How to Use</h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                            <p style={{ marginBottom: '1.5rem', opacity: 0.8, lineHeight: '1.6' }}>
                                Welcome to Time Zone Sync! This tool helps you coordinate times across different time zones effortlessly. Here's a quick guide to get you started:
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {features.map((feature, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: sectionBg,
                                        borderRadius: 'var(--radius-md)',
                                        alignItems: 'flex-start'
                                    }}>
                                        <div style={{ marginTop: '0.2rem' }}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{feature.title}</h3>
                                            <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.5' }}>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, paddingTop: '1rem' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '2rem',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HelpModal;
