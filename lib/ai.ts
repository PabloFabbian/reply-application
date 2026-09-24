import type { ChatMessage } from "@/lib/draft-prompt";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
const TIMEOUT_MS = 20_000;

export function isAiConfigured() {
    return Boolean(process.env.GROQ_API_KEY);
}

export async function generateText(messages: ChatMessage[]): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Falta GROQ_API_KEY.");

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
            reasoning_effort: "low",
            max_completion_tokens: 1024,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`Groq respondió ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) throw new Error("Groq devolvió una respuesta vacía.");
    return text;
}