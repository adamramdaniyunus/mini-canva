"use client"

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BiFolder, BiHome, BiMenu } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import PasswordForm from './PasswordForm';
import { CgClose } from 'react-icons/cg';

const Sidebar = () => {
  const [showSetting, setShowSetting] = useState(false);
  const params = usePathname();
  const session = useSession();
  const user = session.data?.user;
  const formRef = useRef<HTMLFormElement | null>(null)
  const [showSidebar, setShowSidebar] = useState(false);

  const handleShowSidebar = () => {
    setShowSidebar(prev => !prev);
  }

  const handleShowSettings = () => {
    setShowSetting(prev => !prev);
    setShowSidebar(false);
  }

  const urls = [
    {
      url: '/dashboard',
      icon: <span className='text-lg'><BiHome /></span>,
      title: 'Home'
    },
    {
      url: '/dashboard/projects',
      icon: <span className='text-lg'><BiFolder /></span>,
      title: 'Projects'
    },
    {
      url: '#',
      icon: <span className='text-lg'><BsGear /></span>,
      title: 'Settings'
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setShowSetting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <aside className="w-64 p-5 md:block sticky hidden top-0 left-0">
        <div className="flex items-center gap-2">
          <img
            src={user?.profile || "https://as2.ftcdn.net/v2/jpg/03/64/21/11/1000_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer active:opacity-80 transition-all duration-300"
          />
          <div className='flex flex-col'>
            <p className='text-sm font-semibold'>{user?.fullname ?? "loading..."}</p>
            <p className='text-xs text-gray-400'>Free</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {urls.map((link, index) => {
            if (link.title === 'Settings') {
              return (
                <li key={index} className={`hover:bg-gray-200 ${params === link.url && "bg-gray-200"} rounded active:bg-gray-100 transition-all duration-300 cursor-pointer`}>
                  <button onClick={handleShowSettings} className='p-2 flex items-center gap-2 w-full h-full cursor-pointer'>
                    {link.icon} {link.title}
                  </button>
                </li>
              )
            }
            return (
              <li key={index} className={`hover:bg-gray-200 ${params === link.url && "bg-gray-200"} rounded active:bg-gray-100 transition-all duration-300 cursor-pointer`}>
                <Link href={link.url} className='p-2 flex items-center gap-2 w-full h-full'>
                  {link.icon} {link.title}
                </Link>
              </li>
            )
          })}
        </ul>

      </aside>
      <button onClick={handleShowSidebar} className='md:fixed hidden p-4 bg-white shadow-md rounded-md z-[99999] active:scale-90 transition-all duration-300'>
        <BiMenu/>
      </button>
      <aside className={`${showSidebar ? "left-0" : "-left-[300px]"} top-0  w-64 p-5 md:hidden fixed z-[999999] bg-white h-screen transition-all duration-300`}>

        <div className="flex items-center gap-2">
          <img
            src={user?.profile || "https://as2.ftcdn.net/v2/jpg/03/64/21/11/1000_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer active:opacity-80 transition-all duration-300"
          />
          <div className='flex flex-col'>
            <p className='text-sm font-semibold'>{user?.fullname ?? "loading..."}</p>
            <p className='text-xs text-gray-400'>Free</p>
          </div>

          <button className='p-4 absolute top-1 right-1 hover:bg-gray-200' onClick={handleShowSidebar}>
            <CgClose />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {urls.map((link, index) => {
            if (link.title === 'Settings') {
              return (
                <li key={index} className={`hover:bg-gray-200 ${params === link.url && "bg-gray-200"} rounded active:bg-gray-100 transition-all duration-300 cursor-pointer`}>
                  <button onClick={handleShowSettings} className='p-2 flex items-center gap-2 w-full h-full cursor-pointer'>
                    {link.icon} {link.title}
                  </button>
                </li>
              )
            }
            return (
              <li key={index} className={`hover:bg-gray-200 ${params === link.url && "bg-gray-200"} rounded active:bg-gray-100 transition-all duration-300 cursor-pointer`}>
                <Link href={link.url} className='p-2 flex items-center gap-2 w-full h-full'>
                  {link.icon} {link.title}
                </Link>
              </li>
            )
          })}
        </ul>

      </aside>
      {showSetting && (
        <div className='fixed h-full w-full z-[99999] bg-black/80'>
          <PasswordForm handleShowSettings={handleShowSettings} formRef={formRef} />
        </div>
      )}
    </>
  );
}

export default Sidebar
