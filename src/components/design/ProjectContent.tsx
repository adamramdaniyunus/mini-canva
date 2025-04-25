import { Search } from "lucide-react";
import React, { useState } from "react";
import LayoutMenu from "./LayoutMenu";
import ProjectLists from "../dashboard/ProjectLists";

const ProjectContent = () => {
  const [query, setQuery] = useState("");
  return (
    <LayoutMenu>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            readOnly
            placeholder="Search Project"
            className="w-full outline-none text-sm placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-auto h-full space-y-4 p-4">
        <ProjectLists />
      </div>
    </LayoutMenu>
  );
};

export default ProjectContent;
