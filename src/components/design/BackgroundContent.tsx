import React from "react";
import LayoutMenu from "./LayoutMenu";

const backgroundImages = [
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/uploads/Why%20consistent%20writing%20makes%20you%20a%20better%20designer.jpg",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/backgrounds/1ed6a8c4-5af6-47e8-bd67-b71e5ec6bf68.jpg",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/backgrounds/download.jpg",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/backgrounds/Premium%20Vector%20_%20Comic%20abstract%20pop%20art%20background%20with%20thunder%20illustration.jpg",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/backgrounds/Premium%20Vector%20_%20Retro%20burst%20background.jpg",
]

const BackgroundContent = ({
  handleChangeBackground
}: {
  handleChangeBackground?: (url: string) => void;
}) => {
  return (
    <LayoutMenu>
      <div className="overflow-auto h-full">
        <div className="flex flex-wrap gap-4 p-4">
          {backgroundImages.map((url, i) => (
            <div
              onClick={() => handleChangeBackground!(url)}
              key={i}
              draggable={false}
              className="bg-white shadow-md rounded-md overflow-hidden h-auto w-[120px] cursor-pointer"
            >
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-auto rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </LayoutMenu>
  );
};

export default BackgroundContent;
