import DesignLists from "@/components/dashboard/DesignLists";
import MainSection from "@/components/dashboard/MainSection";
import DashboardLayout from "@/layout/DashboardLayout";
import React from "react";

const DashboardModules = () => {
  return (
    <>
      <DashboardLayout>
        <main className="flex-1 p-5 overflow-auto">
          <MainSection/>

          <div className="mt-6">
            <h1 className="text-lg font-semibold drop-shadow-sm">
              You recent activities
            </h1>

            <div className="mt-2">
              <DesignLists />
            </div>
          </div>
        </main>
      </DashboardLayout>
    </>
  );
};

export default DashboardModules;
