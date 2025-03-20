import React from "react";

const Button = ({
  children,
  onClick,
  BG,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  BG?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 flex items-center justify-center gap-2 w-full py-2 text-sm cursor-pointer active:scale-95 transition-all duration-300  text-white rounded-sm ${
        BG ? BG : "bg-blue-500 hover:bg-blue-300"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
