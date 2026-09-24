export type RawReview = {
    id: string;
    location_id: string;
    author: string;
    rating: number | null;
    text: string;
    published_at: string;
    updated_at: string;
    reply: { text: string; replied_at: string } | null;
};

export type RawData = {
    restaurants: { id: string; name: string }[];
    locations: { id: string; restaurant_id: string; name: string }[];
    reviews: RawReview[];
};

export type ReviewRow = {
    id: string;
    location_id: string;
    author: string;
    rating: number | null;
    text: string;
    published_at: string;
    updated_at: string;
};

export type ReplyRow = {
    id: string;
    reply_text: string;
    replied_at: string;
};

export type SkippedReview = { id: string; reason: string };

export function prepareImport(data: RawData) {
    const locationIds = new Set(data.locations.map((location) => location.id));
    const { reviews, duplicates } = keepLatestVersion(data.reviews);

    const rows: ReviewRow[] = [];
    const replies: ReplyRow[] = [];
    const skipped: SkippedReview[] = [];

    for (const review of reviews) {
        if (!locationIds.has(review.location_id)) {
            skipped.push({ id: review.id, reason: `la sede ${review.location_id} no existe` });
            continue;
        }
        rows.push(toRow(review));
        if (review.reply) replies.push(toReply(review.id, review.reply));
    }

    return {
        restaurants: data.restaurants,
        locations: data.locations,
        reviews: rows,
        replies,
        skipped,
        duplicates,
    };
}

function keepLatestVersion(reviews: RawReview[]) {
    const latest = new Map<string, RawReview>();
    const duplicates = new Set<string>();

    for (const review of reviews) {
        const current = latest.get(review.id);
        if (current) duplicates.add(review.id);

        if (!current || Date.parse(review.updated_at) > Date.parse(current.updated_at)) {
            latest.set(review.id, review);
        }
    }

    return { reviews: [...latest.values()], duplicates: [...duplicates] };
}

function toRow(review: RawReview): ReviewRow {
    return {
        id: review.id,
        location_id: review.location_id,
        author: review.author,
        rating: review.rating,
        text: review.text ?? "",
        published_at: review.published_at,
        updated_at: review.updated_at,
    };
}

function toReply(id: string, reply: NonNullable<RawReview["reply"]>): ReplyRow {
    return { id, reply_text: reply.text, replied_at: reply.replied_at };
}