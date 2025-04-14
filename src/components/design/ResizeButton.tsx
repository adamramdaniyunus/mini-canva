import React from 'react'

const ResizeButton = () => {
  return (
    <>
    <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-2 h-2 bg-white border border-black absolute -top-1 -left-1 cursor-nwse-resize"
    />
    <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-2 h-2 bg-white border border-black absolute -top-1 -right-1 cursor-nesw-resize"
    />
    <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-2 h-2 bg-white border border-black absolute -bottom-1 -left-1 cursor-nesw-resize"
    />
    <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-2 h-2 bg-white border border-black absolute -bottom-1 -right-1 cursor-nwse-resize"
    />
</>
  )
}

export default ResizeButton