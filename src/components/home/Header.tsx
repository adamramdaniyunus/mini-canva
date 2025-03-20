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
      <div className="flex p-4 shadow-sm justify-around items-center">
        <h1 className="font-bold text-2xl">
          Mi<span className="text-blue-500">Va</span>
        </h1>
        <div className="flex gap-4">
          <Button onClick={handleModal}>Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
