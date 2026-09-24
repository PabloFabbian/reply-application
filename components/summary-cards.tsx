import Link from "next/link";
import { formatAverage, formatPercent } from "@/lib/format";
import type { Location } from "@/lib/reviews";
import type { LocationSummary } from "@/lib/summary";

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
                    className={`block rounded-lg border bg-white p-4 hover:border-neutral-400 ${summary.locationId === activeLocationId ? "border-neutral-900" : "border-neutral-200"
                        }`}
                >
                    <p className="text-xs text-neutral-500">{restaurantNames.get(summary.locationId)}</p>
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="font-medium">{summary.name}</p>
                        <p className="text-xs text-neutral-500 tabular-nums">
                            {summary.total} {summary.total === 1 ? "reseña" : "reseñas"}
                        </p>
                    </div>

                    {summary.total === 0 ? (
                        <p className="mt-3 text-sm text-neutral-500">Sin reseñas todavía</p>
                    ) : (
                        <dl className="mt-3 grid grid-cols-3 gap-2">
                            <Stat label="Pendientes" value={String(summary.pending)} />
                            <Stat
                                label="Promedio"
                                value={summary.averageRating === null ? "Sin datos" : formatAverage(summary.averageRating)}
                                alert={summary.averageRating !== null && summary.averageRating < 3}
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

function Stat({ label, value, alert = false }: { label: string; value: string; alert?: boolean }) {
    return (
        <div>
            <dt className="text-xs text-neutral-500">{label}</dt>
            <dd className={`text-lg font-semibold tabular-nums ${alert ? "text-red-700" : ""}`}>{value}</dd>
        </div>
    );
}