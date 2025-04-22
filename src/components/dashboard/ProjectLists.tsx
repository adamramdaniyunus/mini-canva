"use client"
import { useEffect, useState } from "react";
import DesignCard from "./DesignCard";
import { ProjectType } from "@/types/ProjectType";

const ProjectLists: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (projects.length > 0) return;

    const getDataProjects = async () => {
      try {
        setLoading(true);
        const rawData = await fetch('/api/project?recent=false');
        const { data } = await rawData.json();
        setProjects(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getDataProjects();
  }, [projects.length])

  return (
    <div className="relative w-full mx-auto flex flex-wrap gap-4">
        {isLoading && Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="w-[250px] h-[200px] rounded-lg flex-shrink-0 p-4 shadow-md grey-background "
          >
          </div>
        ))}

        {projects.length == 0 && (
          <div className="text-center flex justify-center w-full text-sm text-gray-400">
            Add ur new Project now!
          </div>
        )}

        {projects.map((project, index) => (
          <DesignCard key={index} project={project} />
        ))}
    </div>
  );
};

export default ProjectLists;
