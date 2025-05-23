import React from "react";
import LayoutMenu from "./LayoutMenu";

const DesignTemplate = () => {
  return (
    <LayoutMenu>
      <div className="overflow-auto h-full">
        <div className="flex flex-wrap gap-4 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-md overflow-hidden h-auto w-[120px]"
            >
              <img
                src={`https://placehold.co/250x150?text=Image+${i + 1}`}
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

export default DesignTemplate;
