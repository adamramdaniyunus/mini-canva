import React from "react";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="text-center py-8 text-gray-500 text-sm">
      © {year} Miva. All rights reserved.
    </footer>
  );
};

export default Footer;
