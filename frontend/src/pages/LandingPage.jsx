import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Zap, Sun, Shield, TrendingUp, Phone, Mail, MapPin, ChevronRight, Star,
    ArrowRight, CheckCircle, Menu, X, Battery, Wrench, BarChart3, Users, Leaf,
    Clock, IndianRupee, Award, Heart, Globe, Calculator,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ─── Navbar ──────────────────────────────────────────────
function Navbar() {
    const [open, setOpen] = useState(false);
    const links = [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Calculator', href: '#calculator' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
            style={{ background: 'rgba(15,23,42,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-white font-bold text-lg leading-none tracking-tight">ETERNAL ENERGY</span>
                        <span className="block text-[9px] tracking-[0.25em] text-emerald-400/60 font-medium">SOLAR SOLUTIONS</span>
                    </div>
                </a>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-6">
                    {links.map(l => (
                        <a key={l.label} href={l.href}
                            className="text-slate-400 hover:text-white text-sm font-medium transition-colors">{l.label}</a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link to="/login"
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                        Sign In
                    </Link>
                    <Link to="/login"
                        className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        Get Started →
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2">
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="lg:hidden px-4 pb-4 space-y-2" style={{ background: 'rgba(15,23,42,0.95)' }}>
                    {links.map(l => (
                        <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                            className="block text-slate-300 hover:text-white text-sm py-2 font-medium">{l.label}</a>
                    ))}
                    <div className="flex gap-2 pt-2">
                        <Link to="/login" className="flex-1 text-center text-sm font-medium text-white/70 border border-white/10 py-2.5 rounded-xl">Sign In</Link>
                        <Link to="/login" className="flex-1 text-center text-sm font-semibold text-white py-2.5 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>Register</Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}

// ─── Hero ────────────────────────────────────────────────
function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            {/* Animated Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
                <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
                <motion.div animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium text-emerald-400 border border-emerald-400/20" style={{ background: 'rgba(16,185,129,0.08)' }}>
                        <Sun className="w-3.5 h-3.5" /> India's Trusted Solar Energy Partner
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                        Still Paying for
                        <span className="block mt-2" style={{ background: 'linear-gradient(135deg, #10b981, #34d399, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Electricity?
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
                        Switch to solar and let the sun pay your bills. Save up to <strong className="text-white">₹2,00,000/year</strong> with
                        India's most advanced rooftop solar solutions. Government subsidies available.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                        <a href="#calculator"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <Calculator className="w-4 h-4" /> Calculate Savings <ArrowRight className="w-4 h-4" />
                        </a>
                        <a href="tel:+919876543210"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm border border-white/10 hover:border-white/20 transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Phone className="w-4 h-4" /> Call Us Now
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={fadeUp} className="flex gap-8">
                        {[
                            { value: '2,500+', label: 'Installations', icon: Sun },
                            { value: '15+', label: 'Cities', icon: MapPin },
                            { value: '98%', label: 'Happy Customers', icon: Heart },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <s.icon className="w-4 h-4 text-emerald-500" />
                                    <span className="text-2xl font-bold text-white">{s.value}</span>
                                </div>
                                <span className="text-xs text-slate-500">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Side — Consultation Form */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
                    <ConsultationForm />
                </motion.div>
            </div>
        </section>
    );
}

// ─── Consultation Form (like SolarSquare) ─────────────────
function ConsultationForm() {
    const [form, setForm] = useState({ name: '', phone: '', pincode: '', bill: '', type: 'Residential' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const bills = ['Less than ₹1500', '₹1500 - ₹2500', '₹2500 - ₹4000', '₹4000 - ₹8000', 'More than ₹8000'];
    const types = ['Residential', 'Commercial', 'Housing Society'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.phone) return toast.error('Name and phone are required');
        setLoading(true);
        try {
            await api.post('/leads', {
                name: form.name,
                phone: form.phone,
                city: form.pincode || 'Unknown',
                monthlyUnits: form.bill === 'Less than ₹1500' ? 100 : form.bill === '₹1500 - ₹2500' ? 200 : form.bill === '₹2500 - ₹4000' ? 350 : form.bill === '₹4000 - ₹8000' ? 600 : 1000,
                systemSize: form.bill === 'Less than ₹1500' ? 2 : form.bill === '₹1500 - ₹2500' ? 3 : form.bill === '₹2500 - ₹4000' ? 5 : form.bill === '₹4000 - ₹8000' ? 8 : 12,
                notes: `Type: ${form.type}, Bill: ${form.bill}, Pincode: ${form.pincode}`,
                panelName: 'Adani 540W Mono PERC',
                panelPricePerWatt: 28,
                inverterName: 'Growatt 5kW',
                inverterPrice: 45000,
                structureName: 'HDGI Elevated Structure',
                structurePrice: 40000,
            });
            toast.success('Thank you! Our solar expert will call you within 24 hours.');
            setForm({ name: '', phone: '', pincode: '', bill: '', type: 'Residential' });
        } catch {
            toast.success('Thank you! Our solar expert will contact you soon.');
        } finally { setLoading(false); }
    };

    return (
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <h3 className="text-xl font-bold text-white mb-1">Schedule a <span className="text-emerald-400">FREE</span> Consultation</h3>
            <p className="text-xs text-slate-400 mb-5">Get a custom solar plan & pricing for your home</p>

            {/* Type Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {types.map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                        className="flex-1 py-2 text-xs font-medium rounded-lg transition-all"
                        style={{ background: form.type === t ? 'rgba(16,185,129,0.15)' : 'transparent', color: form.type === t ? '#34d399' : '#64748b' }}>
                        {t}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="Enter your name" />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">WhatsApp / Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="+91 98765 43210" />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Pin Code</label>
                    <input type="text" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} placeholder="Enter your area pincode" />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Average Monthly Bill *</label>
                    <div className="flex flex-wrap gap-2">
                        {bills.map(b => (
                            <button type="button" key={b} onClick={() => setForm(f => ({ ...f, bill: b }))}
                                className="px-3 py-2 text-xs font-medium rounded-lg transition-all"
                                style={{ background: form.bill === b ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${form.bill === b ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, color: form.bill === b ? '#34d399' : '#94a3b8' }}>
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}>
                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><Sun className="w-4 h-4" /> Get Free Solar Quote <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
            </form>
            <p className="text-[10px] text-slate-600 text-center mt-3">By submitting, you agree to our Terms of Service & Privacy Policy</p>
        </div>
    );
}

// ─── Services ────────────────────────────────────────────
function Services() {
    const services = [
        { icon: Sun, title: 'Residential Solar', desc: 'Rooftop solar systems for homes. Save up to 90% on electricity bills with net metering.', color: '#f59e0b' },
        { icon: Users, title: 'Commercial Solar', desc: 'Large-scale solar solutions for offices, factories, and commercial buildings.', color: '#3b82f6' },
        { icon: Battery, title: 'Battery Storage', desc: 'Energy storage systems for 24/7 power backup. Li-ion & lead-acid options.', color: '#8b5cf6' },
        { icon: Wrench, title: 'AMC & Maintenance', desc: 'Annual maintenance contracts with panel cleaning, inverter servicing & performance audit.', color: '#10b981' },
        { icon: BarChart3, title: 'Energy Audit', desc: 'Complete energy consumption analysis and custom solar sizing recommendations.', color: '#ec4899' },
        { icon: IndianRupee, title: '0% EMI Financing', desc: 'Easy EMI plans with instant approval. Make solar affordable for everyone.', color: '#06b6d4' },
    ];

    return (
        <section id="services" className="py-20 px-4 sm:px-6" style={{ background: '#0f172a' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
                    <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Services</motion.p>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Complete Solar Solutions</motion.h2>
                    <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto">From consultation to installation and lifetime maintenance — we handle everything.</motion.p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map(s => (
                        <motion.div key={s.title} variants={fadeUp}
                            className="p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300 cursor-default"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${s.color}15` }}>
                                <s.icon className="w-6 h-6" style={{ color: s.color }} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── How It Works ────────────────────────────────────────
function HowItWorks() {
    const steps = [
        { num: '01', title: 'Free Consultation', desc: 'Our solar expert visits your site, analyzes your roof, and provides a custom proposal.', icon: Phone },
        { num: '02', title: '3D Design & Approval', desc: 'We create a 3D model of your rooftop with solar panels. You approve the design and financing plan.', icon: Sun },
        { num: '03', title: 'Professional Installation', desc: 'Certified engineers install your system with premium, cyclone-proof mounting in 2-3 days.', icon: Wrench },
        { num: '04', title: 'Start Saving', desc: 'Your system goes live with net metering. Watch your electricity bill drop from day one.', icon: TrendingUp },
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #0f172a, #1a2332, #0f172a)' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
                    <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">How It Works</motion.p>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">4 Simple Steps to Go Solar</motion.h2>
                    <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto">From inquiry to installation in as few as 7 days.</motion.p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <motion.div key={s.num} variants={fadeUp} className="relative text-center">
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <s.icon className="w-7 h-7 text-emerald-400" />
                            </div>
                            <span className="text-emerald-500 text-xs font-bold tracking-widest">STEP {s.num}</span>
                            <h3 className="text-lg font-bold text-white mt-1 mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                            {i < 3 && <ChevronRight className="hidden lg:block absolute top-8 -right-3 w-6 h-6 text-emerald-500/30" />}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Solar Calculator Preview ──────────────────────────────
function CalculatorPreview() {
    const [bill, setBill] = useState(3000);
    const systemSize = Math.round(bill / 600 * 10) / 10;
    const annualSavings = bill * 12 * 0.9;
    const systemCost = systemSize * 60000;
    const payback = Math.round(systemCost / annualSavings * 10) / 10;
    const co2 = Math.round(systemSize * 1.5 * 10) / 10;

    return (
        <section id="calculator" className="py-20 px-4 sm:px-6" style={{ background: '#0f172a' }}>
            <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
                    <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Solar Calculator</motion.p>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How Much Can You Save?</motion.h2>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="mb-6">
                        <label className="text-sm font-medium text-slate-300 mb-3 block">Your Monthly Electricity Bill</label>
                        <div className="flex items-center gap-4">
                            <span className="text-emerald-400 font-bold text-lg">₹{bill.toLocaleString()}</span>
                            <input type="range" min="500" max="20000" step="100" value={bill} onChange={e => setBill(+e.target.value)}
                                className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                            <span className="text-slate-400 text-sm">₹20,000</span>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { label: 'System Size', value: `${systemSize} kW`, icon: Sun, color: '#f59e0b' },
                            { label: 'Annual Savings', value: `₹${annualSavings.toLocaleString()}`, icon: IndianRupee, color: '#10b981' },
                            { label: 'Payback Period', value: `${payback} yrs`, icon: Clock, color: '#3b82f6' },
                            { label: 'CO₂ Saved/Year', value: `${co2} tons`, icon: Leaf, color: '#8b5cf6' },
                        ].map(s => (
                            <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
                                <p className="text-xl font-bold text-white">{s.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <a href="#home" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            Get Detailed Quote <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Testimonials ────────────────────────────────────────
function Testimonials() {
    const reviews = [
        { name: 'Rajesh Patel', city: 'Ahmedabad', system: '5 kW', savings: '₹1,800/mo', text: 'Excellent service! My electricity bill dropped from ₹3,200 to just ₹400. The team was professional and installation was completed in just 2 days.', rating: 5 },
        { name: 'Priya Sharma', city: 'Jaipur', system: '8 kW', savings: '₹3,200/mo', text: 'Best decision we made for our home. The solar panels look great on our roof and the savings are real. Highly recommend Eternal Energy.', rating: 5 },
        { name: 'Suresh Kumar', city: 'Pune', system: '10 kW', savings: '₹4,500/mo', text: 'From consultation to installation, everything was seamless. Their maintenance team is responsive and the system performs above expectations.', rating: 5 },
        { name: 'Anita Deshmukh', city: 'Nagpur', system: '3 kW', savings: '₹1,200/mo', text: 'I was skeptical at first, but the team explained everything clearly. Now I am generating my own power and even earning from surplus energy!', rating: 4 },
    ];

    return (
        <section id="testimonials" className="py-20 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #0f172a, #1a2332)' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
                    <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</motion.p>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">What Our Customers Say</motion.h2>
                    <motion.p variants={fadeUp} className="text-slate-400">98% of our customers recommend us to their friends & family</motion.p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reviews.map(r => (
                        <motion.div key={r.name} variants={fadeUp}
                            className="p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} className="w-4 h-4" fill={i < r.rating ? '#f59e0b' : 'transparent'} stroke={i < r.rating ? '#f59e0b' : '#475569'} />
                                ))}
                            </div>
                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">"{r.text}"</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">{r.name}</p>
                                    <p className="text-xs text-slate-500">{r.city} · {r.system}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-400 text-sm font-bold">{r.savings}</p>
                                    <p className="text-[10px] text-slate-500">savings</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Footer ──────────────────────────────────────────────
function Footer() {
    return (
        <footer id="contact" className="pt-16 pb-8 px-4 sm:px-6" style={{ background: '#0c1222', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-white font-bold text-base">ETERNAL ENERGY</span>
                                <span className="block text-[8px] tracking-[0.2em] text-emerald-400/60">SOLAR SOLUTIONS</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            India's trusted solar energy partner. Powering homes and businesses with clean, renewable energy since 2020.
                        </p>
                        <div className="flex gap-3">
                            {['facebook', 'instagram', 'twitter', 'linkedin'].map(s => (
                                <a key={s} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <Globe className="w-4 h-4 text-slate-400" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {['About Us', 'Solar Solutions', 'Pricing', 'Subsidy Guide', 'EMI Plans', 'Blog'].map(l => (
                                <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Solar Solutions */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Solar Solutions</h4>
                        <ul className="space-y-2.5">
                            {['Residential Solar', 'Commercial Solar', 'Battery Storage', 'Solar Water Heater', 'EV Charging', 'AMC Plans'].map(l => (
                                <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-400">123, Solar Park Road, Nagpur,<br />Maharashtra 440001</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-sm text-slate-400 hover:text-white">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <a href="mailto:info@eternalenergy.in" className="text-sm text-slate-400 hover:text-white">info@eternalenergy.in</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Cities */}
                <div className="border-t border-white/5 pt-6 mb-6">
                    <p className="text-xs text-slate-500 mb-2 font-medium">We are present in</p>
                    <p className="text-xs text-slate-500">
                        Mumbai · Delhi · Bangalore · Hyderabad · Chennai · Pune · Ahmedabad · Jaipur · Kolkata · Lucknow · Nagpur · Indore · Coimbatore · Surat · Vadodara
                    </p>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">© 2025 Eternal Energy. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ─── Landing Page ────────────────────────────────────────
export default function LandingPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen">
            <Navbar />
            <Hero />
            <Services />
            <HowItWorks />
            <CalculatorPreview />
            <Testimonials />
            <Footer />
        </div>
    );
}
