const buttonBase =
    "inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 sm:h-9";

export const primaryButton = `${buttonBase} bg-ink text-canvas hover:bg-ink/85 disabled:hover:bg-ink`;
export const secondaryButton = `${buttonBase} border border-line bg-surface text-ink hover:border-line-strong`;