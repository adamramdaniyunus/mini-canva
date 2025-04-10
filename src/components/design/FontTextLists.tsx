"use client";

import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import Button from "../Button";
import { Search } from "lucide-react";

const googleFonts = [
  "Poppins",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Raleway",
  "Merriweather",
  "Playfair Display",
  "Nunito",
  "Inter",
  "Rubik",
  "Quicksand",
  "Mukta",
  "Cabin",
  "Bebas Neue",
  "Muli",
  "Noto Sans",
  "Work Sans",
  "PT Sans",
  "Fira Sans",
  "Arimo",
  "Titillium Web",
  "Josefin Sans",
  "Pacifico",
  "Lobster",
  "Abril Fatface",
  "Anton",
  "Bangers",
  "Fredoka",
  "Dancing Script",
  "Caveat",
  "Shadows Into Light",
  "Amatic SC",
  "Orbitron",
  "Russo One",
  "Indie Flower",
  "Baloo 2",
  "Zilla Slab",
];

const FontTextLists = () => {
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

  return (
    <div className="flex flex-col h-full">
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
        <Button>Add Text To Design</Button>
      </div>

      <div className="overflow-auto h-full space-y-4 p-4">
        {filteredFonts.length > 0 ? (
          filteredFonts.map((font) => (
            <h1
              key={font}
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
    </div>
  );
};

export default FontTextLists;
