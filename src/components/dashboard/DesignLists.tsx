"use client"
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DesignCard from "./DesignCard";
import { ProjectType } from "@/types/ProjectType";

const DesignLists: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null); // Menentukan tipe ref
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setLoading] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Sesuaikan jumlah scroll
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (projects.length > 0) return;

    const getDataProjects = async () => {
      try {
        setLoading(true);
        const rawData = await fetch('/api/design?recent=true');
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
    <div className="relative w-full mx-auto">
      {/* Tombol kiri */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white-200/50 text-black p-2 rounded-full shadow-lg z-10"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Container Scroll */}



      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth py-2"
      >
        {isLoading && Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="min-w-[250px] h-[200px] rounded-lg flex-shrink-0 p-4 shadow-md grey-background "
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

      {/* Tombol kanan */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-200/50 text-black p-2 rounded-full shadow-lg z-10"
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default DesignLists;
