"use client";

import { useRouter } from "next/navigation";
import type { Filters } from "@/lib/filters";
import type { Location } from "@/lib/reviews";

type FilterBarProps = {
    locations: Location[];
    filters: Filters;
};

const selectClass = "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm";

export function FilterBar({ locations, filters }: FilterBarProps) {
    const router = useRouter();

    function updateFilter(key: keyof Filters, value: string) {
        const next = {
            status: filters.status,
            location: filters.location ?? "",
            rating: filters.rating?.toString() ?? "",
            [key]: value,
        };
        const params = new URLSearchParams(Object.entries(next).filter(([, v]) => v !== ""));
        router.push(`/?${params}`);
    }

    return (
        <div className="flex flex-wrap gap-2">
            <select
                aria-label="Estado"
                className={selectClass}
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
            >
                <option value="pending">Sin responder</option>
                <option value="answered">Respondidas</option>
                <option value="all">Todas</option>
            </select>

            <select
                aria-label="Sede"
                className={selectClass}
                value={filters.location ?? ""}
                onChange={(event) => updateFilter("location", event.target.value)}
            >
                <option value="">Todas las sedes</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                        {location.restaurantName} · {location.name}
                    </option>
                ))}
            </select>

            <select
                aria-label="Calificación"
                className={selectClass}
                value={filters.rating?.toString() ?? ""}
                onChange={(event) => updateFilter("rating", event.target.value)}
            >
                <option value="">Todas las calificaciones</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                        {rating} {rating === 1 ? "estrella" : "estrellas"}
                    </option>
                ))}
                <option value="none">Sin calificación</option>
            </select>
        </div>
    );
}