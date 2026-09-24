import type { ReactNode } from "react";
import { FilterBar } from "@/components/filter-bar";
import { ReviewList } from "@/components/review-list";
import { SummaryCards } from "@/components/summary-cards";
import { isAiConfigured } from "@/lib/ai";
import { parseFilters, type SearchParams } from "@/lib/filters";
import { getLocations, getReviews, getSummaryReviews } from "@/lib/reviews";
import { summarizeLocations } from "@/lib/summary";

type HomeProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: HomeProps) {
  const filters = parseFilters(await searchParams);
  const [locations, reviews, summaryReviews] = await Promise.all([
    getLocations(),
    getReviews(filters),
    getSummaryReviews(),
  ]);
  const summaries = summarizeLocations(locations, summaryReviews);
  const pendingTotal = summaries.reduce((sum, summary) => sum + summary.pending, 0);

  return (
    <main className="group mx-auto w-full max-w-3xl space-y-8 px-4 py-8 motion-safe:animate-fade-in">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <Headline pending={pendingTotal} />
        </h1>
        {pendingTotal > 0 && (
          <p className="text-sm text-ink-muted">Las de calificación baja están marcadas en rojo.</p>
        )}
      </section>

      <section className="space-y-3">
        <SectionLabel>Sedes</SectionLabel>
        <SummaryCards summaries={summaries} locations={locations} activeLocationId={filters.location} />
      </section>

      <section className="space-y-3">
        <SectionLabel>Reseñas</SectionLabel>
        <FilterBar locations={locations} filters={filters} />

        <div
          aria-hidden="true"
          className="h-0.5 overflow-hidden rounded-full opacity-0 transition-opacity group-has-[[data-pending]]:opacity-100 group-has-[[data-pending]]:delay-150"
        >
          <div className="h-full w-1/3 rounded-full bg-ink motion-safe:animate-progress" />
        </div>

        <div className="transition-opacity duration-200 group-has-[[data-pending]]:opacity-70 group-has-[[data-pending]]:delay-150">
          <ReviewList
            reviews={reviews}
            locations={locations}
            aiEnabled={isAiConfigured()}
            status={filters.status}
          />
        </div>
      </section>
    </main>
  );
}

function Headline({ pending }: { pending: number }) {
  if (pending === 0) return <>Está todo respondido</>;

  return (
    <>
      Tenés <span className="text-accent">{pending} {pending === 1 ? "reseña" : "reseñas"}</span> sin responder
    </>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="font-mono text-xs text-ink-muted">{children}</h2>;
}