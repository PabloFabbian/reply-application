import { Avatar } from "@/components/avatar";
import { ReplyForm } from "@/components/reply-form";
import { glass, insetPanel } from "@/components/surface-styles";
import type { Filters, StatusFilter } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import type { Location, Review } from "@/lib/reviews";

type ReviewListProps = {
    reviews: Review[];
    locations: Location[];
    aiEnabled: boolean;
    filters: Filters;
};

type VisibleDetails = {
    location: boolean;
    rating: boolean;
    pending: boolean;
};

export function ReviewList({ reviews, locations, aiEnabled, filters }: ReviewListProps) {
    if (reviews.length === 0) {
        return <p className="py-12 text-center text-sm text-ink-muted">{emptyMessage(filters.status)}</p>;
    }

    const locationNames = new Map(
        locations.map((location) => [location.id, `${location.restaurantName} · ${location.name}`]),
    );

    const visible: VisibleDetails = {
        location: filters.location === null,
        rating: filters.rating === null,
        pending: filters.status === "all",
    };

    return (
        <ul className="space-y-3">
            {reviews.map((review, index) => (
                <ReviewCard
                    key={review.id}
                    index={index}
                    review={review}
                    locationName={locationNames.get(review.location_id) ?? ""}
                    aiEnabled={aiEnabled}
                    visible={visible}
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
    visible,
}: {
    index: number;
    review: Review;
    locationName: string;
    aiEnabled: boolean;
    visible: VisibleDetails;
}) {
    const isAnswered = Boolean(review.reply_text && review.replied_at);

    return (
        <li
            className={`overflow-hidden rounded-xl border bg-surface/75 motion-safe:animate-fade-in ${glass} ${isAnswered ? "border-white/80" : "border-accent-line"
                }`}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
            <div className="flex items-baseline justify-between gap-3 border-b border-line/70 bg-canvas/50 px-4 py-2 font-mono text-xs text-ink-muted">
                {visible.location && <span className="truncate">{locationName}</span>}
                <span className="ml-auto shrink-0">{formatDate(review.published_at)}</span>
            </div>

            <div className="space-y-3 p-4">
                <div className="flex items-center gap-2.5">
                    <Avatar />
                    <p className="min-w-0 flex-1 truncate font-medium">{review.author}</p>
                    {visible.rating && <RatingBadge rating={review.rating} />}
                    {visible.pending && !isAnswered && <PendingBadge />}
                </div>

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
    if (rating === null) {
        return <span className="shrink-0 text-xs text-ink-muted">Sin calificación</span>;
    }

    const tone = rating < 3 ? "border-red-200 bg-red-50 font-medium text-red-700" : "border-line bg-canvas text-ink";
    return (
        <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs leading-none ${tone}`}>{rating} ★</span>
    );
}

function PendingBadge() {
    return (
        <span className="shrink-0 rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-xs leading-none text-accent">
            Sin responder
        </span>
    );
}

function emptyMessage(status: StatusFilter) {
    if (status === "pending") return "No hay reseñas pendientes con estos filtros. Todo al día.";
    if (status === "answered") return "No hay reseñas respondidas con estos filtros.";
    return "Ninguna reseña coincide con estos filtros.";
}