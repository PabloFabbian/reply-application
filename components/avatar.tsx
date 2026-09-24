export function Avatar() {
    return (
        <span
            aria-hidden="true"
            className="relative size-9 shrink-0 overflow-hidden rounded-full bg-avatar/65 shadow-[0_0_0_2px_#fff,0_0_0_3px_rgb(168_148_122/0.45),0_2px_4px_rgb(28_25_23/0.15)]"
        >
            <svg viewBox="0 0 36 36" className="absolute inset-0 size-full">
                <circle cx="18" cy="14" r="5.5" className="fill-white/95" />
                <rect x="7.5" y="24" width="21" height="16" rx="8" className="fill-white/95" />
            </svg>
            <span className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 to-transparent" />
        </span>
    );
}