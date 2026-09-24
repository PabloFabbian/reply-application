import { FilterBar } from "@/components/filter-bar";
import { ReviewList } from "@/components/review-list";
import { parseFilters, type SearchParams } from "@/lib/filters";
import { getLocations, getReviews } from "@/lib/reviews";

type HomeProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: HomeProps) {
  const filters = parseFilters(await searchParams);
  const [locations, reviews] = await Promise.all([getLocations(), getReviews(filters)]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-semibold">Reseñas</h1>
      <FilterBar locations={locations} filters={filters} />
      <ReviewList reviews={reviews} locations={locations} />
    </main>
  );
}