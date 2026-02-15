import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Plus, Trash2, IndianRupee, FileDown } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SkeletonTable } from '../components/ui/Skeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';

const psCfg = {
    pending: { bg: '#f59e0b20', text: '#f59e0b' },
    partial: { bg: '#3b82f620', text: '#3b82f6' },
    paid: { bg: '#10b98120', text: '#10b981' },
    overdue: { bg: '#ef444420', text: '#ef4444' },
    cancelled: { bg: '#64748b20', text: '#64748b' },
};

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        customer: '', discountPercent: 0, gstRate: 18, notes: '', dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
    });

    useEffect(() => { fetchInvoices(); fetchCustomers(); }, [filter]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/invoices', { params: { paymentStatus: filter || undefined, limit: 50 } });
            setInvoices(res.data.data);
        } catch { toast.error('Failed to load invoices'); }
        finally { setLoading(false); }
    };

    const fetchCustomers = async () => {
        try { const res = await api.get('/customers', { params: { limit: 100 } }); setCustomers(res.data.data); } catch { }
    };

    const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] });
    const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
    const updateItem = (i, f, v) => { const items = [...form.items]; items[i] = { ...items[i], [f]: v }; setForm({ ...form, items }); };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/invoices', form);
            toast.success('Invoice created!');
            setShowCreate(false);
            setForm({ customer: '', discountPercent: 0, gstRate: 18, notes: '', dueDate: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });
            fetchInvoices();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleStatusChange = async (id, s) => {
        try { await api.put(`/invoices/${id}`, { paymentStatus: s }); toast.success('Updated'); fetchInvoices(); }
        catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this invoice?')) return;
        try { await api.delete(`/invoices/${id}`); toast.success('Deleted'); fetchInvoices(); }
        catch { toast.error('Failed'); }
    };

    const handleDownloadPDF = async (id) => {
        try {
            const token = localStorage.getItem('ee-token');
            const res = await fetch(`http://localhost:8000/api/export/invoice/${id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('PDF downloaded!');
        } catch { toast.error('PDF failed'); }
    };

    const fmt = (v) => `₹${v?.toLocaleString() || 0}`;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Invoices</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{invoices.length} total</p>
                </div>
                <Button onClick={() => setShowCreate(true)} icon={Plus}>Create Invoice</Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {['', 'pending', 'paid', 'overdue', 'partial'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                            background: filter === s ? 'rgba(16,185,129,0.12)' : 'var(--bg-secondary)',
                            color: filter === s ? '#10b981' : 'var(--text-secondary)',
                            border: `1px solid ${filter === s ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                        }}>
                        {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
                    </button>
                ))}
            </div>

            {loading ? <SkeletonTable rows={5} /> : invoices.length === 0 ? (
                <Card className="text-center py-12">
                    <Receipt className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No invoices</p>
                </Card>
            ) : (
                <Card hover={false} className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Invoice #', 'Customer', 'Amount', 'GST', 'Total', 'Status', 'Date', ''].map(h => (
                                        <th key={h} className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider"
                                            style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, i) => {
                                    const sc = psCfg[inv.paymentStatus] || psCfg.pending;
                                    return (
                                        <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                            className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="py-3 px-4 font-mono font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{inv.invoiceNumber}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{inv.customer?.name || '—'}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{fmt(inv.subtotal)}</td>
                                            <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{fmt(inv.gstAmount)}</td>
                                            <td className="py-3 px-4 font-semibold text-emerald-500">{fmt(inv.totalAmount)}</td>
                                            <td className="py-3 px-4">
                                                <select value={inv.paymentStatus} onChange={e => handleStatusChange(inv.id, e.target.value)}
                                                    className="text-xs font-medium px-2 py-1 rounded-full outline-none cursor-pointer capitalize"
                                                    style={{ background: sc.bg, color: sc.text, border: 'none' }}>
                                                    {Object.keys(psCfg).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleDownloadPDF(inv.id)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition" title="Download PDF"><FileDown className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDelete(inv.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )
            }

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Invoice" size="lg">
                <form onSubmit={handleCreate} className="space-y-4">
                    <select value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} required
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Items</h4>
                            <button type="button" onClick={addItem} className="text-xs text-emerald-500 font-medium">+ Add</button>
                        </div>
                        {form.items.map((item, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} required
                                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                                <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} min={1}
                                    className="w-16 px-3 py-2 rounded-lg text-sm outline-none text-center"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                                <input type="number" placeholder="Price" value={item.unitPrice || ''} onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} required
                                    className="w-24 px-3 py-2 rounded-lg text-sm outline-none"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                                {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-red-500 px-2 hover:bg-red-500/10 rounded-lg">×</button>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Discount %</label>
                            <input type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: parseFloat(e.target.value) || 0 })} min={0} max={100}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Due Date</label>
                            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    <Button type="submit" icon={IndianRupee} className="w-full">Create Invoice</Button>
                </form>
            </Modal>
        </div >
    );
}
