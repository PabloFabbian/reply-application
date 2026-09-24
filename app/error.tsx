"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { primaryButton } from "@/components/button-styles";

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
    const router = useRouter();

    function retry() {
        startTransition(() => {
            router.refresh();
            reset();
        });
    }

    return (
        <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
            <h1 className="text-xl font-semibold">Reseñas</h1>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
                <p className="font-medium">No pudimos cargar las reseñas.</p>
                <p className="mt-1 text-sm text-neutral-500">
                    Puede ser un problema de conexión con la base de datos. Probá de nuevo en unos segundos.
                </p>
                <button onClick={retry} className={`mt-4 ${primaryButton}`}>
                    Reintentar
                </button>
            </div>
        </main>
    );
}