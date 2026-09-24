export type SummaryLocation = { id: string; name: string };

export type SummaryReview = {
    location_id: string;
    rating: number | null;
    reply_text: string | null;
};

export type LocationSummary = {
    locationId: string;
    name: string;
    total: number;
    pending: number;
    averageRating: number | null;
    answeredPercent: number | null;
};

export function summarizeLocations(
    locations: SummaryLocation[],
    reviews: SummaryReview[],
): LocationSummary[] {
    return locations.map((location) =>
        summarizeLocation(location, reviews.filter((review) => review.location_id === location.id)),
    );
}

function summarizeLocation(location: SummaryLocation, reviews: SummaryReview[]): LocationSummary {
    const answered = reviews.filter((review) => review.reply_text !== null).length;

    return {
        locationId: location.id,
        name: location.name,
        total: reviews.length,
        pending: reviews.length - answered,
        averageRating: averageRating(reviews),
        answeredPercent: reviews.length === 0 ? null : (answered / reviews.length) * 100,
    };
}

function averageRating(reviews: SummaryReview[]) {
    const ratings = reviews
        .map((review) => review.rating)
        .filter((rating): rating is number => rating !== null);

    if (ratings.length === 0) return null;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}