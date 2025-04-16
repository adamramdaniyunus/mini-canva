import { ElementComponent } from '@/types/Element.type';
import React from 'react'
import { BiTrash } from 'react-icons/bi';

const FeaturePanel = ({
  handleShowColorPicker,
  color,
  selectedElement,
  handleDeleteElement,
}: {
  handleShowColorPicker: () => void;
  selectedElement: ElementComponent | null;
  color:string;
  handleDeleteElement: (id: number) => void;
}) => {
  return (
    <div className="absolute rounded-md shadow-md p-4 space-y-4 -top-20">
      <div className="flex gap-4 items-center relative">
        <button className='h-5 w-5 rounded-full cursor-pointer' onClick={handleShowColorPicker} style={{ background: color }} title='Change Background'></button>
        {selectedElement?.name !== 'main_frame' && (
          <button className='cursor-pointer rounded-full flex items-center justify-center' title='Delete Element' onClick={() => handleDeleteElement(selectedElement!.id)}>
            <BiTrash className='text-xl'/>
          </button>
        ) }
        {/* <input type="color" id='color' onChange={handleColorChange} className="w-10 h-10 opacity-0 absolute rounded-full" title='Background Color' /> */}
      </div>
    </div>
  );
}

export default FeaturePanel
