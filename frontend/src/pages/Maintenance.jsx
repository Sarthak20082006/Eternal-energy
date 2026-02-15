import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, Battery, Sun, Shield, Zap, AlertTriangle, CheckCircle, Clock, DollarSign, Leaf } from 'lucide-react';
import Card from '../components/ui/Card';

const maintenanceTasks = [
    { task: 'Panel Cleaning', frequency: 'Monthly', priority: 'high', icon: Sun, description: 'Clean panels with soft cloth and water to remove dust, bird droppings, and debris', diy: true, cost: 500 },
    { task: 'Inverter Check', frequency: 'Quarterly', priority: 'high', icon: Zap, description: 'Check LED indicators, fan noise, error logs, and firmware updates', diy: false, cost: 1500 },
    { task: 'Wiring Inspection', frequency: 'Semi-annual', priority: 'medium', icon: AlertTriangle, description: 'Inspect all cable connections, junction boxes, and conduit for damage or corrosion', diy: false, cost: 2000 },
    { task: 'Structure Check', frequency: 'Annual', priority: 'medium', icon: Shield, description: 'Check mounting bolts, frame alignment, rust, and structural integrity', diy: false, cost: 2500 },
    { task: 'Performance Audit', frequency: 'Annual', priority: 'low', icon: CheckCircle, description: 'Compare actual vs expected output, check shade patterns, degradation analysis', diy: false, cost: 3000 },
    { task: 'Earth Resistance Test', frequency: 'Annual', priority: 'high', icon: Zap, description: 'Test earthing system resistance — must be below 5 ohms for safety', diy: false, cost: 1500 },
];

const batteries = [
    { name: 'Luminous LPTT 12150H', type: 'Lead Acid (Tall Tubular)', capacity: '150 Ah', voltage: '12V', warranty: '60 months', price: 14500, cycles: 1200, bestFor: 'Budget-friendly backup', rating: 3.5 },
    { name: 'Exide Inva Master IMTT1500', type: 'Lead Acid (Tall Tubular)', capacity: '150 Ah', voltage: '12V', warranty: '54 months', price: 13800, cycles: 1100, bestFor: 'Reliable daily cycling', rating: 3.5 },
    { name: 'Amaron Current CR150TT', type: 'Lead Acid (Tall Tubular)', capacity: '150 Ah', voltage: '12V', warranty: '48 months', price: 12500, cycles: 1000, bestFor: 'Value for money', rating: 3.0 },
    { name: 'Tesla Powerwall 2', type: 'Lithium-ion (NMC)', capacity: '13.5 kWh', voltage: '48V', warranty: '10 years', price: 850000, cycles: 5000, bestFor: 'Premium whole-home backup', rating: 5.0 },
    { name: 'BYD Battery-Box HVS', type: 'Lithium Iron Phosphate', capacity: '5.1-12.8 kWh', voltage: '48V', warranty: '10 years', price: 350000, cycles: 6000, bestFor: 'Modular, scalable storage', rating: 4.5 },
    { name: 'Okaya OPJT 18048', type: 'Lead Acid (Tubular)', capacity: '180 Ah', voltage: '48V', warranty: '60 months', price: 65000, cycles: 1500, bestFor: 'Large home with frequent outages', rating: 4.0 },
];

const priorityColors = { high: { bg: '#ef444420', text: '#ef4444' }, medium: { bg: '#f59e0b20', text: '#f59e0b' }, low: { bg: '#10b98120', text: '#10b981' } };
const ratingStars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));

export default function Maintenance() {
    const [tab, setTab] = useState('maintenance');
    const [systemSize, setSystemSize] = useState(5);
    const [avgOutageHours, setAvgOutageHours] = useState(4);

    // Battery recommendation logic
    const dailyConsumption = systemSize * 4; // kWh approx
    const requiredCapacity = dailyConsumption * (avgOutageHours / 24);
    const recommendedBatteries = batteries.map(b => {
        const capKwh = typeof b.capacity === 'string' && b.capacity.includes('kWh')
            ? parseFloat(b.capacity) : (parseFloat(b.capacity) * parseInt(b.voltage) / 1000);
        const suitability = capKwh >= requiredCapacity ? 'excellent' : capKwh >= requiredCapacity * 0.7 ? 'good' : 'undersized';
        return { ...b, capKwh: Math.round(capKwh * 10) / 10, suitability };
    }).sort((a, b) => {
        const order = { excellent: 0, good: 1, undersized: 2 };
        return order[a.suitability] - order[b.suitability];
    });

    const annualMaintenanceCost = maintenanceTasks.reduce((s, t) => {
        const multiplier = t.frequency === 'Monthly' ? 12 : t.frequency === 'Quarterly' ? 4 : t.frequency === 'Semi-annual' ? 2 : 1;
        return s + t.cost * multiplier;
    }, 0);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Maintenance & Storage</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Maintenance schedules and battery storage recommendations</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                {[
                    { id: 'maintenance', label: 'Maintenance Schedule', icon: Wrench },
                    { id: 'battery', label: 'Battery Storage', icon: Battery },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all"
                        style={{
                            background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                            color: tab === t.id ? '#10b981' : 'var(--text-muted)',
                            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {/* Maintenance Tab */}
            {tab === 'maintenance' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="mb-4 !p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Estimated Annual Maintenance Cost</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>For a {systemSize} kW system</p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-500">₹{annualMaintenanceCost.toLocaleString()}</p>
                        </div>
                    </Card>
                    <div className="space-y-3">
                        {maintenanceTasks.map((task, i) => {
                            const pc = priorityColors[task.priority];
                            return (
                                <motion.div key={task.task} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                    <Card className="!p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                                <task.icon className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{task.task}</h3>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.text }}>{task.priority}</span>
                                                    {task.diy && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#3b82f620', color: '#3b82f6' }}>DIY OK</span>}
                                                </div>
                                                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{task.description}</p>
                                                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.frequency}</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ₹{task.cost}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Battery Tab */}
            {tab === 'battery' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Inputs */}
                    <Card className="mb-4 !p-4">
                        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Your Requirements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>System Size (kW)</label>
                                <input type="number" min="1" max="100" value={systemSize} onChange={e => setSystemSize(Number(e.target.value) || 1)}
                                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Avg. Power Outage (hours/day)</label>
                                <input type="number" min="0" max="24" value={avgOutageHours} onChange={e => setAvgOutageHours(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Required Capacity</p>
                                <p className="text-lg font-bold text-emerald-500">{requiredCapacity.toFixed(1)} kWh</p>
                            </div>
                        </div>
                    </Card>

                    {/* Battery Cards */}
                    <div className="space-y-3">
                        {recommendedBatteries.map((bat, i) => {
                            const sc = bat.suitability === 'excellent' ? { bg: '#10b98120', text: '#10b981', label: '✅ Excellent Fit' }
                                : bat.suitability === 'good' ? { bg: '#f59e0b20', text: '#f59e0b', label: '⚠️ Adequate' }
                                    : { bg: '#ef444420', text: '#ef4444', label: '❌ Undersized' };
                            return (
                                <motion.div key={bat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                    <Card className="!p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{bat.name}</h3>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                                </div>
                                                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{bat.type} · {bat.capacity} · {bat.bestFor}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                    <span className="flex items-center gap-1"><Battery className="w-3 h-3" /> {bat.capKwh} kWh</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bat.warranty}</span>
                                                    <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> {bat.cycles} cycles</span>
                                                    <span className="text-amber-500">{ratingStars(bat.rating)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-bold text-emerald-500">₹{bat.price.toLocaleString()}</p>
                                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>₹{Math.round(bat.price / bat.cycles)}/cycle</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
