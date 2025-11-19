import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus } from 'lucide-react';

const POPULAR_CITIES = [
    { name: 'New York', timezone: 'America/New_York', region: 'USA' },
    { name: 'London', timezone: 'Europe/London', region: 'UK' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', region: 'Japan' },
    { name: 'Sydney', timezone: 'Australia/Sydney', region: 'Australia' },
    { name: 'San Francisco', timezone: 'America/Los_Angeles', region: 'USA' },
    { name: 'Dubai', timezone: 'Asia/Dubai', region: 'UAE' },
    { name: 'Singapore', timezone: 'Asia/Singapore', region: 'Singapore' },
    { name: 'Paris', timezone: 'Europe/Paris', region: 'France' },
    { name: 'Berlin', timezone: 'Europe/Berlin', region: 'Germany' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', region: 'India' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', region: 'China' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', region: 'China' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', region: 'USA' },
    { name: 'Chicago', timezone: 'America/Chicago', region: 'USA' },
    { name: 'Toronto', timezone: 'America/Toronto', region: 'Canada' },
    { name: 'Vancouver', timezone: 'America/Vancouver', region: 'Canada' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', region: 'Brazil' },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', region: 'Argentina' },
    { name: 'Cairo', timezone: 'Africa/Cairo', region: 'Egypt' },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg', region: 'South Africa' },
    { name: 'Lagos', timezone: 'Africa/Lagos', region: 'Nigeria' },
    { name: 'Moscow', timezone: 'Europe/Moscow', region: 'Russia' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', region: 'Turkey' },
    { name: 'Seoul', timezone: 'Asia/Seoul', region: 'South Korea' },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', region: 'Thailand' },
    { name: 'Jakarta', timezone: 'Asia/Jakarta', region: 'Indonesia' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', region: 'Mexico' },
    { name: 'Lima', timezone: 'America/Lima', region: 'Peru' },
    { name: 'Bogotá', timezone: 'America/Bogota', region: 'Colombia' },
    { name: 'Santiago', timezone: 'America/Santiago', region: 'Chile' },
    { name: 'Riyadh', timezone: 'Asia/Riyadh', region: 'Saudi Arabia' },
    { name: 'Tel Aviv', timezone: 'Asia/Jerusalem', region: 'Israel' },
    { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', region: 'Malaysia' },
    { name: 'Manila', timezone: 'Asia/Manila', region: 'Philippines' },
    { name: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', region: 'Vietnam' },
];

const AddCityModal = ({ isOpen, onClose, onAdd, theme }) => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'custom'

    // Search State
    const [onlineResults, setOnlineResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Custom Form State
    const [customName, setCustomName] = useState('');
    const [customTimezone, setCustomTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const filteredCities = POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const searchOnline = async () => {
        if (!search.trim()) return;
        setIsSearching(true);
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=10&language=en&format=json`);
            const data = await response.json();

            if (data.results) {
                const formatted = data.results.map(item => {
                    const parts = [];
                    if (item.admin1) parts.push(item.admin1);
                    if (item.country) parts.push(item.country);
                    const displayRegion = parts.join(', ') || 'Unknown Region';
                    const cardRegion = item.country || 'Unknown Region';

                    return {
                        name: item.name,
                        timezone: item.timezone,
                        region: cardRegion,
                        displayRegion: displayRegion,
                        isOnline: true
                    };
                }).filter(item => item.timezone);
                setOnlineResults(formatted);
            } else {
                setOnlineResults([]);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddCustom = () => {
        if (customName && customTimezone) {
            onAdd({ name: customName, timezone: customTimezone, region: 'Custom' });
            onClose();
            setCustomName('');
        }
    };

    const isLight = theme === 'light';
    const bgColor = isLight ? 'rgba(255, 255, 255, 0.95)' : '#1e293b';
    const textColor = isLight ? '#1e293b' : '#fff';
    const inputBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    const itemHoverBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    const borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

    // Get all timezones
    const allTimezones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
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
                            zIndex: 50
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-panel"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '500px',
                            background: bgColor,
                            color: textColor,
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            zIndex: 51,
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Add City</h2>
                            <button onClick={onClose}><X /></button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: `1px solid ${borderColor}` }}>
                            <button
                                onClick={() => setActiveTab('search')}
                                style={{
                                    padding: '0.5rem 0',
                                    borderBottom: activeTab === 'search' ? `2px solid ${theme === 'light' ? '#6366f1' : '#fff'}` : 'none',
                                    fontWeight: activeTab === 'search' ? 'bold' : 'normal',
                                    color: textColor,
                                    opacity: activeTab === 'search' ? 1 : 0.6
                                }}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                style={{
                                    padding: '0.5rem 0',
                                    borderBottom: activeTab === 'custom' ? `2px solid ${theme === 'light' ? '#6366f1' : '#fff'}` : 'none',
                                    fontWeight: activeTab === 'custom' ? 'bold' : 'normal',
                                    color: textColor,
                                    opacity: activeTab === 'custom' ? 1 : 0.6
                                }}
                            >
                                Custom
                            </button>
                        </div>

                        {activeTab === 'search' ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: inputBg,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem'
                                }}>
                                    <Search size={20} style={{ opacity: 0.5, marginRight: '0.5rem' }} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search city..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && searchOnline()}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: textColor,
                                            width: '100%',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {search && (
                                        <button
                                            onClick={searchOnline}
                                            style={{
                                                fontSize: '0.8rem',
                                                background: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.2)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '0.5rem',
                                                marginLeft: '0.5rem'
                                            }}
                                        >
                                            Web
                                        </button>
                                    )}
                                </div>

                                <div style={{ overflowY: 'auto', flex: 1 }}>
                                    {/* Local Results */}
                                    {filteredCities.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Popular Cities</h3>
                                            {filteredCities.map(city => (
                                                <button
                                                    key={city.name}
                                                    onClick={() => { onAdd(city); onClose(); setSearch(''); }}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                                                        marginBottom: '0.5rem', background: 'transparent', color: textColor,
                                                        textAlign: 'left'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = itemHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <span>{city.name}</span>
                                                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{city.region}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Online Results */}
                                    {isSearching && <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.7 }}>Searching global database...</div>}

                                    {onlineResults.length > 0 && (
                                        <div>
                                            <h3 style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Online Results</h3>
                                            {onlineResults.map((city, idx) => (
                                                <button
                                                    key={`${city.name}-${idx}`}
                                                    onClick={() => { onAdd(city); onClose(); setSearch(''); setOnlineResults([]); }}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                                                        marginBottom: '0.5rem', background: 'transparent', color: textColor,
                                                        textAlign: 'left'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = itemHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <span>{city.name}</span>
                                                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{city.displayRegion} ({city.timezone})</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {filteredCities.length === 0 && onlineResults.length === 0 && !isSearching && search && (
                                        <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>
                                            No cities found. Try clicking "Web" to search online.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>City Name</label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={e => setCustomName(e.target.value)}
                                        placeholder="e.g. My Home Base"
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${borderColor}`, background: inputBg, color: textColor, outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Timezone</label>
                                    <select
                                        value={customTimezone}
                                        onChange={e => setCustomTimezone(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${borderColor}`, background: inputBg, color: textColor, outline: 'none'
                                        }}
                                    >
                                        {allTimezones.map(tz => (
                                            <option key={tz} value={tz} style={{ background: isLight ? '#fff' : '#1e293b' }}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleAddCustom}
                                    disabled={!customName || !customTimezone}
                                    style={{
                                        marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                        background: 'var(--primary)', color: '#fff', fontWeight: 'bold',
                                        opacity: (!customName || !customTimezone) ? 0.5 : 1
                                    }}
                                >
                                    Add Custom City
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddCityModal;
