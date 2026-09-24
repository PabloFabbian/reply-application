"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
const SAVED_MESSAGE_MS = 2000;

type ReplyFormProps = {
    reviewId: string;
    aiEnabled: boolean;
};

type DraftStatus = "none" | "fresh" | "edited";

export function ReplyForm({ reviewId, aiEnabled }: ReplyFormProps) {
    const router = useRouter();
    const [text, setText] = useState("");
    const [draftStatus, setDraftStatus] = useState<DraftStatus>("none");
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const busy = generating || saving;

    async function handleDraft() {
        if (text.trim() !== "" && !window.confirm("¿Reemplazar lo que escribiste por un borrador nuevo?")) return;

        setGenerating(true);
        setError(null);

        const result = await post(`/api/reviews/${reviewId}/draft`);
        if (result.ok) {
            setText(result.body.draft);
            setDraftStatus("fresh");
        } else {
            setError(result.error);
        }

        setGenerating(false);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        const result = await post(`/api/reviews/${reviewId}/reply`, { text });
        if (result.ok) {
            setSaved(true);
            setTimeout(() => router.refresh(), SAVED_MESSAGE_MS);
            return;
        }

        setError(result.error);
        setSaving(false);
    }

    function handleChange(value: string) {
        setText(value);
        if (draftStatus === "fresh") setDraftStatus("edited");
    }

    if (saved) {
        return (
            <p className="font-mono text-sm text-emerald-700 motion-safe:animate-fade-in">
                Respuesta guardada.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {draftStatus !== "none" && (
                <p className="font-mono text-xs text-amber-800">
                    {draftStatus === "fresh" ? "Borrador generado con IA" : "Borrador de IA editado"} · todavía no se guardó
                </p>
            )}

            <textarea
                aria-label="Respuesta"
                className={`w-full rounded-md border p-2 text-sm placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    draftStatus === "none" ? "border-line bg-surface" : "border-amber-300 bg-amber-50"
                }`}
                rows={3}
                placeholder="Escribí tu respuesta o pedí un borrador…"
                value={text}
                disabled={generating}
                onChange={(event) => handleChange(event.target.value)}
            />

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={handleDraft}
                    disabled={busy || !aiEnabled}
                    className={secondaryButton}
                >
                    <SparkIcon />
                    {draftButtonLabel(aiEnabled, generating, draftStatus)}
                </button>

                <button type="submit" disabled={busy || text.trim() === ""} className={primaryButton}>
                    {saving ? "Guardando…" : "Guardar"}
                </button>
            </div>
        </form>
    );
}

function draftButtonLabel(aiEnabled: boolean, generating: boolean, draftStatus: DraftStatus) {
    if (!aiEnabled) return "IA no disponible";
    if (generating) return "Generando…";
    if (draftStatus !== "none") return "Otro borrador";
    return "Borrador con IA";
}

async function post(url: string, payload?: unknown) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload === undefined ? undefined : JSON.stringify(payload),
        });
        const body = await response.json().catch(() => null);

        if (!response.ok) {
            return { ok: false as const, error: body?.error ?? "Algo salió mal. Probá de nuevo." };
        }
        return { ok: true as const, body };
    } catch {
        return { ok: false as const, error: "No hay conexión. Revisá tu internet y probá de nuevo." };
    }
}

function SparkIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
            <path
                d="M8 1.5l1.4 3.6 3.6 1.4-3.6 1.4L8 11.5 6.6 7.9 3 6.5l3.6-1.4zM12.5 10.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"
                fill="currentColor"
            />
        </svg>
    );
}