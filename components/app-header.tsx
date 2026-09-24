import Link from "next/link";
import { formatLongDate } from "@/lib/format";

export function AppHeader() {
    return (
        <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/75 backdrop-blur-md">
            <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
                <Link
                    href="/"
                    className="group/logo flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                    <Logo />
                    <span className="text-sm font-semibold tracking-tight">Bandeja de reseñas</span>
                </Link>
                <p className="font-mono text-xs text-ink-muted first-letter:uppercase">{formatLongDate(new Date())}</p>
            </div>
        </header>
    );
}

function Logo() {
    return (
        <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-lg bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-transform duration-200 group-hover/logo:-rotate-6 motion-reduce:transition-none"
        >
            <svg viewBox="0 0 16 16" className="size-4">
                <path
                    d="M3 3.5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7l-3 2.5v-2.5H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                />
                <path d="M8 5.6l.7 1.4 1.5.2-1.1 1 .3 1.5L8 9l-1.4.7.3-1.5-1.1-1 1.5-.2z" fill="currentColor" />
            </svg>
        </span>
    );
}