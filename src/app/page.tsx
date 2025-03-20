import { ModalStateProvider } from "@/context/ModalContext";
import HomePage from "@/pages/HomePage";
import React from "react";

export default function Home() {
  return (
    <ModalStateProvider>
      <HomePage/>
    </ModalStateProvider>
  );
}
