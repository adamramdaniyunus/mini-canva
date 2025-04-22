import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const recent = searchParams.get("recent");

    try {
        const query = supabase
            .from("projects")
            .select()
            .eq("user_id", "5edf1eff-69b2-481a-800f-81860d8b9f4f")
            .order("updated_at", { ascending: false });

        if (recent === "true") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isoToday = today.toISOString();

            // dibuat dan diedit hari ini
            query.or(`created_at.gte.${isoToday},updated_at.gte.${isoToday}`);
        }

        const { data, error } = await query;

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
