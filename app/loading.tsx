export default function Loading() {
    return (
        <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8" aria-busy="true">
            <h1 className="text-xl font-semibold">Reseñas</h1>

                <div className="grid gap-3 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
                            <Line width="w-1/3" />
                            <Line width="w-1/2" />
                            <Line width="w-full" />
                        </div>
                    ))}
                </div>

                <p className="text-sm text-neutral-500">Cargando reseñas…</p>

                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
                            <Line width="w-1/4" />
                            <Line width="w-full" />
                            <Line width="w-2/3" />
                        </div>
                    ))}
                </div>
        </main>
    );
}

function Line({ width }: { width: string }) {
    return <div className={`h-3 animate-pulse rounded bg-neutral-100 ${width}`} />;
}