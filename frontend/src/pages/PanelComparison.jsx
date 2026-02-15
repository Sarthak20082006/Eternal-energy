import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Sun, Zap, Shield, DollarSign, Leaf, Check } from 'lucide-react';
import Card from '../components/ui/Card';

const panels = [
    { name: 'Adani 540W Mono PERC', watt: 540, price: 28, efficiency: 21.3, warranty: 25, degradation: 0.5, tempCoeff: -0.35, brand: 'Adani', type: 'Mono PERC' },
    { name: 'Tata 530W Premium', watt: 530, price: 27, efficiency: 20.8, warranty: 25, degradation: 0.55, tempCoeff: -0.37, brand: 'Tata', type: 'Mono PERC' },
    { name: 'Waaree 550W TOPCon', watt: 550, price: 30, efficiency: 22.1, warranty: 30, degradation: 0.4, tempCoeff: -0.30, brand: 'Waaree', type: 'TOPCon' },
    { name: 'Vikram 545W HJT', watt: 545, price: 32, efficiency: 22.5, warranty: 30, degradation: 0.35, tempCoeff: -0.26, brand: 'Vikram', type: 'HJT' },
    { name: 'Luminous 500W Poly', watt: 500, price: 22, efficiency: 18.5, warranty: 20, degradation: 0.7, tempCoeff: -0.42, brand: 'Luminous', type: 'Polycrystalline' },
    { name: 'Havells 535W Mono', watt: 535, price: 26, efficiency: 20.5, warranty: 25, degradation: 0.5, tempCoeff: -0.36, brand: 'Havells', type: 'Mono PERC' },
];

const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function PanelComparison() {
    const [selected, setSelected] = useState([0, 1, 2]);
    const [systemSize, setSystemSize] = useState(5);

    const toggle = (i) => {
        if (selected.includes(i)) {
            if (selected.length > 1) setSelected(selected.filter(x => x !== i));
        } else {
            if (selected.length < 4) setSelected([...selected, i]);
        }
    };

    const selectedPanels = selected.map(i => panels[i]);

    // Bar chart data
    const efficiencyData = selectedPanels.map((p, i) => ({ name: p.brand, efficiency: p.efficiency, fill: colors[i] }));
    const priceData = selectedPanels.map((p, i) => ({ name: p.brand, price: p.price, fill: colors[i] }));

    // Radar chart data
    const radarData = [
        { metric: 'Efficiency', ...Object.fromEntries(selectedPanels.map(p => [p.brand, (p.efficiency / 25) * 100])) },
        { metric: 'Warranty', ...Object.fromEntries(selectedPanels.map(p => [p.brand, (p.warranty / 30) * 100])) },
        { metric: 'Durability', ...Object.fromEntries(selectedPanels.map(p => [p.brand, ((1 - p.degradation) * 100)])) },
        { metric: 'Heat Resist', ...Object.fromEntries(selectedPanels.map(p => [p.brand, ((0.5 + p.tempCoeff) / 0.5) * 100])) },
        { metric: 'Value', ...Object.fromEntries(selectedPanels.map(p => [p.brand, ((35 - p.price) / 15) * 100])) },
    ];

    // 25-year generation with degradation
    const gen25Year = (p) => {
        let total = 0;
        for (let y = 0; y < 25; y++) total += systemSize * 1400 * Math.pow(1 - p.degradation / 100, y);
        return Math.round(total);
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Panel Comparison</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Compare solar panels side by side — select 2-4 panels</p>
            </div>

            {/* Panel Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {panels.map((p, i) => (
                    <motion.div
                        key={p.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggle(i)}
                        className="relative p-3 rounded-xl cursor-pointer transition-all duration-200 text-center"
                        style={{
                            background: selected.includes(i) ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
                            border: `2px solid ${selected.includes(i) ? colors[selected.indexOf(i)] : 'var(--border)'}`,
                        }}
                    >
                        {selected.includes(i) && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: colors[selected.indexOf(i)] }}>
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <Sun className="w-5 h-5 mx-auto mb-1" style={{ color: selected.includes(i) ? colors[selected.indexOf(i)] : 'var(--text-muted)' }} />
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.brand}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.watt}W {p.type}</p>
                    </motion.div>
                ))}
            </div>

            {/* System Size */}
            <Card className="mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>System Size:</span>
                    <input type="range" min="1" max="50" value={systemSize} onChange={e => setSystemSize(Number(e.target.value))} className="flex-1 accent-emerald-500" />
                    <span className="text-lg font-bold text-emerald-500 w-16 text-right">{systemSize} kW</span>
                </div>
            </Card>

            {/* Comparison Table */}
            <Card hover={false} className="!p-0 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th className="text-left py-3 px-4 text-xs uppercase" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>Specification</th>
                                {selectedPanels.map((p, i) => (
                                    <th key={p.name} className="text-center py-3 px-4 text-xs uppercase font-bold" style={{ color: colors[i], background: 'var(--bg-secondary)' }}>{p.brand}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: 'Wattage', key: 'watt', unit: 'W' },
                                { label: 'Efficiency', key: 'efficiency', unit: '%' },
                                { label: 'Price/Watt', key: 'price', unit: '₹', prefix: '₹' },
                                { label: 'Warranty', key: 'warranty', unit: ' years' },
                                { label: 'Degradation', key: 'degradation', unit: '%/year' },
                                { label: 'Temp Coefficient', key: 'tempCoeff', unit: '%/°C' },
                                { label: 'Technology', key: 'type', unit: '' },
                            ].map((spec, ri) => (
                                <tr key={spec.label} style={{ borderBottom: '1px solid var(--border)', background: ri % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                                    <td className="py-2.5 px-4 font-medium text-xs" style={{ color: 'var(--text-secondary)' }}>{spec.label}</td>
                                    {selectedPanels.map((p, i) => {
                                        const val = p[spec.key];
                                        const isBest = spec.key !== 'type' && spec.key !== 'degradation' && spec.key !== 'tempCoeff' && spec.key !== 'price'
                                            ? val === Math.max(...selectedPanels.map(x => x[spec.key]))
                                            : spec.key === 'degradation' || spec.key === 'tempCoeff' || spec.key === 'price'
                                                ? val === Math.min(...selectedPanels.map(x => x[spec.key]))
                                                : false;
                                        return (
                                            <td key={p.name} className="py-2.5 px-4 text-center text-xs font-semibold"
                                                style={{ color: isBest ? '#10b981' : 'var(--text-primary)' }}>
                                                {spec.prefix || ''}{val}{spec.unit} {isBest && '⭐'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                                <td className="py-2.5 px-4 font-medium text-xs" style={{ color: 'var(--text-secondary)' }}>Total Cost ({systemSize}kW)</td>
                                {selectedPanels.map((p, i) => (
                                    <td key={p.name} className="py-2.5 px-4 text-center text-xs font-bold" style={{ color: colors[i] }}>
                                        ₹{(systemSize * 1000 * p.price).toLocaleString()}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-2.5 px-4 font-medium text-xs" style={{ color: 'var(--text-secondary)' }}>25-Year Generation</td>
                                {selectedPanels.map((p, i) => (
                                    <td key={p.name} className="py-2.5 px-4 text-center text-xs font-bold" style={{ color: colors[i] }}>
                                        {(gen25Year(p) / 1000).toFixed(0)} MWh
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Card>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Efficiency Comparison</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={efficiencyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                            <YAxis domain={[16, 24]} stroke="var(--text-muted)" fontSize={12} tickFormatter={v => `${v}%`} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} formatter={v => [`${v}%`, 'Efficiency']} />
                            <Bar dataKey="efficiency" radius={[8, 8, 0, 0]}>
                                {efficiencyData.map((_, i) => <motion.rect key={i} fill={colors[i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Overall Rating</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--border)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                            <PolarRadiusAxis tick={false} axisLine={false} />
                            {selectedPanels.map((p, i) => (
                                <Radar key={p.brand} name={p.brand} dataKey={p.brand} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} strokeWidth={2} />
                            ))}
                            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Recommendation */}
            <Card>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Leaf className="w-4 h-4 text-emerald-500" /> AI Recommendation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'Best Value', icon: DollarSign, panel: [...selectedPanels].sort((a, b) => a.price - b.price)[0] },
                        { label: 'Best Performance', icon: Zap, panel: [...selectedPanels].sort((a, b) => b.efficiency - a.efficiency)[0] },
                        { label: 'Best Durability', icon: Shield, panel: [...selectedPanels].sort((a, b) => a.degradation - b.degradation)[0] },
                    ].map(rec => (
                        <div key={rec.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <rec.icon className="w-4 h-4 text-emerald-500" />
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{rec.label}</p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{rec.panel.brand} {rec.panel.watt}W</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rec.panel.type} · {rec.panel.efficiency}% · ₹{rec.panel.price}/W</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
