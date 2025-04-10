import React, { useState, useEffect } from "react";
import Button from "../Button";

const images = [
  {
    url: "https://i.pinimg.com/736x/7a/31/0b/7a310b0c2a46cc3eae1c8092999b3c89.jpg",
    width: 500,
    height: 700,
  },
  {
    url: "https://i.pinimg.com/736x/26/35/1a/26351a24cd5f072831fdc71a00955216.jpg",
    width: 700,
    height: 500,
  },
  {
    url: "https://i.pinimg.com/736x/4b/bd/58/4bbd58d8f9a89ace546004fde07e8644.jpg",
    width: 500,
    height: 700,
  },
  {
    url: "https://i.pinimg.com/736x/9c/7a/f4/9c7af4bf010fc515d28698af1a85bd78.jpg",
    width: 700,
    height: 500,
  },
  {
    url: "https://i.pinimg.com/736x/07/47/d2/0747d23c1c60260b030ba7203b80a6f5.jpg",
    width: 600,
    height: 500,
  },
  {
    url: "https://i.pinimg.com/736x/7a/31/0b/7a310b0c2a46cc3eae1c8092999b3c89.jpg",
    width: 500,
    height: 700,
  },
  {
    url: "https://i.pinimg.com/736x/26/35/1a/26351a24cd5f072831fdc71a00955216.jpg",
    width: 700,
    height: 500,
  },
  {
    url: "https://i.pinimg.com/736x/4b/bd/58/4bbd58d8f9a89ace546004fde07e8644.jpg",
    width: 500,
    height: 700,
  },
];

// Fungsi untuk membentuk kelompok gambar dengan aturan:
// - Maksimal 3 gambar per kelompok
// - Jika dalam satu kelompok sudah ada 2 landscape, langsung buat kelompok baru
const groupImages = (arr: any[]) => {
  const groups: any[][] = [];
  let tempGroup: any[] = [];
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


const DownloadComponent = () => {
  const [layout, setLayout] = useState<
    { url: string; width: number; span: string; height: number }[][]
  >([]);

  useEffect(() => {
    // Atur span berdasarkan orientasi gambar
    const updatedLayout = images.map((img) => ({
      ...img,
      span: img.width > img.height ? "col-span-2" : "", // Jika landscape, ambil 2 kolom
    }));

    setLayout(groupImages(updatedLayout));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex gap-2">
        <Button>Upload Images</Button>
      </div>

      <div className="overflow-auto h-full space-y-4 p-4">
        {layout.map((group, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {group.map((img, i) => (
              <div key={i} className={`${img.span}`}>
                <img
                  src={img.url}
                  className="w-full h-[100px] rounded-md object-cover"
                  alt={`Image ${i}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadComponent;
