import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SkeletonTable } from '../components/ui/Skeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
    planning: { bg: '#3b82f620', text: '#3b82f6' },
    material_ordered: { bg: '#f59e0b20', text: '#f59e0b' },
    in_progress: { bg: '#8b5cf620', text: '#8b5cf6' },
    completed: { bg: '#10b98120', text: '#10b981' },
    commissioned: { bg: '#06b6d420', text: '#06b6d4' },
};

export default function Installations() {
    const [installations, setInstallations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        customer: '', systemSize: 5, panelName: 'Adani 540W Mono PERC',
        inverterName: 'Growatt 5kW', structureName: 'HDGI Elevated Structure',
        panelCount: 10, siteAddress: '', notes: '',
    });

    useEffect(() => { fetchInstallations(); fetchCustomers(); }, []);

    const fetchInstallations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/installations', { params: { limit: 50 } });
            setInstallations(res.data.data);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    const fetchCustomers = async () => {
        try { const res = await api.get('/customers', { params: { limit: 100 } }); setCustomers(res.data.data); } catch { }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/installations', form);
            toast.success('Installation created!');
            setShowCreate(false);
            fetchInstallations();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleStatusChange = async (id, status) => {
        try { await api.put(`/installations/${id}`, { status }); toast.success('Updated'); fetchInstallations(); }
        catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete?')) return;
        try { await api.delete(`/installations/${id}`); toast.success('Deleted'); fetchInstallations(); }
        catch { toast.error('Failed'); }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Installations</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{installations.length} projects</p>
                </div>
                <Button onClick={() => setShowCreate(true)} icon={Plus}>New Installation</Button>
            </div>

            {loading ? <SkeletonTable rows={5} /> : installations.length === 0 ? (
                <Card className="text-center py-12">
                    <Wrench className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No installations</p>
                </Card>
            ) : (
                <Card hover={false} className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Customer', 'System', 'Panel', 'Inverter', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {installations.map((inst, i) => {
                                    const sc = statusColors[inst.status] || statusColors.planning;
                                    return (
                                        <motion.tr key={inst.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                            className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{inst.customer?.name || '—'}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{inst.systemSize} kW</td>
                                            <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{inst.panelName}</td>
                                            <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{inst.inverterName}</td>
                                            <td className="py-3 px-4">
                                                <select value={inst.status} onChange={e => handleStatusChange(inst.id, e.target.value)}
                                                    className="text-xs font-medium px-2 py-1 rounded-full outline-none cursor-pointer"
                                                    style={{ background: sc.bg, color: sc.text, border: 'none' }}>
                                                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button onClick={() => handleDelete(inst.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition">
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

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Installation">
                <form onSubmit={handleCreate} className="space-y-3">
                    <select value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} required
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.city}</option>)}
                    </select>
                    {['systemSize', 'panelName', 'inverterName', 'structureName', 'panelCount', 'siteAddress'].map(f => (
                        <input key={f} type={['systemSize', 'panelCount'].includes(f) ? 'number' : 'text'}
                            placeholder={f.replace(/([A-Z])/g, ' $1').trim()} value={form[f]}
                            onChange={e => setForm({ ...form, [f]: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    ))}
                    <Button type="submit" className="w-full">Create Installation</Button>
                </form>
            </Modal>
        </div>
    );
}
