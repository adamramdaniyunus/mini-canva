import React from "react";

const Button = ({
  children,
  type,
  onClick,
  BG,
  disabled
}: {
  children: React.ReactNode;
  onClick?: () => void;
  BG?: string;
  disabled?:boolean
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-wait gap-2 w-full py-2 text-sm cursor-pointer active:scale-95 transition-all duration-300  text-white rounded-sm ${
        BG ? BG : "bg-[#3DB2FF] hover:bg-blue-300"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
