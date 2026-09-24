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

  return (
    <main className="group mx-auto w-full max-w-3xl space-y-6 px-4 py-8 motion-safe:animate-fade-in">
      <h1 className="text-xl font-semibold">Reseñas</h1>
      <SummaryCards summaries={summaries} locations={locations} activeLocationId={filters.location} />
      <FilterBar locations={locations} filters={filters} />
      <div className="transition-opacity group-has-[[data-pending]]:opacity-50">
        <ReviewList reviews={reviews} locations={locations} aiEnabled={isAiConfigured()} />
      </div>
    </main>
  );
}