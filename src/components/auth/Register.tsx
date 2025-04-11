"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import { BsGoogle } from "react-icons/bs";
import { useModalState } from "@/context/ModalContext";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Register = () => {
  const { isOpen, setModal } = useModalState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    console.log(result);

    if (result?.error) {
      alert("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email"
              className="w-full px-3 py-2 rounded-md bg-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="password"
              className="w-full px-3 py-2 rounded-md bg-white border border-gray-700 focus:outline-none"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign in"}
          </Button>
        </form>

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
