import { ReplyForm } from "@/components/reply-form";
import type { StatusFilter } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import type { Location, Review } from "@/lib/reviews";
import { glass, insetPanel } from "@/components/surface-styles";
import { Avatar } from "@/components/avatar";

type ReviewListProps = {
    reviews: Review[];
    locations: Location[];
    aiEnabled: boolean;
    status: StatusFilter;
};

export function ReviewList({ reviews, locations, aiEnabled, status }: ReviewListProps) {
    if (reviews.length === 0) {
        return <p className="py-12 text-center text-sm text-ink-muted">{emptyMessage(status)}</p>;
    }

    const locationNames = new Map(
        locations.map((location) => [location.id, `${location.restaurantName} · ${location.name}`]),
    );

    return (
        <ul className="space-y-3">
            {reviews.map((review, index) => (
                <ReviewCard
                    key={review.id}
                    index={index}
                    review={review}
                    locationName={locationNames.get(review.location_id) ?? ""}
                    aiEnabled={aiEnabled}
                />
            ))}
        </ul>
    );
}

function ReviewCard({
    index,
    review,
    locationName,
    aiEnabled,
}: {
    index: number;
    review: Review;
    locationName: string;
    aiEnabled: boolean;
}) {
    const isAnswered = Boolean(review.reply_text && review.replied_at);

    return (
        <li
            className={`rounded-xl border bg-surface/75 p-4 motion-safe:animate-fade-in ${glass} ${isAnswered ? "border-white/80" : "border-accent-line"
                }`}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
            <div className="flex items-center gap-3">
                <Avatar />
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                        <p className="font-medium">{review.author}</p>
                        <p className="font-mono text-xs text-ink-muted">{formatDate(review.published_at)}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                        <span>{locationName}</span>
                        <RatingBadge rating={review.rating} />
                        {!isAnswered && (
                            <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-xs leading-none text-accent">
                                Sin responder
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-3 sm:pl-12">
                <p>{review.text || <span className="text-ink-muted italic">Sin comentario</span>}</p>

                <div className={insetPanel}>
                    {isAnswered ? (
                        <div className="text-sm">
                            <p className="font-mono text-xs text-ink-muted">Respondida el {formatDate(review.replied_at!)}</p>
                            <p className="mt-1">{review.reply_text}</p>
                        </div>
                    ) : (
                        <ReplyForm reviewId={review.id} aiEnabled={aiEnabled} />
                    )}
                </div>
            </div>
        </li>
    );
}

function RatingBadge({ rating }: { rating: number | null }) {
    if (rating === null) return <span>Sin calificación</span>;

    const tone = rating < 3 ? "border-red-200 bg-red-50 font-medium text-red-700" : "border-line bg-canvas text-ink";
    return <span className={`rounded border px-1.5 py-0.5 font-mono text-xs leading-none ${tone}`}>{rating} ★</span>;
}

function emptyMessage(status: StatusFilter) {
    if (status === "pending") return "No hay reseñas pendientes con estos filtros. Todo al día.";
    if (status === "answered") return "No hay reseñas respondidas con estos filtros.";
    return "Ninguna reseña coincide con estos filtros.";
}