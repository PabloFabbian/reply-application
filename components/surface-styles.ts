const glassShadow =
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_1px_2px_rgb(60_50_40/0.06),0_4px_12px_rgb(60_50_40/0.05)]";

const glassShadowHover =
    "hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_2px_4px_rgb(60_50_40/0.08),0_12px_28px_rgb(60_50_40/0.1)]";

export const litSurface = "bg-linear-to-b from-surface/70 to-surface/40";

export const glass = `backdrop-blur-md ${glassShadow}`;

export const interactiveGlass = `${glass} ${glassShadowHover} transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0`;

export const raisedGlass =
    "backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_1px_2px_rgb(60_50_40/0.08),0_12px_32px_rgb(60_50_40/0.1)]";

export const insetPanel = "rounded-lg border border-ink/10 bg-surface/55 p-3";