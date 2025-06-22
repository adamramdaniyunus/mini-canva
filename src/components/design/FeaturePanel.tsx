"use client"
import { CanvasType } from '@/types/CanvasType';
import { ElementComponent } from '@/types/Element.type';
import React from 'react';
import { BiTrash } from 'react-icons/bi';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaMinus,
  FaPlus
} from 'react-icons/fa6';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import FontSelector from './FontSelector';

const FeaturePanel = ({
  handleShowColorPicker,
  color,
  selectedElement,
  selectedCanvas,
  handleDeleteElement,
  handleZIndexChange,
  handleFontSizeChange,
  handleFontFamilyChange,
  handleAlignTextChange,
  handleFontItalicChange,
  handleFontBoldChange
}: {
  handleShowColorPicker: () => void;
  selectedElement: ElementComponent | null;
  selectedCanvas: CanvasType | null;
  color: string;
  handleDeleteElement: (id: number) => void;
  handleZIndexChange: (id: number, zIndex: number) => void;
  handleFontSizeChange: (id: number, fontSize: number) => void;
  handleFontFamilyChange: (id: number, fontFamily: string) => void;
  handleAlignTextChange: (id: number, align: "left" | "center" | "right" | "justify") => void;
  handleFontItalicChange: (id: number, fontItalic: boolean) => void;
  handleFontBoldChange: (id: number, fontBold: boolean) => void;
}) => {

  const buttonFeatTextRender = ({
    title,
    onClick,
    icon,
    condition
  }: {
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
    condition: boolean;
  }) => {
    return (
      <button title={title} onClick={onClick} className={`p-1 ${condition ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-300 rounded`}>
        {icon}
      </button>

    )
  }
  return (
    <div className="absolute rounded-md shadow-md p-4 space-y-4 -top-20 bg-white z-10">
      <div className="flex gap-4 items-center relative">
        {/* Color Picker */}
        <button
          className="h-5 w-5 rounded-full cursor-pointer"
          onClick={handleShowColorPicker}
          style={{ background: color }}
          title="Change Background"
        ></button>

        {/* Hanya muncul jika bukan main_frame */}
        {!selectedCanvas && (
          <>
            {/* Delete Button */}
            <button
              className="cursor-pointer rounded-full flex items-center justify-center"
              title="Delete Element"
              onClick={() => handleDeleteElement(selectedElement!.id)}
            >
              <BiTrash className="text-xl" />
            </button>

            {/* Z-Index Buttons */}
            <div className="flex gap-1">
              <button
                title="Move Forward"
                onClick={() =>
                  handleZIndexChange(
                    selectedElement!.id,
                    (selectedElement!.z_index || 0) + 1
                  )
                }
                className="p-1 bg-gray-100 hover:bg-gray-300 rounded"
              >
                <FiArrowUp />
              </button>
              <button
                title="Move Backward"
                onClick={() =>
                  handleZIndexChange(
                    selectedElement!.id,
                    Math.max(0, (selectedElement!.z_index || 0) - 1)
                  )
                }
                className="p-1 bg-gray-100 hover:bg-gray-300 rounded"
              >
                <FiArrowDown />
              </button>
            </div>

            {/* Font size Button */}
            {
              selectedElement?.type === "text" && (
                <>
                  <div className="flex gap-1">
                    <button
                      title="Increase Font Size"
                      onClick={() => {
                        const newFontSize = selectedElement.font_size!++
                        handleFontSizeChange(selectedElement!.id, newFontSize)
                      }}
                      className="p-1 bg-gray-100 hover:bg-gray-300 rounded"
                    >
                      <FaPlus />
                    </button>
                    <input type="text" value={selectedElement?.font_size} readOnly onChange={() => { }} className='max-w-[50px] text-center' />
                    <button
                      title="Decrease Font Size"
                      onClick={() => {
                        const newFontSize = selectedElement.font_size! --
                        handleFontSizeChange(selectedElement!.id, newFontSize)
                      }}
                      className="p-1 bg-gray-100 hover:bg-gray-300 rounded"
                    >
                      <FaMinus />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <FontSelector
                      selectedElement={selectedElement}
                      handleFontFamilyChange={handleFontFamilyChange}
                    />


                    {buttonFeatTextRender({
                      title: "Italic", onClick: () => {
                        handleFontItalicChange(selectedElement.id, !selectedElement.font_italic)
                        selectedElement.font_italic = !selectedElement.font_italic
                      },
                      icon: <FaItalic />,
                      condition: selectedElement.font_italic || false
                    })}

                    {buttonFeatTextRender({
                      title: "Bold", onClick: () => {
                        handleFontBoldChange(selectedElement.id, !selectedElement.font_bold)
                        selectedElement.font_bold = !selectedElement.font_bold
                      },
                      icon: <FaBold />,
                      condition: selectedElement.font_bold || false
                    })}

                    {buttonFeatTextRender({
                      title: "Align Left", onClick: () => {
                        handleAlignTextChange(selectedElement.id, "left")
                        selectedElement.align = "left"
                      },
                      icon: <FaAlignLeft />,
                      condition: selectedElement.align === "left" || false
                    })}

                    {buttonFeatTextRender({
                      title: "Align Center", onClick: () => {
                        handleAlignTextChange(selectedElement.id, "center")
                        selectedElement.align = "center"
                      },
                      icon: <FaAlignCenter />,
                      condition: selectedElement.align === "center" || false
                    })}

                    {buttonFeatTextRender({
                      title: "Align Right", onClick: () => {
                        handleAlignTextChange(selectedElement.id, "right")
                        selectedElement.align = "right"
                      },
                      icon: <FaAlignRight />,
                      condition: selectedElement.align === "right" || false
                    })}

                    {buttonFeatTextRender({
                      title: "Align Justify", onClick: () => {
                        handleAlignTextChange(selectedElement.id, "justify")
                        selectedElement.align = "justify"
                      },
                      icon: <FaAlignJustify />,
                      condition: selectedElement.align === "justify" || false
                    })}
                  </div>
                </>
              )
            }
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturePanel;
