"use client"
import React from "react";
import Button from "../Button";
import { useModalState } from "@/context/ModalContext";

const Header = () => {
  const { setModal } = useModalState();
  const handleModal = () => {
    setModal(true);
  };
  return (
    <header>
      <nav className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">Miva</h1>
        <div className="space-x-4 flex items-center">
          <a href="#features" className="text-gray-700 hover:underline">Features</a>
          <a href="#" className="text-gray-700 hover:underline">FAQ</a>
          <Button onClick={handleModal} BG="bg-[#3DB2FF] hover:bg-sky-800">Get Started</Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
