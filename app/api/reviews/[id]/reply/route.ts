import { NextResponse } from "next/server";
import { saveReply } from "@/lib/reviews";
import { validateReplyText } from "@/lib/validation";

type Context = {
    params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Context) {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    const validation = validateReplyText(body?.text);
    if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    try {
        const result = await saveReply(id, validation.text);

        if (result === "not_found") {
            return NextResponse.json({ error: "La reseña no existe." }, { status: 404 });
        }
        if (result === "already_answered") {
            return NextResponse.json({ error: "Esta reseña ya fue respondida." }, { status: 409 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "No se pudo guardar la respuesta. Probá de nuevo." }, { status: 500 });
    }
}