"use client";
import React from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import { BsGoogle } from "react-icons/bs";
import { useModalState } from "@/context/ModalContext";

const Register = () => {
  const { isOpen, setModal } = useModalState();
  const closeModal = () => {
    setModal(false);
  };
  return (
    <div
      className={`fixed ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } inset-0 flex items-center justify-center bg-black/50 transition-all duration-300`}
    >
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Login or sign up in seconds</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 cursor-pointer active:text-gray-200"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="email"
              className="w-full px-3 py-2 rounded-md bg-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="password"
              className="w-full px-3 py-2 rounded-md bg-white border border-gray-700 focus:outline-none"
            />
          </div>
          <Button>
            Sign in
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-2 text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-2">
          <Button BG="bg-black hover:bg-gray-500">
            <span className="text-lg">
              <BsGoogle />
            </span>{" "}
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
