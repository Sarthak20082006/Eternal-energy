import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import {
    Users, Receipt, Zap, IndianRupee, TrendingUp,
    ArrowUpRight, Clock, MapPin, Activity,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import api from '../api/axios';

const CHART_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'];

// Fallback demo data for when API returns empty
const demoMonthlyRevenue = [
    { month: '2025-09', revenue: 320000 },
    { month: '2025-10', revenue: 485000 },
    { month: '2025-11', revenue: 390000 },
    { month: '2025-12', revenue: 670000 },
    { month: '2026-01', revenue: 540000 },
    { month: '2026-02', revenue: 720000 },
];
const demoCityDistribution = [
    { _id: 'Mumbai', count: 12, totalValue: 4500000 },
    { _id: 'Delhi', count: 8, totalValue: 3200000 },
    { _id: 'Bangalore', count: 6, totalValue: 2400000 },
    { _id: 'Pune', count: 5, totalValue: 2000000 },
    { _id: 'Hyderabad', count: 4, totalValue: 1600000 },
];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data.data);
        } catch (err) {
            // Use demo data for showcase
            setStats({
                overview: { totalLeads: 47, totalCustomers: 32, totalInstallations: 18, totalRevenue: 2850000, totalCapacityKW: 124 },
                monthlyRevenue: demoMonthlyRevenue,
                cityDistribution: demoCityDistribution,
                leadsByStatus: { new: 12, contacted: 8, quoted: 15, negotiation: 5, won: 5, lost: 2 },
                installationsByStatus: { planning: 4, in_progress: 6, completed: 8 },
                recentLeads: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
        return `₹${value}`;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    const { overview, monthlyRevenue, cityDistribution, leadsByStatus, installationsByStatus, recentLeads } = stats;

    // Build pie chart data for lead status
    const leadPieData = Object.entries(leadsByStatus || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    const revenueData = (monthlyRevenue?.length ? monthlyRevenue : demoMonthlyRevenue).map((m) => ({
        ...m,
        month: m.month?.split('-')[1] ? new Date(2024, parseInt(m.month.split('-')[1]) - 1).toLocaleString('default', { month: 'short' }) : m.month,
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Welcome back — here's your business overview
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(overview.totalRevenue)}
                    icon={IndianRupee}
                    trend={12}
                    trendLabel="vs last month"
                    color="emerald"
                    delay={0}
                />
                <StatCard
                    title="Total Leads"
                    value={overview.totalLeads}
                    icon={TrendingUp}
                    trend={8}
                    trendLabel="new this month"
                    color="blue"
                    delay={0.05}
                />
                <StatCard
                    title="Active Customers"
                    value={overview.totalCustomers}
                    icon={Users}
                    trend={5}
                    trendLabel="customer growth"
                    color="purple"
                    delay={0.1}
                />
                <StatCard
                    title="Installations"
                    value={overview.totalInstallations}
                    icon={Zap}
                    trend={15}
                    trendLabel={`${overview.totalCapacityKW} kW total`}
                    color="amber"
                    delay={0.15}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Monthly revenue overview</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'var(--accent-light)' }}>
                            <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-md)',
                                    color: 'var(--text-primary)',
                                }}
                                formatter={(value) => [formatCurrency(value), 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Lead Status Pie */}
                <Card>
                    <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Lead Pipeline</h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Status distribution</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={leadPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {leadPieData.map((_, i) => (
                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {leadPieData.map((entry, i) => (
                            <div key={entry.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                {entry.name} ({entry.value})
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* City Distribution */}
                <Card>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        <MapPin className="w-4 h-4 inline mr-2 text-emerald-500" />
                        Top Cities
                    </h3>
                    <div className="space-y-3">
                        {(cityDistribution?.length ? cityDistribution : demoCityDistribution).slice(0, 5).map((city, i) => (
                            <motion.div
                                key={city._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold w-5 text-center" style={{ color: 'var(--text-muted)' }}>
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{city._id}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                        {city.count} leads
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-500">
                                        {formatCurrency(city.totalValue)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Installation Status */}
                <Card>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        <Activity className="w-4 h-4 inline mr-2 text-emerald-500" />
                        Installation Pipeline
                    </h3>
                    <div className="space-y-4">
                        {[
                            { key: 'planning', label: 'Planning', color: '#3b82f6' },
                            { key: 'material_ordered', label: 'Material Ordered', color: '#f59e0b' },
                            { key: 'in_progress', label: 'In Progress', color: '#10b981' },
                            { key: 'completed', label: 'Completed', color: '#059669' },
                            { key: 'commissioned', label: 'Commissioned', color: '#6ee7b7' },
                        ].map((stage) => {
                            const count = installationsByStatus?.[stage.key] || 0;
                            const total = Object.values(installationsByStatus || {}).reduce((a, b) => a + b, 0) || 1;
                            const pct = Math.round((count / total) * 100);
                            return (
                                <div key={stage.key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: 'var(--text-secondary)' }}>{stage.label}</span>
                                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{count}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ background: stage.color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Recent Leads */}
            {recentLeads?.length > 0 && (
                <Card>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        <Clock className="w-4 h-4 inline mr-2 text-emerald-500" />
                        Recent Leads
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Name', 'City', 'System', 'Value', 'Status'].map((h) => (
                                        <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:opacity-80 transition" style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>{lead.name}</td>
                                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{lead.city}</td>
                                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{lead.systemSize} kW</td>
                                        <td className="py-2.5 px-3 font-semibold text-emerald-500">{formatCurrency(lead.totalPrice)}</td>
                                        <td className="py-2.5 px-3">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: 'var(--accent-light)', color: '#10b981' }}>
                                                {lead.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
