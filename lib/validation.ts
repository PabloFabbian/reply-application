export const MAX_REPLY_LENGTH = 4096;

type ValidationResult = { ok: true; text: string } | { ok: false; error: string };

export function validateReplyText(value: unknown): ValidationResult {
    if (typeof value !== "string" || value.trim() === "") {
        return { ok: false, error: "La respuesta no puede estar vacía." };
    }

    const text = value.trim();

    if (text.length > MAX_REPLY_LENGTH) {
        return { ok: false, error: `La respuesta no puede superar los ${MAX_REPLY_LENGTH} caracteres.` };
    }

    return { ok: true, text };
}