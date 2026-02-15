import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CloudSun, Thermometer, Droplets, Wind, Sun, MapPin, Zap, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import api from '../api/axios';
import toast from 'react-hot-toast';

const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌧️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️',
};

export default function WeatherSolar() {
    const [data, setData] = useState(null);
    const [cities, setCities] = useState({});
    const [selectedCity, setSelectedCity] = useState('Mumbai');
    const [systemSize, setSystemSize] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/weather/cities').then(res => setCities(res.data.data)).catch(() => { });
    }, []);

    useEffect(() => { fetchWeather(); }, [selectedCity]);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const coords = cities[selectedCity] || { lat: 19.076, lon: 72.877 };
            const res = await api.get('/weather/solar', { params: { lat: coords.lat, lon: coords.lon } });
            setData(res.data.data);
        } catch { toast.error('Weather data unavailable'); }
        finally { setLoading(false); }
    };

    const dailyGeneration = data?.daily?.map(d => ({
        date: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }),
        kWh: Math.round(d.estimatedKwhPerKw * systemSize * 10) / 10,
        sunshine: d.sunshineHours,
        efficiency: d.efficiencyFactor,
        temp: d.tempMax,
        icon: weatherIcons[d.weatherCode] || '☀️',
    })) || [];

    const weeklyTotal = dailyGeneration.reduce((s, d) => s + d.kWh, 0);
    const avgDaily = dailyGeneration.length ? weeklyTotal / dailyGeneration.length : 0;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <CloudSun className="w-6 h-6 text-amber-500" /> Solar Weather Forecast
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>7-day solar energy production forecast</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                            className="px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {Object.keys(cities).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <input type="number" min="1" max="100" value={systemSize}
                            onChange={e => setSystemSize(Number(e.target.value) || 1)}
                            className="w-16 px-2 py-2 rounded-xl text-sm text-center outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>kW</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading weather data...</div>
            ) : data && (
                <>
                    {/* Current Conditions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: 'Temperature', value: `${data.current?.temperature}°C`, icon: Thermometer, color: '#f59e0b' },
                            { label: 'Humidity', value: `${data.current?.humidity}%`, icon: Droplets, color: '#3b82f6' },
                            { label: 'Cloud Cover', value: `${data.current?.cloudCover}%`, icon: CloudSun, color: '#8b5cf6' },
                            { label: 'Wind Speed', value: `${data.current?.windSpeed} km/h`, icon: Wind, color: '#06b6d4' },
                        ].map(s => (
                            <Card key={s.label} className="!p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                                </div>
                                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Weekly Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <Card className="!p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Weekly Estimate</span>
                            </div>
                            <p className="text-2xl font-bold text-emerald-500">{weeklyTotal.toFixed(1)} kWh</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Savings: ₹{Math.round(weeklyTotal * 8).toLocaleString()}</p>
                        </Card>
                        <Card className="!p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Efficiency</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: data.avgEfficiency >= 80 ? '#10b981' : data.avgEfficiency >= 60 ? '#f59e0b' : '#ef4444' }}>
                                {data.avgEfficiency}%
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.recommendation}</p>
                        </Card>
                        <Card className="!p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Daily Average</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-500">{avgDaily.toFixed(1)} kWh</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>For {systemSize} kW system</p>
                        </Card>
                    </div>

                    {/* 7-day forecast cards */}
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {dailyGeneration.map((d, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{d.date}</p>
                                <p className="text-2xl mb-1">{d.icon}</p>
                                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{d.temp}°</p>
                                <p className="text-xs text-emerald-500 font-semibold">{d.kWh} kWh</p>
                                <div className="h-1 rounded-full mt-2" style={{ background: 'var(--bg-secondary)' }}>
                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${d.efficiency}%` }}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Estimated Daily Generation</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={dailyGeneration}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                                    <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `${v}kWh`} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                                    <Bar dataKey="kWh" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card>
                            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Sunshine Hours</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={dailyGeneration}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                                    <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `${v}h`} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                                    <Area type="monotone" dataKey="sunshine" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
