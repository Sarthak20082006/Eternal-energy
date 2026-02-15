import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Moon, Sun as SunIcon, Download, Database, Bell, Lock, Save, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Settings() {
    const { user } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const [tab, setTab] = useState('profile');

    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
        }
    }, [user]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/auth/me`, profile);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update profile'); }
        finally { setSaving(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
        if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
        setSaving(true);
        try {
            await api.put(`/auth/password`, { currentPassword: passwords.current, newPassword: passwords.new });
            toast.success('Password changed!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    const handleExport = async (type) => {
        try {
            const token = localStorage.getItem('ee-token');
            const res = await fetch(`http://localhost:8000/api/export/${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`${type} exported!`);
        } catch { toast.error('Export failed'); }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'data', label: 'Data Export', icon: Database },
    ];

    const input = (label, value, onChange, type = 'text', icon = null) => (
        <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{icon}</div>}
                <input type={type} value={value} onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', paddingLeft: icon ? '2.5rem' : '1rem' }} />
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Settings</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Manage your account and preferences</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                        style={{
                            background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                            color: tab === t.id ? '#10b981' : 'var(--text-muted)',
                            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}>
                        <t.icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {tab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{user?.name}</h3>
                                <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role} · Joined {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            {input('Full Name', profile.name, e => setProfile({ ...profile, name: e.target.value }), 'text', <User className="w-4 h-4" />)}
                            {input('Email Address', profile.email, e => setProfile({ ...profile, email: e.target.value }), 'email', <Mail className="w-4 h-4" />)}
                            {input('Phone Number', profile.phone, e => setProfile({ ...profile, phone: e.target.value }), 'tel', <Phone className="w-4 h-4" />)}
                            <Button type="submit" loading={saving} icon={Save}>Save Changes</Button>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* Security Tab */}
            {tab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                <Shield className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ensure your account stays secure</p>
                            </div>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {input('Current Password', passwords.current, e => setPasswords({ ...passwords, current: e.target.value }), 'password')}
                            {input('New Password', passwords.new, e => setPasswords({ ...passwords, new: e.target.value }), 'password')}
                            {input('Confirm New Password', passwords.confirm, e => setPasswords({ ...passwords, confirm: e.target.value }), 'password')}
                            <Button type="submit" loading={saving} icon={Lock}>Update Password</Button>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* Appearance Tab */}
            {tab === 'appearance' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Theme</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Light Mode', icon: SunIcon, active: !dark },
                                { label: 'Dark Mode', icon: Moon, active: dark },
                            ].map(opt => (
                                <button key={opt.label} onClick={!opt.active ? toggleTheme : undefined}
                                    className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                                    style={{
                                        background: opt.active ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                                        border: `2px solid ${opt.active ? '#10b981' : 'var(--border)'}`,
                                    }}>
                                    <opt.icon className="w-6 h-6" style={{ color: opt.active ? '#10b981' : 'var(--text-muted)' }} />
                                    <span className="text-sm font-medium" style={{ color: opt.active ? '#10b981' : 'var(--text-secondary)' }}>{opt.label}</span>
                                    {opt.active && <Check className="w-4 h-4 text-emerald-500" />}
                                </button>
                            ))}
                        </div>
                    </Card>
                    <Card className="mt-4">
                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Manage notification preferences</p>
                        {['Email notifications', 'Browser push notifications', 'Weekly summary report'].map(n => (
                            <div key={n} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{n}</span>
                                <label className="relative inline-flex cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-9 h-5 rounded-full peer-checked:bg-emerald-500 bg-gray-300 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                            </div>
                        ))}
                    </Card>
                </motion.div>
            )}

            {/* Data Export Tab */}
            {tab === 'data' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Export Data</h3>
                        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Download your data as CSV files</p>
                        <div className="space-y-3">
                            {[
                                { type: 'leads', label: 'Leads', desc: 'All lead records with contact details and quotation info' },
                                { type: 'customers', label: 'Customers', desc: 'Customer directory with contact information' },
                                { type: 'invoices', label: 'Invoices', desc: 'All invoices with payment status and amounts' },
                                { type: 'installations', label: 'Installations', desc: 'Installation projects with status and specs' },
                            ].map(item => (
                                <div key={item.type} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                    <button onClick={() => handleExport(item.type)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-500 hover:bg-emerald-500/10 transition">
                                        <Download className="w-3.5 h-3.5" /> CSV
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
