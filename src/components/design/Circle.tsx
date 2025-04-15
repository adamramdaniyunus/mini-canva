import { ElementComponent } from '@/types/Element.type';
import React from 'react'

const Circle = ({
    component,
    handleClickElement,
    isSelected,
    handleMouseDown,
    handleResize,
}: {
    component: ElementComponent,
    handleClickElement: (element: ElementComponent) => void,
    isSelected: boolean,
    handleMouseDown: (e: React.MouseEvent, component: ElementComponent) => void;
    handleResize: (e: React.MouseEvent, direction: string) => void;
}) => {

    return (
        <div
            onMouseDown={(e) => handleMouseDown(e, component)}
            key={component.id}
            onClick={() => handleClickElement(component)}
            className={`absolute group hover:border-[2px] hover:border-indigo-400 ${isSelected ? 'border-[2px] border-indigo-500' : ''}`}
            style={{
                width: component.width + "px",
                height: component.height + "px",
                zIndex: component.z_index,
                top: component.top,
                left: component.left,
            }}
        >
            <div
                className="w-full h-full rounded-full"
                style={{
                    background: component.color,
                }}
            ></div>
            {/* Resize Handles */}
            {isSelected && (
                <>
                    {/* Corner Resizers */}
                    {["top-left", "top-right", "bottom-left", "bottom-right"].map((dir) => (
                        <div
                            key={dir}
                            onMouseDown={(e) => handleResize(e, dir)}
                            className={`w-2 h-2 bg-white border border-black absolute cursor-${dir === "top-left" || dir === "bottom-right" ? "nwse" : "nesw"}-resize`}
                            style={{
                                top: dir.includes("top") ? -4 : undefined,
                                bottom: dir.includes("bottom") ? -4 : undefined,
                                left: dir.includes("left") ? -4 : undefined,
                                right: dir.includes("right") ? -4 : undefined,
                            }}
                        />
                    ))}

                    {/* Side Resizers */}
                    {["top", "right", "bottom", "left"].map((dir) => (
                        <div
                            key={dir}
                            onMouseDown={(e) => handleResize(e, dir)}
                            className={`absolute bg-white border border-black ${dir == "right" || dir == "left" ? "cursor-e-resize" : "cursor-ns-resize"}`}
                            style={{
                                width: dir === "top" || dir === "bottom" ? "10px" : "4px",
                                height: dir === "left" || dir === "right" ? "10px" : "4px",
                                top: dir === "top" ? -4 : dir === "bottom" ? undefined : "50%",
                                bottom: dir === "bottom" ? -4 : undefined,
                                left: dir === "left" ? -4 : dir === "right" ? undefined : "50%",
                                right: dir === "right" ? -4 : undefined,
                                transform: "translate(-50%, -50%)",
                                cursor: `${dir}-resize`,
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    )
}

export default Circle