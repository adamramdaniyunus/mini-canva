import React, { useState, useEffect, ChangeEvent } from "react";
import Button from "../Button";
import LayoutMenu from "./LayoutMenu";
import { uploadToSupabase } from "@/lib/supabase";
import { AiOutlineLoading } from "react-icons/ai";

type ImageItem = {
  url: string;
  width: number;
  height: number;
  span: string;
};

// Fungsi untuk membentuk kelompok gambar dengan aturan:
// - Maksimal 3 gambar per kelompok
// - Jika dalam satu kelompok sudah ada 2 landscape, langsung buat kelompok baru
const groupImages = (arr: ImageItem[]) => {
  const groups: ImageItem[][] = [];
  let tempGroup: ImageItem[] = [];
  let landscapeCount = 0;

  for (const img of arr) {
    const isLandscape = img.width > img.height;

    // Jika sudah ada 2 landscape, buat grup baru
    if (landscapeCount >= 2) {
      groups.push(tempGroup);
      tempGroup = [];
      landscapeCount = 0; // Reset penghitung landscape
    }

    // Tambahkan gambar ke grup
    tempGroup.push(img);
    if (isLandscape) landscapeCount++;

    // Jika grup sudah penuh (3 gambar), langsung buat grup baru
    if (tempGroup.length === 3) {
      groups.push(tempGroup);
      tempGroup = [];
      landscapeCount = 0; // Reset landscape count setelah buat grup baru
    }
  }

  // Simpan grup terakhir jika masih ada
  if (tempGroup.length > 0) {
    groups.push(tempGroup);
  }

  return groups;
};

const DownloadComponent = ({ addImage }: {
  addImage?: ({ clientX, clientY, newWidth, newHeight, blobUrl }: {
    clientX: number;
    clientY: number;
    newWidth: number;
    newHeight: number;
    blobUrl: string;
  }) => void;
}) => {
  const [layout, setLayout] = useState<
    { url: string; width: number; span: string; height: number; isTemp?: boolean }[][]
  >([]);

  const [isUploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [images, setImages] = useState<
    { url: string; width: number; height: number; isTemp: boolean }[]
  >([]);

  const updateLayoutFromImages = (imageList: typeof images, blobUrl?: string) => {
    if (blobUrl) {
      const finalImages = imageList.filter((img) => !img.isTemp);
      const grouped = groupImages(
        finalImages.map((img) => ({
          ...img,
          span: img.width > img.height ? "col-span-2" : "",
        }))
      );
      setLayout(grouped);
      return
    }
    const grouped = groupImages(
      imageList.map((img) => ({
        ...img,
        span: img.width > img.height ? "col-span-2" : "",
      }))
    );
    setLayout(grouped);
  };


  useEffect(() => {
    if (layout.length > 0) return; // Cegah fetch ulang jika layout sudah terisi

    const getFileUploads = async () => {
      try {
        setLoading(true)
        const responseJSON = await fetch("/api/design/upload");
        const response = await responseJSON.json();

        const imageList = response.data.map((img: { width: number; height: number; url: string }) => ({
          ...img,
          isTemp: false,
        }));

        setImages(imageList);
        updateLayoutFromImages(imageList);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log("Error fetching uploads:", error);
      }
    };

    getFileUploads();
  }, [layout.length]);



  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const img = new Image();
      const blobUrl = URL.createObjectURL(file);
      img.src = blobUrl;

      img.onload = async () => {
        const width = img.width;
        const height = img.height;

        // Tambahkan gambar sementara
        const tempImage = { url: blobUrl, width, height, isTemp: true };
        const tempImages = [...images, tempImage];
        setImages(tempImages);

        // Tampilkan loading layout (tanpa temp)
        updateLayoutFromImages(tempImages);

        // Upload ke Supabase
        const url = await uploadToSupabase(file);
        if (!url) throw new Error("Upload gagal");

        // Simpan ke server
        await fetch("/api/design/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ width, height, url }),
        });

        // Hapus temp dan tambahkan final image
        const updatedImages = [
          ...images.filter((img) => img.url !== blobUrl),
          { url, width, height, isTemp: false },
        ];

        setImages(updatedImages);
        updateLayoutFromImages(updatedImages, blobUrl);
      };
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <LayoutMenu>
      <div className="p-4 flex gap-2">
        <Button onClick={() => {
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.click();
          }
        }} disabled={isUploading}>Upload Images</Button>
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="overflow-auto h-full space-y-4 p-4">

        {layout.length === 0 && (
          <div className="text-center text-sm text-gray-400">
            Image not available
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-full p-4">
            <AiOutlineLoading className="text-4xl animate-spin" />
          </div>
        )}

        {layout.map((group, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {group.map((img, i) => (
              <div key={i} className={`${img.span} relative`} draggable={!img.isTemp} onClick={() => {
                if (img.isTemp) return;
                addImage!({
                  blobUrl: img.url,
                  clientX: 10,
                  clientY: 10,
                  newHeight: img.height / 2,
                  newWidth: img.width / 2
                })
              }}>
                <img
                  src={img.url}
                  className={`w-full h-[100px] rounded-md object-cover`}
                  alt={`Image ${i}`}
                />

                {img.isTemp && (
                  <div className="absolute top-0 left-0 h-full w-full grey-background opacity-80 rounded-md">
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </LayoutMenu>
  );
};

export default DownloadComponent;
