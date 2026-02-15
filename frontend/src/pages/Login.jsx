import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isRegister) {
                await register(form);
                toast.success('Account created successfully!');
            } else {
                await login(form.email, form.password);
                toast.success('Welcome back!');
            }
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden solar-gradient">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 shadow-xl shadow-emerald-500/30"
                    >
                        <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">ETERNAL ENERGY</h1>
                    <p className="text-emerald-400/60 text-sm tracking-widest mt-1">SOLAR BUSINESS PLATFORM</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl p-8 backdrop-blur-xl"
                    style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Tab Toggle */}
                    <div className="flex mb-6 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {['Login', 'Register'].map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => setIsRegister(i === 1)}
                                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    background: (i === 0 ? !isRegister : isRegister) ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                    color: (i === 0 ? !isRegister : isRegister) ? '#34d399' : '#64748b',
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {isRegister && (
                                <motion.div
                                    key="name"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={form.name}
                                            onChange={(e) => updateForm('name', e.target.value)}
                                            required={isRegister}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/40"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => updateForm('email', e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/40"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => updateForm('password', e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/40"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {isRegister && (
                                <motion.div
                                    key="role"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <select
                                        value={form.role}
                                        onChange={(e) => updateForm('role', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-emerald-500/40"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <option value="admin" className="bg-slate-900">Admin</option>
                                        <option value="employee" className="bg-slate-900">Employee</option>
                                        <option value="customer" className="bg-slate-900">Customer</option>
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                            }}
                        >
                            {loading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>
                                    {isRegister ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    © 2024 Eternal Energy. Powering a sustainable future.
                </p>
            </div>
        </div>
    );
}
