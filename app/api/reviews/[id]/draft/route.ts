import { NextResponse } from "next/server";
import { generateText, isAiConfigured } from "@/lib/ai";
import { buildDraftMessages } from "@/lib/draft-prompt";
import { getReviewForDraft } from "@/lib/reviews";

type Context = {
    params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Context) {
    if (!isAiConfigured()) {
        return NextResponse.json(
            { error: "El borrador con IA no está configurado. Falta la variable GROQ_API_KEY." },
            { status: 503 },
        );
    }

    const { id } = await params;

    try {
        const review = await getReviewForDraft(id);

        if (!review) {
            return NextResponse.json({ error: "La reseña no existe." }, { status: 404 });
        }
        if (review.isAnswered) {
            return NextResponse.json({ error: "Esta reseña ya fue respondida." }, { status: 409 });
        }

        const draft = await generateText(buildDraftMessages(review));
        return NextResponse.json({ draft });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "No se pudo generar el borrador. Probá de nuevo en unos segundos." },
            { status: 502 },
        );
    }
}