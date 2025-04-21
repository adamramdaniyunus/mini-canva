"use client"
import { ElementComponent } from "@/types/Element.type";
import { useEffect, useState } from "react";
import { googleFonts } from "./googlefonts";


export default function FontSelector({
    selectedElement,
    handleFontFamilyChange,
}: {
    selectedElement: ElementComponent;
    handleFontFamilyChange: (id: number, newFont: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleChangeFontFamily = (id:number, newFont:string) => {
        handleFontFamilyChange(id, newFont);
        selectedElement.font_family = newFont;
    }

    useEffect(() => {
        import("webfontloader").then((WebFont) => {
            WebFont.load({
                google: {
                    families: googleFonts,
                },
            });
        });
    }, []);
    return (
        <div className="relative inline-block">
            <button
                title="Change font family"
                onClick={() => setIsOpen((prev) => !prev)}
                className="px-2 bg-gray-100 whitespace-nowrap hover:bg-gray-300 rounded cursor-pointer"
                style={{
                    fontFamily: selectedElement?.font_family,
                }}
            >
                {selectedElement?.font_family}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow-md overflow-auto h-96">
                    {googleFonts.map((font) => (
                        <div
                            key={font}
                            onClick={() => {
                                handleChangeFontFamily(selectedElement.id, font);
                                setIsOpen(false); // tutup dropdown
                            }}
                            style={{ fontFamily: font }}
                            className="px-3 py-1 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                        >
                            {font}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
