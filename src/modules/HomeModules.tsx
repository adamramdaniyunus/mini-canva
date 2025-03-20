"use client";
import Register from "@/components/auth/Register";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import { useModalState } from "@/context/ModalContext";
import React, { useEffect } from "react";

export default function HomeModules() {
  const { setModal } = useModalState();
  useEffect(() => {
    const handleEscapeEvent = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        setModal(false);
      }
    };
    window.addEventListener("keydown", handleEscapeEvent);
    return () => {
      window.removeEventListener("keydown", handleEscapeEvent);
    };
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Footer />
      <Register />
    </>
  );
}
