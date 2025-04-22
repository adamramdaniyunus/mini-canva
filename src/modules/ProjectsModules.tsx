import ProjectLists from "@/components/dashboard/ProjectLists";
import DashboardLayout from "@/layout/DashboardLayout";
import React from "react";

const ProjectsModules = () => {
  return (
    <>
      <DashboardLayout>
        <main className="flex-1 p-5 overflow-auto">
          <div className="mt-6">
            <div className="mt-2">
              <ProjectLists />
            </div>
          </div>
        </main>
      </DashboardLayout>
    </>
  );
};

export default ProjectsModules;
