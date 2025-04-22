import React from "react";
import LayoutMenu from "./LayoutMenu";

const urls = [
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/fc2edbce-0a47-4a5a-9f47-8af4a701696b-removebg-preview.png",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/dce6be34-4436-454d-b11f-0ca2f1aa9b75-removebg-preview.png",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/Cartoon_Cloud_PNG-removebg-preview.png",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/9ded30da-1ffa-486e-94d5-503cf9081222-removebg-preview.png",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/5c7043c3-a111-47c3-9ed1-35ed1f34220a-removebg-preview.png",
  "https://eniosgsjvfobexgjjytd.supabase.co/storage/v1/object/public/mini-canva/images/3da8c7a8-1fac-4e07-ab51-52f9d0b540d4-removebg-preview.png",
]

const ImageContent = ({ addImage }: {
  addImage?: ({ clientX, clientY, newWidth, newHeight, blobUrl }: {
    clientX: number;
    clientY: number;
    newWidth: number;
    newHeight: number;
    blobUrl: string;
  }) => void;
}) => {
  return (
    <LayoutMenu>
      <div className="overflow-auto h-full">
        <div className="flex flex-wrap gap-4 p-4">
          {urls.map((url, i) => (
            <div
            onClick={() => {
              addImage!({
                blobUrl: url,
                clientX: 10,
                clientY: 10,
                newHeight: 200,
                newWidth: 200
              })
            }}
              key={i}
              className="rounded-md overflow-hidden h-auto w-[120px] cursor-pointer"
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

export default ImageContent;
