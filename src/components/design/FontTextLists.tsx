"use client";

import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import Button from "../Button";
import { Search } from "lucide-react";
import LayoutMenu from "./LayoutMenu";
import { googleFonts } from "./googlefonts";

const FontTextLists = (
  {
    addText
  }: {
    addText?: (text: string, fontFamily: string, fontSize: number) => void;
  }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    WebFont.load({
      google: {
        families: googleFonts,
      },
    });
  }, []);

  const filteredFonts = googleFonts.filter((font) =>
    font.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddText = (font: string) => {
    if (addText) {
      // console.log("Selected font:", font);
      addText("Edit Text", font, 20); // Example text and size
    }
  };

  return (
    <LayoutMenu>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Font"
            className="w-full outline-none text-sm placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleAddText("normal")}
        >Add Text To Design</Button>
      </div>

      <div className="overflow-auto h-full space-y-4 p-4">
        {filteredFonts.length > 0 ? (
          filteredFonts.map((font) => (
            <h1
              key={font}
              onClick={() => handleAddText(font)}
              className="border p-2 rounded-md border-gray-200 cursor-pointer hover:bg-gray-100"
              style={{ fontFamily: font }}
            >
              {font}
            </h1>
          ))
        ) : (
          <p className="text-gray-500">Font Not Available.</p>
        )}
      </div>
    </LayoutMenu>
  );
};

export default FontTextLists;
