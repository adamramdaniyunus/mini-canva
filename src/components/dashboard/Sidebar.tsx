import React from 'react'
import { BiFolder, BiHome } from 'react-icons/bi';
import { LuLayoutTemplate } from 'react-icons/lu';

const Sidebar = () => {
  return (
    <>
      <aside className="w-64 p-5 sticky top-0 left-0">
        <div className="flex items-center gap-2">
          <img
            src="https://as2.ftcdn.net/v2/jpg/03/64/21/11/1000_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            alt=""
            className="w-10 h-10 rounded-full object-cover cursor-pointer active:opacity-80 transition-all duration-300"
          />
          <div className='flex flex-col'>
            <p className='text-sm font-semibold'>Adam Ramdani</p>
            <p className='text-xs text-gray-400'>Free</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="p-2 flex items-center gap-2 hover:bg-gray-200 bg-gray-200 rounded active:bg-gray-100 transition-all duration-300 cursor-pointer">
            <span className='text-lg'><BiHome/></span> Home
          </li>
          <li className="p-2 flex items-center gap-2 hover:bg-gray-200  rounded active:bg-gray-100 transition-all duration-300 cursor-pointer">
            <span className='text-lg'><BiFolder/></span> Projects
          </li>
          <li className="p-2 flex items-center gap-2 hover:bg-gray-200  rounded active:bg-gray-100 transition-all duration-300 cursor-pointer">
            <span className='text-lg'><LuLayoutTemplate/></span> Templates
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar
