import { createServerClient } from "@/lib/supabase";
import type { Filters } from "@/lib/filters";

export type Location = {
    id: string;
    name: string;
    restaurantName: string;
};

export type Review = {
    id: string;
    location_id: string;
    author: string;
    rating: number | null;
    text: string;
    published_at: string;
    reply_text: string | null;
    replied_at: string | null;
};

export async function getLocations(): Promise<Location[]> {
    const supabase = createServerClient();

    const [locations, restaurants] = await Promise.all([
        supabase.from("locations").select("id, name, restaurant_id").order("id"),
        supabase.from("restaurants").select("id, name"),
    ]);

    if (locations.error) throw new Error(`No se pudieron leer las sedes: ${locations.error.message}`);
    if (restaurants.error) throw new Error(`No se pudieron leer los restaurantes: ${restaurants.error.message}`);

    const restaurantNames = new Map(restaurants.data.map((restaurant) => [restaurant.id, restaurant.name]));

    return locations.data.map((location) => ({
        id: location.id,
        name: location.name,
        restaurantName: restaurantNames.get(location.restaurant_id) ?? "",
    }));
}

export async function getReviews(filters: Filters): Promise<Review[]> {
    const supabase = createServerClient();

    let query = supabase
        .from("reviews")
        .select("id, location_id, author, rating, text, published_at, reply_text, replied_at")
        .order("published_at", { ascending: false });

    if (filters.location) query = query.eq("location_id", filters.location);

    if (filters.rating === "none") query = query.is("rating", null);
    else if (filters.rating) query = query.eq("rating", filters.rating);

    if (filters.status === "pending") query = query.is("reply_text", null);
    if (filters.status === "answered") query = query.not("reply_text", "is", null);

    const { data, error } = await query;
    if (error) throw new Error(`No se pudieron leer las reseñas: ${error.message}`);

    return data;
}

export type SaveReplyResult = "saved" | "not_found" | "already_answered";

export async function saveReply(id: string, text: string): Promise<SaveReplyResult> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from("reviews")
        .update({ reply_text: text, replied_at: new Date().toISOString() })
        .eq("id", id)
        .is("reply_text", null)
        .select("id");

    if (error) throw new Error(`No se pudo guardar la respuesta: ${error.message}`);
    if (data.length > 0) return "saved";

    const { data: existing, error: readError } = await supabase
        .from("reviews")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (readError) throw new Error(`No se pudo leer la reseña: ${readError.message}`);
    return existing ? "already_answered" : "not_found";
}