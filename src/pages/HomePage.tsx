"use client";
import { ModalStateProvider } from "@/context/ModalContext";
import HomeModules from "@/modules/HomeModules";
import React from "react";

export default function HomePage() {
  return (
    <ModalStateProvider>
      <main className="h-screen flex flex-col justify-between">
        <HomeModules />
      </main>
    </ModalStateProvider>
  );
}
