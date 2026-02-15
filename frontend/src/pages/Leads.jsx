import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Edit, Trash2, Eye, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonTable } from '../components/ui/Skeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusConfig = {
    new: { bg: '#3b82f620', text: '#3b82f6', label: 'New' },
    contacted: { bg: '#f59e0b20', text: '#f59e0b', label: 'Contacted' },
    quoted: { bg: '#8b5cf620', text: '#8b5cf6', label: 'Quoted' },
    negotiation: { bg: '#f9731620', text: '#f97316', label: 'Negotiation' },
    won: { bg: '#10b98120', text: '#10b981', label: 'Won' },
    lost: { bg: '#ef444420', text: '#ef4444', label: 'Lost' },
};

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { fetchLeads(); }, [statusFilter]);

    const fetchLeads = async (query) => {
        setLoading(true);
        try {
            const res = await api.get('/leads', { params: { search: query || search, status: statusFilter || undefined, limit: 50 } });
            setLeads(res.data.data);
        } catch {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/leads/${id}`, { status: newStatus });
            toast.success('Status updated');
            fetchLeads();
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this lead?')) return;
        try {
            await api.delete(`/leads/${id}`);
            toast.success('Lead deleted');
            fetchLeads();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const formatCurrency = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v?.toLocaleString()}`;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Leads</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{leads.length} total leads</p>
                </div>
                <Button onClick={() => window.location.href = '/quotation'} icon={Plus}>
                    New Quotation
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); fetchLeads(e.target.value); }}
                        className="bg-transparent outline-none w-full text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                    <option value="">All Status</option>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <SkeletonTable rows={6} />
            ) : leads.length === 0 ? (
                <Card className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No leads yet</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Create a quotation to generate your first lead</p>
                </Card>
            ) : (
                <Card hover={false} className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Name', 'City', 'Phone', 'System', 'Total', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, i) => {
                                    const sc = statusConfig[lead.status] || statusConfig.new;
                                    return (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="transition-colors"
                                            style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{lead.name}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{lead.city}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{lead.phone}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{lead.systemSize} kW</td>
                                            <td className="py-3 px-4 font-semibold text-emerald-500">{formatCurrency(lead.totalPrice)}</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className="text-xs font-medium px-2 py-1 rounded-full outline-none cursor-pointer"
                                                    style={{ background: sc.bg, color: sc.text, border: 'none' }}
                                                >
                                                    {Object.entries(statusConfig).map(([key, cfg]) => (
                                                        <option key={key} value={key}>{cfg.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
