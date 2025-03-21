"use client";

import Button from "@/components/Button";
import { useDesignState } from "@/context/DesignContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // ⬅️ Ref untuk menu
  const imgRef = useRef<HTMLImageElement | null>(null); // ⬅️ Ref untuk img profile
  const router = useRouter();
  const { setState } = useDesignState();

  const handleCreateNewDesign = () => {
    setState({width: 400, height: 400});
    router.push('/create');
  }

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        imgRef.current &&
        !imgRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false); // ⬅️ Tutup menu jika klik di luar menu & img
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="flex p-4 px-10 justify-between items-center shadow-sm">
        <h1 className="font-bold text-2xl">
          Mi<span className="text-blue-500">Va</span>
        </h1>
        <div className="flex gap-4 items-center relative">
          <Button onClick={handleCreateNewDesign}>Create Design</Button>
          <img
            ref={imgRef} // ⬅️ Tambahkan ref ke img
            onClick={handleShowMenu}
            src="https://as2.ftcdn.net/v2/jpg/03/64/21/11/1000_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            alt=""
            className="w-10 h-10 rounded-full object-cover cursor-pointer active:opacity-80 transition-all duration-300"
          />

          {/* Menu Section */}
          <div
            ref={menuRef} // ⬅️ Tambahkan ref ke div menu
            className={`absolute p-2 text-white bg-black/70 ${
              showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
            } duration-300 transition-all right-0 -bottom-[40px]`}
          >
            <div className="flex flex-col items-center">
              <button className="cursor-pointer active:opacity-80 text-sm transition-all duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
