"use client";

import React from "react";
import Button from "../Button";
import { useModalState } from "@/context/ModalContext";

const Hero = () => {
  const { setModal } = useModalState();
  const handleModal = () => {
    setModal(true);
  };
  return (
    <main>
      <div className="flex flex-col gap-2 justify-center items-center p-4">
        <h1 className="text-4xl font-semibold drop-shadow-sm">
          What will you design today?
        </h1>
        <p className="text-xl font-semibold drop-shadow-sm">
          <span className="text-blue-500">MiVa</span> makes it easy to create
          and share <span className="underline">professional</span> design.
        </p>
        <div>
          <Button onClick={handleModal}>Join with us</Button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
