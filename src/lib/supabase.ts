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

async function uploadPreviewImage(blob: Blob, fileName: string): Promise<string | null> {
  const filePath = `preview/${Date.now()}_${fileName}`;

  // change blob to file
  const file = new File([blob], fileName, { type: blob.type });
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  });
  
  const { error } = await supabase
    .storage
    .from('mini-canva')
    .upload(filePath, compressedFile, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/png'
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  // Ambil public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('mini-canva')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

function getFileNameFromUrl(url: string): string | null {
  const match = url.match(/\/([^/]+\.(png|jpe?g|gif|webp|bmp|svg))$/i);
  return match ? match[1] : null;
}


export { supabase, uploadToSupabase, uploadPreviewImage, getFileNameFromUrl };