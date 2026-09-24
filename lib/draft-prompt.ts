export type DraftInput = {
    restaurantName: string;
    author: string;
    rating: number | null;
    text: string;
};

export type ChatMessage = {
    role: "system" | "user";
    content: string;
};

const SYSTEM_PROMPT = [
    "Escribís respuestas públicas a reseñas de Google en nombre de un restaurante de Buenos Aires.",
    "Escribí en español rioplatense: usá el voseo y el futuro con «vamos a» («vamos a revisarlo», no «lo revisaremos»).",
    "Empezá con «Hola,» y el nombre de pila del cliente.",
    "Tono cálido y profesional. Después del saludo, máximo tres oraciones. Sin firma.",
    "No inventes nada que no esté en la reseña: ni descuentos, ni promociones, ni nombres del personal, ni datos de contacto, ni promesas concretas.",
    "Devolvé solo el texto de la respuesta.",
].join("\n");

export function buildDraftMessages(input: DraftInput): ChatMessage[] {
    return [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: describeReview(input) },
    ];
}

function describeReview(input: DraftInput) {
    const rating = input.rating === null ? "sin calificación" : `${input.rating} de 5`;
    const text = input.text.trim() || "(el cliente no dejó comentario, solo la calificación)";

    return [
        `Restaurante: ${input.restaurantName}`,
        `Cliente: ${firstName(input.author)}`,
        `Calificación: ${rating}`,
        `Reseña: ${text}`,
        "",
        `Cómo responder: ${toneFor(input.rating)}`,
    ].join("\n");
}

function toneFor(rating: number | null) {
    if (rating === null) {
        return "No hay calificación: guiate por el texto de la reseña.";
    }
    if (rating <= 2) {
        return "Fue una mala experiencia. Pedí disculpas sin excusas, reconocé el problema puntual que menciona y decile que lo vamos a revisar.";
    }
    if (rating === 3) {
        return "Fue una experiencia regular. Agradecé, reconocé la crítica concreta y contá que la vamos a tener en cuenta.";
    }
    return "Fue una buena experiencia. Agradecé con calidez, mencioná algo concreto que haya destacado e invitalo a volver.";
}

function firstName(author: string) {
    return author.split(" ")[0];
}