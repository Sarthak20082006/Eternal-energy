import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <header
            className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b backdrop-blur-md"
            style={{
                background: 'var(--bg-glass)',
                borderColor: 'var(--border)',
            }}
        >
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <div
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl w-full transition-all"
                    style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search leads, customers, invoices..."
                        className="bg-transparent outline-none w-full text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl transition-all hover:scale-105"
                    style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                    }}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <button
                    className="relative p-2.5 rounded-xl transition-all hover:scale-105"
                    style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                    }}
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 text-[8px] font-bold text-white flex items-center justify-center" style={{ borderColor: 'var(--bg-card)' }}>
                        3
                    </span>
                </button>

                {/* User Avatar */}
                {user && (
                    <div className="flex items-center gap-2.5 ml-2">
                        <div
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-md"
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                            <p className="text-[11px] capitalize" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
