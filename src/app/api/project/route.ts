import { authOptions } from "@/lib/nexauth";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const recent = searchParams.get("recent");

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;
    try {
        const query = supabase
            .from("projects")
            .select()
            .eq("user_id", userId)
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
