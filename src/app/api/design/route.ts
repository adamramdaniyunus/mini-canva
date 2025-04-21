import { supabase } from "@/lib/supabase";
import { ElementComponent } from "@/types/Element.type";
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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const recent = searchParams.get("recent");

    try {
        const query = supabase
            .from("projects")
            .select()
            .eq("user_id", "5edf1eff-69b2-481a-800f-81860d8b9f4f")
            .order("created_at", { ascending: false });

        if (recent === "true") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isoToday = today.toISOString();

            query.gte("created_at", isoToday);
        }

        const { data, error } = await query;

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log(error, "error server design route");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { mainFrame, components } = await req.json();
    try {
        // Update main frame
        await supabase
            .from("main_frames")
            .update({
                width: mainFrame.width,
                height: mainFrame.height,
                background_color: mainFrame.background_color,
                background_image: mainFrame.background_image,
                updated_at: new Date().toISOString(), // optional
            })
            .eq("id", mainFrame.id);

        // Delete old elements (safe even if none exist)
        const { error: deleteError } = await supabase
            .from("elements")
            .delete()
            .eq("main_frame_id", mainFrame.id);

        if (deleteError) {
            console.warn("Warning saat menghapus elemen:", deleteError.message);
        }

        // Insert new elements
        if (components?.length > 0) {
            const { error: insertError } = await supabase
                .from("elements")
                .upsert(
                    components.map((el: ElementComponent) => ({
                        main_frame_id: mainFrame.id,
                        y: el.top,
                        x: el.left,
                        image_url: el.image ? el.image : "",
                        text_content: el.text ? el.text : "",
                        type: el.type,
                        width: el.width,
                        height: el.height,
                        z_index: el.z_index,
                        rotation: el.rotation,
                        name: el.name,
                        color: el.color,
                        element_id: el.uuid
                    })),
                    {
                        onConflict: "element_id"
                    }
                );

            if (insertError) {
                throw new Error(insertError.message);
            }
        }

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error("error server design route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
