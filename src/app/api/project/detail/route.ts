import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    try {
        const query = supabase
            .from("projects")
            .select('*')
            .eq("id", id)
            .maybeSingle();
        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server project route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { title, id } = await req.json();
    try {
        const query = supabase
            .from("projects")
            .update({ title })
            .eq("id", id)
        const { error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error, "error server project route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

