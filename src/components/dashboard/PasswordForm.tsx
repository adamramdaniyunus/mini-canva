"use client";

import { RefObject, useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import Button from "../Button";

export default function PasswordForm({ handleShowSettings, formRef }: { handleShowSettings: () => void; formRef: RefObject<HTMLFormElement | null> }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Manual validation
    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setError("Password must be between 8 and 20 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must include both letters and numbers.");
      return;
    }

    if (/\s/.test(password)) {
      setError("Password cannot contain spaces.");
      return;
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      setError("Password cannot contain special characters or emojis.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await fetch('/api/user', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({password})
      });
      toast.success("Password saved!");
      handleShowSettings()
    } catch (error) {
      console.log(error);
      toast.error("Error when saved profile")
    } finally{
      setLoading(false)
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center">Change Password</h2>
        <button onClick={handleShowSettings} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"><CgClose /></button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Saving.." : "Save"}
      </Button>
    </form>
  );
}
