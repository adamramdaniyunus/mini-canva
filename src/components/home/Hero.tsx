"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useModalState } from "@/context/ModalContext";
import { FaShapes } from "react-icons/fa";
import { BiImage } from "react-icons/bi";
import { PiTextT } from "react-icons/pi";
import { BsCircle } from "react-icons/bs";
import { motion } from "framer-motion";

const Hero = () => {
  const { setModal } = useModalState();
  const handleModal = () => {
    setModal(true);
  };

  const text = "Hello,\n World";
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDeleting && currentText.length < text.length) {
        setCurrentText(currentText + text.charAt(currentText.length));
      } else if (isDeleting && currentText.length > 0) {
        setCurrentText(currentText.slice(0, currentText.length - 1));
      }

      if (currentText === text) {
        setIsDeleting(true);
      } else if (currentText === "") {
        setIsDeleting(false);
      }
    }, 150);

    return () => clearInterval(interval); // Hentikan interval saat komponen unmount
  }, [currentText, isDeleting, text]);


  return (
    <main>
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7, ease: "easeInOut" }}
          className="md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-8xl font-bold">
            Design <br />
            with ease
          </h2>
          <p className="text-gray-600 text-4xl">Create stunning single-page designs effortlessly.</p>
          <div className="max-w-40">
            <Button onClick={handleModal} BG="text-xl inline-block bg-[#FF2442] font-medium hover:bg-red-800">
              Join Now!
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:w-1/2 mt-10 md:mt-0 relative w-full"
        >
          <div className="border-4 border-black z-10 rounded-2xl overflow-hidden bg-gray-100">
            <div className="flex flex-col">
              <div className="flex justify-between items-center px-5 py-2 border-b-3 bg-white border-b-gray-300">
                <div className="flex gap-2">
                  <div className="rounded-full w-4 h-4 bg-red-500" />
                  <div className="rounded-full w-4 h-4 bg-orange-500" />
                  <div className="rounded-full w-4 h-4 bg-green-500" />
                </div>

                <h1 className="font-bold text-2xl">PNG</h1>
              </div>

              <div className="flex">
                <aside className="w-18 p-5 sticky h-96 top-0 left-0 bg-white border-r-3 border-r-gray-300">
                  <div className="flex flex-col items-center gap-7">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <div className="text-4xl">
                        <FaShapes />
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <div className="text-4xl">
                        <BiImage />
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <div className="text-4xl">
                        <PiTextT />
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <div className="text-4xl">
                        <BsCircle />
                      </div>
                    </motion.button>
                  </div>
                </aside>

                <div className="flex items-center justify-center w-full relative">
                  <div
                    ref={containerRef}
                    className="bg-white overflow-hidden w-[90%] h-[90%] items-center flex md:p-18 p-9 rounded-2xl border-3 border-gray-300 relative"
                  >
                    <span className="md:text-8xl text-4xl font-bold absolute" style={{ userSelect: "none" }}>
                      {currentText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-full h-full bg-gray-300 -right-3 top-3 rounded-2xl -z-10" />
        </motion.div>

      </section>
    </main>
  );
};

export default Hero;
