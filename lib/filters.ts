export type StatusFilter = "pending" | "answered" | "all";
export type RatingFilter = 1 | 2 | 3 | 4 | 5 | "none";

export type Filters = {
    status: StatusFilter;
    location: string | null;
    rating: RatingFilter | null;
};

export type SearchParams = Record<string, string | string[] | undefined>;

export function parseFilters(params: SearchParams): Filters {
    return {
        status: parseStatus(first(params.status)),
        location: first(params.location) || null,
        rating: parseRating(first(params.rating)),
    };
}

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): StatusFilter {
    if (value === "answered" || value === "all") return value;
    return "pending";
}

function parseRating(value: string | undefined): RatingFilter | null {
    if (value === "none") return "none";

    const rating = Number(value);
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) return rating as RatingFilter;
    return null;
}