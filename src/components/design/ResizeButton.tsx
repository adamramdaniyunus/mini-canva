import React from 'react'
import { FaRotate } from 'react-icons/fa6';

const ResizeButton = ({ handleResize, handleRotate }:
    {
        handleResize: (e: React.MouseEvent | React.TouchEvent, direction: string) => void;
        handleRotate: (e: React.MouseEvent | React.TouchEvent) => void;
    }) => {
    return (
        <>
            {/* Rotate Button */}
            <div
                onMouseDown={(e) => handleRotate(e)}
                onTouchStart={(e) => handleRotate(e)}
                className="absolute bg-white border text-black border-black rounded-full cursor-crosshair max-w-[30px] max-h-[30px]"
                style={{
                    bottom: -40, // di bawah shape
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <FaRotate className='max-w-[25px] max-h-[25px]'/>
            </div>
            {/* Corner Resizers */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((dir) => {
                const cursor =
                    dir === "top-left" || dir === "bottom-right" ? "nwse-resize" : "nesw-resize";

                const positionStyle: React.CSSProperties = {
                    position: "absolute",
                    width: 8,
                    height: 8,
                    backgroundColor: "white",
                    border: "1px solid black",
                    cursor,
                    ...(dir.includes("top") ? { top: -4 } : { bottom: -4 }),
                    ...(dir.includes("left") ? { left: -4 } : { right: -4 }),
                };

                return (
                    <div
                        key={dir}
                        onMouseDown={(e) => handleResize(e, dir)}
                        onTouchStart={(e) => handleResize(e, dir)}
                        style={positionStyle}
                    />
                );
            })}


            {/* Side Resizers */}
            {["top", "right", "bottom", "left"].map((dir) => (
                <div
                    key={dir}
                    onMouseDown={(e) => handleResize(e, dir)}
                    onTouchStart={(e) => handleResize(e, dir)}
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
    )
}

export default ResizeButton