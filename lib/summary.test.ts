import { describe, expect, it } from "vitest";
import { summarizeLocations } from "./summary";

const palermo = { id: "loc-1", name: "Palermo" };
const belgrano = { id: "loc-2", name: "Belgrano" };

function review(locationId: string, rating: number | null, replyText: string | null = null) {
    return { location_id: locationId, rating, reply_text: replyText };
}

describe("summarizeLocations", () => {
    it("calcula total, promedio y porcentaje respondido", () => {
        const [summary] = summarizeLocations(
            [palermo],
            [review("loc-1", 5, "Gracias"), review("loc-1", 2), review("loc-1", 4), review("loc-1", 1)],
        );

        expect(summary.total).toBe(4);
        expect(summary.pending).toBe(3);
        expect(summary.averageRating).toBe(3);
        expect(summary.answeredPercent).toBe(25);
    });

    it("una sede sin reseñas no tiene promedio ni porcentaje", () => {
        const [summary] = summarizeLocations([belgrano], []);

        expect(summary.total).toBe(0);
        expect(summary.pending).toBe(0);
        expect(summary.averageRating).toBeNull();
        expect(summary.answeredPercent).toBeNull();
    });

    it("una reseña sin calificación cuenta en el total pero no en el promedio", () => {
        const [summary] = summarizeLocations([palermo], [review("loc-1", 5), review("loc-1", null)]);

        expect(summary.total).toBe(2);
        expect(summary.averageRating).toBe(5);
    });

    it("si ninguna reseña tiene calificación, el promedio es nulo", () => {
        const [summary] = summarizeLocations([palermo], [review("loc-1", null)]);

        expect(summary.total).toBe(1);
        expect(summary.averageRating).toBeNull();
    });

    it("solo cuenta las reseñas de cada sede", () => {
        const [first, second] = summarizeLocations(
            [palermo, belgrano],
            [review("loc-1", 4), review("loc-1", 2)],
        );

        expect(first.total).toBe(2);
        expect(second.total).toBe(0);
    });
});