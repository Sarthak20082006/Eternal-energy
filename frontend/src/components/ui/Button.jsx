import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20',
    secondary: 'text-sm font-medium hover:opacity-80',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20',
    ghost: 'hover:opacity-80',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    ...props
}) {
    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-5 py-2.5 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-xl',
    };

    const secondaryStyle = variant === 'secondary' ? {
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
    } : {};

    const ghostStyle = variant === 'ghost' ? {
        background: 'transparent',
        color: 'var(--text-secondary)',
    } : {};

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            style={{ ...secondaryStyle, ...ghostStyle }}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
        </motion.button>
    );
}
