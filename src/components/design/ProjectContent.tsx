import { Search } from "lucide-react";
import React, { useState } from "react";
import LayoutMenu from "./LayoutMenu";

const ProjectContent = () => {
  const [query, setQuery] = useState("");
  return (
    <LayoutMenu>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Project"
            className="w-full outline-none text-sm placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-auto h-full space-y-4">
        <div className="flex flex-wrap gap-4 p-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white overflow-hidden h-auto w-[120px]">
              <img
                src={`https://placehold.co/250x150?text=Image+${i + 1}`}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-auto rounded-md"
              />

              <p className="font-semibold text-sm truncate w-full">
                Title {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </LayoutMenu>
  );
};

export default ProjectContent;
