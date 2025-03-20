"use client"
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DesignCard from "./DesignCard";

const DesignLists: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null); // Menentukan tipe ref

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Sesuaikan jumlah scroll
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        {Array.from({ length: 6 }).map((_, index) => (
         <DesignCard key={index} index={index}/>
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
