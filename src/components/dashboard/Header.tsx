"use client";

import Button from "@/components/Button";
import { useDesignState } from "@/context/DesignContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { createDesign, saveProjects } from "@/lib/indexDB";
import { CanvasType } from "@/types/CanvasType";
import toast from "react-hot-toast";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // ⬅️ Ref untuk menu
  const imgRef = useRef<HTMLImageElement | null>(null); // ⬅️ Ref untuk img profile
  const router = useRouter();
  const { setState, setLoading, isLoading } = useDesignState();

  const handleCreateNewDesign = async () => {
    setLoading(true);
    setState({ width: 400, height: 400 });
    let promise: {data: {project_id: string, frame_id:string}} = {data:{project_id: "", frame_id: ""}};

    // Call API to create new design
    try {
      const response = await fetch("/api/design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ width: 400, height: 500 }),
      });
      promise = await response.json();
    } catch (error) {
      console.error("Error creating new design:", error);
      toast.error("Something wrong, please try again later.")
      setLoading(false);
      return;
    }

    const newDesignId = promise.data.project_id; // Use the project_id from the response
    const initialComponents: CanvasType ={
      id: promise.data.frame_id,
      height: 400,
      width: 500,
      background_color: "#DBDBDB",
      background_image: "",
      components: [],
      project_id: newDesignId,
    };

    await createDesign(newDesignId, initialComponents);
    await saveProjects(newDesignId, "Untitled Project")
    setLoading(false);
    router.push(`/design/${newDesignId}/edit`);
  };

  const handleShowMenu
    = () => {
      setShowMenu((prev) => !prev);
    };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
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
          <Button disabled={isLoading} onClick={handleCreateNewDesign}>
            {isLoading ? "Loading" : "Create new design"}
          </Button>
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
            className={`absolute p-2 text-white bg-black/70 ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
              } duration-300 transition-all right-0 -bottom-[40px]`}
          >
            <div className="flex flex-col items-center">
              <button onClick={handleLogout} className="cursor-pointer active:opacity-80 text-sm transition-all duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
