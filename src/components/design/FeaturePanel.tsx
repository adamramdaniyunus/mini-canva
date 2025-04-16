import { ElementComponent } from '@/types/Element.type';
import React from 'react';
import { BiTrash } from 'react-icons/bi';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const FeaturePanel = ({
  handleShowColorPicker,
  color,
  selectedElement,
  handleDeleteElement,
  handleZIndexChange,
}: {
  handleShowColorPicker: () => void;
  selectedElement: ElementComponent | null;
  color: string;
  handleDeleteElement: (id: number) => void;
  handleZIndexChange: (id: number, zIndex: number) => void;
}) => {
  return (
    <div className="absolute rounded-md shadow-md p-4 space-y-4 -top-20 bg-white z-50">
      <div className="flex gap-4 items-center relative">
        {/* Color Picker */}
        <button
          className="h-5 w-5 rounded-full cursor-pointer"
          onClick={handleShowColorPicker}
          style={{ background: color }}
          title="Change Background"
        ></button>

        {/* Hanya muncul jika bukan main_frame */}
        {selectedElement?.name !== 'main_frame' && (
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
                    Math.max(1, (selectedElement!.z_index || 1) - 1)
                  )
                }
                className="p-1 bg-gray-100 hover:bg-gray-300 rounded"
              >
                <FiArrowDown />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturePanel;
