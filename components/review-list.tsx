import { ReplyForm } from "@/components/reply-form";
import type { StatusFilter } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import type { Location, Review } from "@/lib/reviews";

type ReviewListProps = {
    reviews: Review[];
    locations: Location[];
    aiEnabled: boolean;
    status: StatusFilter;
};

export function ReviewList({ reviews, locations, aiEnabled, status }: ReviewListProps) {
    if (reviews.length === 0) {
        return <p className="py-12 text-center text-sm text-neutral-500">{emptyMessage(status)}</p>;
    }

    const locationNames = new Map(
        locations.map((location) => [location.id, `${location.restaurantName} · ${location.name}`]),
    );

    return (
        <ul className="space-y-3">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    locationName={locationNames.get(review.location_id) ?? ""}
                    aiEnabled={aiEnabled}
                />
            ))}
        </ul>
    );
}

function ReviewCard({ review, locationName, aiEnabled }: { review: Review; locationName: string; aiEnabled: boolean }) {
    return (
        <li className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium">{review.author}</p>
                <p className="text-sm text-neutral-500">{formatDate(review.published_at)}</p>
            </div>

            <p className="text-sm text-neutral-500">
                {locationName} · <RatingLabel rating={review.rating} />
            </p>

            <p className="mt-2">
                {review.text || <span className="text-neutral-400 italic">Sin comentario</span>}
            </p>

            {review.reply_text && review.replied_at ? (
                <div className="mt-3 border-l-2 border-neutral-300 pl-3 text-sm">
                    <p className="text-neutral-500">Respondida el {formatDate(review.replied_at)}</p>
                    <p className="mt-1">{review.reply_text}</p>
                </div>
            ) : (
                <ReplyForm reviewId={review.id} aiEnabled={aiEnabled} />
            )}
        </li>
    );
}

function RatingLabel({ rating }: { rating: number | null }) {
    if (rating === null) return <span>Sin calificación</span>;
    return <span className={rating < 3 ? "font-medium text-red-700" : ""}>{rating} ★</span>;
}

function emptyMessage(status: StatusFilter) {
    if (status === "pending") return "No hay reseñas pendientes con estos filtros. Todo al día.";
    if (status === "answered") return "No hay reseñas respondidas con estos filtros.";
    return "Ninguna reseña coincide con estos filtros.";
}