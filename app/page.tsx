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
    <main className="group mx-auto w-full max-w-3xl space-y-6 px-4 py-8 motion-safe:animate-fade-in">
      <header className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold">Reseñas</h1>
        <p className="text-sm text-neutral-500 tabular-nums">{pendingLabel(pendingTotal)}</p>
      </header>
      <SummaryCards summaries={summaries} locations={locations} activeLocationId={filters.location} />
      <FilterBar locations={locations} filters={filters} />
      <div className="transition-opacity group-has-[[data-pending]]:opacity-50">
        <ReviewList reviews={reviews} locations={locations} aiEnabled={isAiConfigured()} status={filters.status} />
      </div>
    </main>
  );
}

function pendingLabel(count: number) {
  if (count === 0) return "Todo al día";
  return `${count} sin responder`;
}