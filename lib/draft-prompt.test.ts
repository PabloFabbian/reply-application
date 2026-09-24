import { describe, expect, it } from "vitest";
import { buildDraftMessages } from "./draft-prompt";

function userMessage(rating: number | null, text = "La comida estuvo bien.") {
    const messages = buildDraftMessages({ restaurantName: "La Parrilla del Sur", author: "Mariana G.", rating, text });
    return messages[1].content;
}

describe("buildDraftMessages", () => {
    it("incluye el restaurante, el nombre de pila y la calificación", () => {
        const message = userMessage(5);

        expect(message).toContain("La Parrilla del Sur");
        expect(message).toContain("Cliente: Mariana");
        expect(message).toContain("5 de 5");
    });

    it("pide disculpas en una reseña de una estrella y no en una de cinco", () => {
        expect(userMessage(1)).toContain("disculpas");
        expect(userMessage(5)).not.toContain("disculpas");
    });

    it("avisa cuando la reseña no tiene calificación", () => {
        expect(userMessage(null)).toContain("sin calificación");
    });

    it("avisa cuando la reseña no tiene comentario", () => {
        expect(userMessage(5, "   ")).toContain("no dejó comentario");
    });
});