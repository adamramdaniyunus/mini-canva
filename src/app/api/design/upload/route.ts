import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { width, height, url } = await req.json();
    try {
        const { error } = await supabase
            .from("uploads")
            .insert({
                width,
                height,
                url,
                user_id: "5edf1eff-69b2-481a-800f-81860d8b9f4f"
            });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        // Check if data is null or undefined
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data } = await supabase
            .from("uploads")
            .select("*")
            .eq('user_id', '5edf1eff-69b2-481a-800f-81860d8b9f4f');
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}