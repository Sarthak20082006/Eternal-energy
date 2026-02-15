export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{ minHeight: '1rem' }}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}
