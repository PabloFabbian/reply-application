import Link from "next/link";
import { formatAverage, formatPercent } from "@/lib/format";
import type { Location } from "@/lib/reviews";
import type { LocationSummary } from "@/lib/summary";
import { LinkPending } from "@/components/link-pending";
import { glass } from "@/components/surface-styles";

type SummaryCardsProps = {
    summaries: LocationSummary[];
    locations: Location[];
    activeLocationId: string | null;
};

export function SummaryCards({ summaries, locations, activeLocationId }: SummaryCardsProps) {
    const restaurantNames = new Map(locations.map((location) => [location.id, location.restaurantName]));

    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {summaries.map((summary) => (
                <Link
                    key={summary.locationId}
                    href={`/?location=${summary.locationId}&status=pending`}
                    scroll={false}
                    className={`block rounded-lg p-4 transition-[border-color,box-shadow,background-color] duration-200 has-[[data-pending]]:border-accent ${cardClass(summary, activeLocationId)}`}
                >
                    <LinkPending />
                    <p className="text-xs text-ink-muted">{restaurantNames.get(summary.locationId)}</p>
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="font-medium">{summary.name}</p>
                        <p className="font-mono text-xs text-ink-muted tabular-nums">
                            {summary.total} {summary.total === 1 ? "reseña" : "reseñas"}
                        </p>
                    </div>

                    {summary.total === 0 ? (
                        <p className="mt-3 text-sm text-ink-muted">Sin reseñas todavía</p>
                    ) : (
                        <dl className="mt-3 grid grid-cols-3 gap-2">
                                <Stat
                                    label="Pendientes"
                                    value={String(summary.pending)}
                                    tone={summary.pending > 0 ? "accent" : "default"}
                                />
                                <Stat
                                    label="Promedio"
                                    value={summary.averageRating === null ? "Sin datos" : formatAverage(summary.averageRating)}
                                    tone={summary.averageRating !== null && summary.averageRating < 3 ? "alert" : "default"}
                                />
                                <Stat
                                    label="Respondidas"
                                    value={summary.answeredPercent === null ? "Sin datos" : formatPercent(summary.answeredPercent)}
                                />
                        </dl>
                    )}
                </Link>
            ))}
        </div>
    );
}

function cardClass(summary: LocationSummary, activeLocationId: string | null) {
    if (summary.locationId === activeLocationId) {
        return `border border-accent bg-surface/70 ring-1 ring-accent ${glass}`;
    }
    if (summary.total === 0) {
        return "border border-dashed border-line-strong bg-canvas/40 backdrop-blur-sm hover:bg-surface/50";
    }
    return `border border-white/80 bg-surface/40 hover:bg-surface/70 ${glass}`;
}

const statTones = {
    default: "text-ink",
    accent: "text-accent",
    alert: "font-medium text-red-700",
};

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: keyof typeof statTones }) {
    return (
        <div>
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className={`font-mono text-xl tabular-nums ${statTones[tone]}`}>{value}</dd>
        </div>
    );
}