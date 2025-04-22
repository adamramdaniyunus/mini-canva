import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        const query = supabase
            .from("elements")
            .select("*")
            .eq("main_frame_id", id)
            
        const { data, error } = await query;

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}