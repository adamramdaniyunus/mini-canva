import React from 'react'

const RightSidebar = () => {
  return (
    <aside className="w-64 shadow-md p-4 space-y-4 md:block hidden">
      <div className="flex gap-4 items-center">
        <p className="text-sm">Color :</p>
        <input type="color" className="w-10 h-10" />
      </div>
      <div className="flex gap-4 items-center">
        <p className="text-sm">Radius :</p>
        <input type="number" className="w-20 border-1 p-1 rounded" />
      </div>
      <div className="flex gap-4 items-center">
        <p className="text-sm">Opacity :</p>
        <input type="number" className="w-20 border-1 p-1 rounded" />
      </div>
      <div className="flex gap-4 items-center">
        <p className="text-sm">Z-Index :</p>
        <input type="number" className="w-20 border-1 p-1 rounded" />
      </div>
    </aside>
  );
}

export default RightSidebar
