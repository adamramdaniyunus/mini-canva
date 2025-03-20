import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-9.5vh)]">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
