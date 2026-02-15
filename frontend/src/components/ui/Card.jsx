import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
            className={`rounded-2xl p-5 transition-all duration-200 ${className}`}
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
