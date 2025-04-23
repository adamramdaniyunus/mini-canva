import { authOptions } from "@/lib/nexauth";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const { password } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    try {
        const query = supabase
            .from("users")
            .update({ password: hashedPassword })
            .eq("id", userId)
        const { error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error, "error server project route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
