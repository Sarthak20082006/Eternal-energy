import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Users, Receipt, Wrench,
    Calculator, ChevronLeft, ChevronRight, Zap, LogOut, Sun, Layers, Settings, CloudSun, Battery,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/quotation', label: 'Quotation', icon: Calculator },
    { path: '/leads', label: 'Leads', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/invoices', label: 'Invoices', icon: Receipt },
    { path: '/installations', label: 'Installations', icon: Wrench },
    { path: '/solar-calculator', label: 'Solar Calculator', icon: Sun },
    { path: '/panel-comparison', label: 'Panel Compare', icon: Layers },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/weather', label: 'Weather', icon: CloudSun },
    { path: '/maintenance', label: 'Maintenance', icon: Battery },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const location = useLocation();
    const { logout, user } = useAuth();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
            style={{
                background: 'var(--bg-sidebar)',
                borderColor: 'var(--border)',
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="text-base font-bold text-white tracking-tight">ETERNAL ENERGY</h1>
                            <p className="text-[10px] text-emerald-400/70 font-medium tracking-widest">SOLAR PLATFORM</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="group relative flex items-center gap-3 rounded-xl transition-all duration-200"
                            style={{
                                padding: collapsed ? '10px 0' : '10px 14px',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                color: isActive ? '#34d399' : '#94a3b8',
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-emerald-400"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Tooltip when collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t px-3 py-3 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center gap-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    style={{
                        padding: collapsed ? '10px 0' : '10px 14px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                >
                    {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
                    {!collapsed && <span className="text-sm font-medium">Collapse</span>}
                </button>

                {/* User + Logout */}
                {user && (
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        style={{
                            padding: collapsed ? '10px 0' : '10px 14px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                        {!collapsed && (
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-sm font-medium truncate">{user.name}</span>
                                <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                            </div>
                        )}
                    </button>
                )}
            </div>
        </motion.aside>
    );
}
