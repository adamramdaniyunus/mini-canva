import { ElementComponent } from '@/types/Element.type';
import React, { RefObject } from 'react'
import ResizeButton from './ResizeButton';
import { previewScale } from '@/utils/scale';

const ImageElement = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
    handleRotate,
    isRotating,
    rotate,
    isPreview,
    scala
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    isSelected: boolean,
    handleMouseDown: (e: React.MouseEvent, component: ElementComponent) => void;
    handleResize: (e: React.MouseEvent, direction: string) => void;
    handleRotate: (e: React.MouseEvent) => void;
    isRotating: RefObject<boolean>;
    rotate: number;
    isPreview?: boolean;
    scala:number
}) => {

    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            onClick={() => {
                if (isPreview) return;
                handleClickElement(component)
            }}
            key={component.id}
            id={`element-${component.id}`}
            className={`absolute hover:border-[2px] hover:border-indigo-400 ${isSelected ? "border-[2px] border-indigo-500" : ""
                }`}
            style={{
                width: component.width! * scala + "px",
                height: component.height! * scala + "px",
                zIndex: component.z_index,
                top: component.top! * scala,
                left: component.left! * scala,
                cursor: "move",
                transform: `rotate(${component.rotation || 0}deg)`,
                transformOrigin: 'center',
            }}
        >
            <img
                className='w-full h-full object-cover'
                key={component.id}
                src={component.image}
                onDragStart={(e) => e.preventDefault()}
                draggable={false}
            />
            {isRotating.current && isSelected && <p className='absolute -top-7 text-indigo-500 text-sm'
                style={{
                    transform: `rotate(-${component.rotation || 0}deg)`, // agar tidak ikut muter
                }}>{
                    Math.floor(rotate)}
            </p>}
            {/* Resize Handles */}
            {!isPreview && isSelected && <ResizeButton handleResize={handleResize} handleRotate={handleRotate} />}
        </div>
    );
}

export default ImageElement