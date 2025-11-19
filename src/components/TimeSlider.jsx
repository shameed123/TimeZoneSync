import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Edit2, Check, X } from 'lucide-react';

const TimeSlider = ({ value, onChange, homeCity }) => {
    // Value is 0-1439 (minutes in a day)
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const formatTimeInput = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const handleEditStart = () => {
        setEditValue(formatTimeInput(value));
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditValue('');
    };

    const handleEditSave = () => {
        const [hours, minutes] = editValue.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            const totalMinutes = hours * 60 + minutes;
            if (totalMinutes >= 0 && totalMinutes <= 1439) {
                onChange(totalMinutes);
            }
        }
        setIsEditing(false);
        setEditValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEditSave();
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    return (
        <div className="glass-panel" style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            borderColor: 'rgba(255,255,255,0.2)',
            position: 'relative'
        }}>
            {/* Edit button in top right corner */}
            {!isEditing && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEditStart}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: 0.7
                    }}
                >
                    <Edit2 size={20} />
                </motion.button>
            )}

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

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    {isEditing ? (
                        <>
                            <input
                                type="time"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                style={{
                                    fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                                    fontWeight: 'bold',
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '2px solid var(--primary)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'inherit',
                                    fontFamily: 'inherit',
                                    width: 'auto',
                                    maxWidth: '100%'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleEditSave}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                            >
                                <Check size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleEditCancel}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                            >
                                <X size={20} />
                            </motion.button>
                        </>
                    ) : (
                        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                            {formatTime(value)}
                        </h2>
                    )}
                </div>

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
                <p style={{ opacity: 0.8 }}>Drag slider or click edit to adjust time</p>
            </div>
        </div>
    );
};

export default TimeSlider;
