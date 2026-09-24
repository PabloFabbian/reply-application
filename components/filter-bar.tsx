"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type ReactNode } from "react";
import { parseFilters, type Filters, type StatusFilter } from "@/lib/filters";
import type { Location } from "@/lib/reviews";

type FilterBarProps = {
    locations: Location[];
    filters: Filters;
};

const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "pending", label: "Sin responder" },
    { value: "answered", label: "Respondidas" },
    { value: "all", label: "Todas" },
];

export function FilterBar({ locations, filters }: FilterBarProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [current, setCurrent] = useOptimistic(filters);

    function updateFilter(key: keyof Filters, value: string) {
        const next = {
            status: current.status,
            location: current.location ?? "",
            rating: current.rating?.toString() ?? "",
            [key]: value,
        };
        const params = new URLSearchParams(Object.entries(next).filter(([, v]) => v !== ""));

        startTransition(() => {
            setCurrent(parseFilters(Object.fromEntries(params)));
            router.push(`/?${params}`, { scroll: false });
        });
    }

    const selectedIndex = statusOptions.findIndex((option) => option.value === current.status);

    return (
        <div className="flex flex-wrap items-center gap-2" data-pending={isPending ? "" : undefined}>
            <div
                role="group"
                aria-label="Estado"
                className="relative grid h-9 grid-cols-3 rounded-md border border-line bg-surface p-0.5"
            >
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded bg-ink transition-transform duration-200 ease-out motion-reduce:transition-none"
                    style={{ transform: `translateX(${selectedIndex * 100}%)` }}
                />
                {statusOptions.map((option) => {
                    const selected = current.status === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => updateFilter("status", option.value)}
                            className={`relative rounded px-3 text-sm whitespace-nowrap transition-colors duration-200 ${selected ? "text-canvas" : "text-ink-muted hover:text-ink"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <Select label="Sede" value={current.location ?? ""} onChange={(value) => updateFilter("location", value)}>
                <option value="">Todas las sedes</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                        {location.restaurantName} · {location.name}
                    </option>
                ))}
            </Select>

            <Select
                label="Calificación"
                value={current.rating?.toString() ?? ""}
                onChange={(value) => updateFilter("rating", value)}
            >
                <option value="">Todas las calificaciones</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                        {rating} {rating === 1 ? "estrella" : "estrellas"}
                    </option>
                ))}
                <option value="none">Sin calificación</option>
            </Select>

            <span className="sr-only" aria-live="polite">
                {isPending ? "Actualizando reseñas…" : ""}
            </span>
        </div>
    );
}

type SelectProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
};

function Select({ label, value, onChange, children }: SelectProps) {
    return (
        <div className="relative">
            <select
                aria-label={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="select h-9 appearance-none rounded-md border border-line bg-surface pr-8 pl-3 text-sm whitespace-nowrap text-ink transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                {children}
            </select>
            <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted"
            >
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}