import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Leaf, IndianRupee, TreePine, Calculator } from 'lucide-react';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';

export default function SolarCalculator() {
    const [size, setSize] = useState(5);
    const [rate, setRate] = useState(8);
    const [city, setCity] = useState('Mumbai');

    const sunHours = { Mumbai: 5.2, Delhi: 5.5, Bangalore: 5.8, Chennai: 5.6, Kolkata: 4.9, Pune: 5.4, Hyderabad: 5.7, Ahmedabad: 5.9, Jaipur: 6.0, Lucknow: 5.1 };
    const hours = sunHours[city] || 5.5;
    const dailyGen = size * hours;
    const annualGen = Math.round(dailyGen * 365);
    const monthlySavings = Math.round((annualGen / 12) * rate);
    const annualSavings = Math.round(annualGen * rate);
    const estCost = size * 60000;
    const payback = Math.round((estCost / annualSavings) * 10) / 10;
    const roi25 = Math.round(((annualSavings * 25 - estCost) / estCost) * 100);
    const co2 = Math.round(annualGen * 0.82);
    const trees = Math.round(co2 / 21);

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Solar Calculator</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Estimate generation, savings, ROI, and environmental impact</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Calculator className="w-4 h-4 text-emerald-500" /> Configuration
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>System Size</label>
                            <input type="range" min="1" max="100" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-emerald-500" />
                            <div className="text-center text-xl font-bold text-emerald-500 mt-1">{size} kW</div>
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Electricity Rate (₹/kWh)</label>
                            <input type="range" min="4" max="16" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-amber-500" />
                            <div className="text-center text-lg font-bold text-amber-500 mt-1">₹{rate}/kWh</div>
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>City</label>
                            <select value={city} onChange={e => setCity(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                {Object.keys(sunHours).map(c => <option key={c} value={c}>{c} ({sunHours[c]}h/day)</option>)}
                            </select>
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard title="Daily Generation" value={`${dailyGen.toFixed(1)} kWh`} icon={Sun} color="amber" />
                        <StatCard title="Annual Generation" value={`${(annualGen / 1000).toFixed(1)} MWh`} icon={Zap} color="emerald" />
                        <StatCard title="Monthly Savings" value={`₹${monthlySavings.toLocaleString()}`} icon={IndianRupee} color="blue" />
                        <StatCard title="CO₂ Offset/Year" value={`${(co2 / 1000).toFixed(1)} tons`} icon={Leaf} color="emerald" />
                    </div>

                    <Card>
                        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Financial Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Estimated Cost', value: `₹${(estCost / 100000).toFixed(1)}L`, sub: `₹${(estCost / size / 1000).toFixed(0)}/Wp` },
                                { label: 'Annual Savings', value: `₹${(annualSavings / 1000).toFixed(0)}K`, sub: `₹${monthlySavings.toLocaleString()}/month` },
                                { label: 'Payback Period', value: `${payback} years`, sub: `ROI after payback: ${roi25}%` },
                                { label: '25-Year Savings', value: `₹${((annualSavings * 25) / 100000).toFixed(1)}L`, sub: `Net profit: ₹${((annualSavings * 25 - estCost) / 100000).toFixed(1)}L` },
                            ].map(item => (
                                <div key={item.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                                    <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <TreePine className="w-4 h-4 text-emerald-500" /> Environmental Impact
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                                <p className="text-2xl font-bold text-emerald-500">{(co2 / 1000).toFixed(1)}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tons CO₂ saved/year</p>
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                                <p className="text-2xl font-bold text-emerald-500">{trees}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Trees equivalent</p>
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                                <p className="text-2xl font-bold text-emerald-500">{(co2 * 25 / 1000).toFixed(0)}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tons CO₂ in 25 years</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
