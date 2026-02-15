import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'emerald', delay = 0 }) {
    const colors = {
        emerald: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', shadow: 'rgba(16, 185, 129, 0.2)' },
        amber: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.2)' },
        blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.2)' },
        red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', shadow: 'rgba(239, 68, 68, 0.2)' },
        purple: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.2)' },
    };

    const c = colors[color] || colors.emerald;
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : 'var(--text-muted)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="rounded-2xl p-5 transition-all duration-200 hover:shadow-lg group"
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="p-2.5 rounded-xl transition-transform group-hover:scale-110"
                    style={{ background: c.bg, boxShadow: `0 4px 12px ${c.shadow}` }}
                >
                    <Icon className="w-5 h-5" style={{ color: c.text }} />
                </div>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: trendColor }}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <h3 className="text-[13px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                {title}
            </h3>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {value}
            </p>
            {trendLabel && (
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    {trendLabel}
                </p>
            )}
        </motion.div>
    );
}
