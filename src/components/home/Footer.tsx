import React from "react";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="w-full bg-gray-100 py-6 mt-10">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-gray-600">
          &copy; {year} MiVa. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Terms of Service
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
