import { createClient } from "@supabase/supabase-js";
import imageCompression from 'browser-image-compression'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function uploadToSupabase(file: File | Blob, originalName?: string) {
  const isFile = file instanceof File;
  const extension = (isFile ? file.name.split('.').pop() : originalName?.split('.').pop()) || 'jpg';
  const fileName = originalName || `image_${Date.now()}.${extension}`;
  const filePath = `uploads/${Date.now()}_${fileName}`;

  let fileToUpload: Blob = file;

  // 🔽 Compress hanya jika file adalah File
  if (isFile) {
    fileToUpload = await imageCompression(file as File, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  }

  // 🔼 Upload ke Supabase
  const { error } = await supabase.storage
    .from("mini-canva")
    .upload(filePath, fileToUpload, {
      upsert: true, // opsional: timpa file jika sudah ada
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("mini-canva")
    .getPublicUrl(filePath);

  console.log("✅ File uploaded successfully:", publicUrlData.publicUrl);
  return publicUrlData.publicUrl;
}


export { supabase, uploadToSupabase };