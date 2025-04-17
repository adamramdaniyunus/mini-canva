import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { width, height } = await req.json();
    try {
        const { data, error } = await supabase.rpc('create_new_design', {
            user_id: "5edf1eff-69b2-481a-800f-81860d8b9f4f",
            width,
            height
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        // Check if data is null or undefined
        if (!data) return NextResponse.json({ error: "No data returned" }, { status: 500 });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}