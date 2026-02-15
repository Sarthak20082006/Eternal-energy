import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2, MapPin, Phone, Mail, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SkeletonTable } from '../components/ui/Skeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', address: '', notes: '' });

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomers = async (query) => {
        setLoading(true);
        try {
            const res = await api.get('/customers', { params: { search: query || search, limit: 50 } });
            setCustomers(res.data.data);
        } catch {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/customers/${editing}`, form);
                toast.success('Customer updated');
            } else {
                await api.post('/customers', form);
                toast.success('Customer added');
            }
            setShowModal(false);
            setEditing(null);
            setForm({ name: '', email: '', phone: '', city: '', address: '', notes: '' });
            fetchCustomers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving customer');
        }
    };

    const handleEdit = (c) => {
        setForm({ name: c.name, email: c.email || '', phone: c.phone, city: c.city, address: c.address || '', notes: c.notes || '' });
        setEditing(c.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this customer?')) return;
        try {
            await api.delete(`/customers/${id}`);
            toast.success('Customer deleted');
            fetchCustomers();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Customers</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{customers.length} total customers</p>
                </div>
                <Button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', city: '', address: '', notes: '' }); setShowModal(true); }} icon={Plus}>
                    Add Customer
                </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl max-w-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); fetchCustomers(e.target.value); }}
                        className="bg-transparent outline-none w-full text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
            </div>

            {loading ? (
                <SkeletonTable rows={6} />
            ) : customers.length === 0 ? (
                <Card className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No customers yet</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add your first customer to get started</p>
                </Card>
            ) : (
                <Card hover={false} className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Name', 'Phone', 'Email', 'City', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c, i) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="transition-colors"
                                        style={{ borderBottom: '1px solid var(--border)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                                        <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{c.phone}</td>
                                        <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{c.email || '—'}</td>
                                        <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{c.city}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: 'var(--accent-light)', color: '#10b981' }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition"><Edit className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Customer' : 'Add Customer'}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                        { key: 'name', label: 'Name', icon: Users, required: true },
                        { key: 'phone', label: 'Phone', icon: Phone, required: true },
                        { key: 'email', label: 'Email', icon: Mail },
                        { key: 'city', label: 'City', icon: MapPin, required: true },
                        { key: 'address', label: 'Address', icon: MapPin },
                    ].map((f) => (
                        <div key={f.key} className="relative">
                            <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder={f.label}
                                value={form[f.key]}
                                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                required={f.required}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            />
                        </div>
                    ))}
                    <textarea
                        placeholder="Notes"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                    <Button type="submit" className="w-full">{editing ? 'Update' : 'Add'} Customer</Button>
                </form>
            </Modal>
        </div>
    );
}
