"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ReplyForm({ reviewId }: { reviewId: string }) {
    const router = useRouter();
    const [text, setText] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/reviews/${reviewId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                setError(body?.error ?? "No se pudo guardar la respuesta.");
                return;
            }

            router.refresh();
        } catch {
            setError("No hay conexión. Revisá tu internet y probá de nuevo.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <textarea
                aria-label="Respuesta"
                className="w-full rounded-md border border-neutral-300 p-2 text-sm"
                rows={3}
                placeholder="Escribí tu respuesta…"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button
                type="submit"
                disabled={saving || text.trim() === ""}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-40"
            >
                {saving ? "Guardando…" : "Guardar respuesta"}
            </button>
        </form>
    );
}