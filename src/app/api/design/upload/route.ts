import { authOptions } from "@/lib/nexauth";
import { getFileNameFromUrl, supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { width, height, url } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
  
    const userId = session.user.id;
  
    try {
        const { data, error } = await supabase
            .from("uploads")
            .insert({
                width,
                height,
                url,
                user_id: userId
            })
            .select();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({data: data[0]},{ status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;
  
    try {
        const { data } = await supabase
            .from("uploads")
            .select("*")
            .eq('user_id', userId);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { url, id } = await req.json();
    try {

        const fileURL = getFileNameFromUrl(url)
        const { error } = await supabase
            .storage
            .from('mini-canva')
            .remove([`uploads/${fileURL}`]);

        if (error) return NextResponse.json({ error: "Error when delete image" }, { status: 500 });

        const { error: errorDeleteData } = await supabase
            .from("uploads")
            .delete()
            .eq("id", id);

        if (errorDeleteData) return NextResponse.json({ error: "Error when delete data" }, { status: 500 });
        return NextResponse.json({ message: "Successfully delete data" }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}