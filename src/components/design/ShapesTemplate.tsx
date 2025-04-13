import React from "react";
import LayoutMenu from "./LayoutMenu";

const ShapesTemplate = ({createShapes} :{createShapes: (type:string, name:string)=>void;}) => {
  return (
    <LayoutMenu>
      <div className="overflow-auto h-full">
        <div className="flex flex-wrap gap-4 p-4">
         <div onClick={() => createShapes('shape', 'rect')} className="h-[90px] w-[90px] bg-blue-500 cursor-pointer"></div>
         <div onClick={() => createShapes('shape', 'circle')} className="h-[90px] w-[90px] bg-blue-500 cursor-pointer rounded-full"></div>
         <div onClick={() => createShapes('shape', 'polygon')} style={{clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} className="h-[90px] w-[90px] bg-blue-500 cursor-pointer"></div>
        </div>
      </div>
    </LayoutMenu>
  );
};

export default ShapesTemplate;
