import { readFileSync } from "node:fs";
import { prepareImport, type RawData, type ReplyRow } from "@/lib/import-data";
import { createServerClient } from "@/lib/supabase";

const FILE_PATH = "data/reviews.json";

type Client = ReturnType<typeof createServerClient>;
type Prepared = ReturnType<typeof prepareImport>;

async function main() {
    const data: RawData = JSON.parse(readFileSync(FILE_PATH, "utf-8"));
    const prepared = prepareImport(data);
    const supabase = createServerClient();

    await upsert(supabase, "restaurants", prepared.restaurants);
    await upsert(supabase, "locations", prepared.locations);
    await upsert(supabase, "reviews", prepared.reviews);
    await importReplies(supabase, prepared.replies);

    printReport(prepared);
}

async function upsert(supabase: Client, table: string, rows: object[]) {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`Error al importar ${table}: ${error.message}`);
}

async function importReplies(supabase: Client, replies: ReplyRow[]) {
    for (const reply of replies) {
        const { error } = await supabase
            .from("reviews")
            .update({ reply_text: reply.reply_text, replied_at: reply.replied_at })
            .eq("id", reply.id)
            .is("reply_text", null);

        if (error) throw new Error(`Error al importar la respuesta de ${reply.id}: ${error.message}`);
    }
}

function printReport(prepared: Prepared) {
    console.log(`Reseñas importadas: ${prepared.reviews.length}`);
    console.log(`Duplicados unificados: ${prepared.duplicates.join(", ") || "ninguno"}`);

    if (prepared.skipped.length === 0) {
        console.log("Salteadas: ninguna");
        return;
    }

    console.log(`Salteadas: ${prepared.skipped.length}`);
    for (const skipped of prepared.skipped) {
        console.log(`  - ${skipped.id}: ${skipped.reason}`);
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});