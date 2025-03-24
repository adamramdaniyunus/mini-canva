import Header from "@/components/design/Header";
import LeftSidebar from "@/components/design/LeftSidebar";
import RightSidebar from "@/components/design/RightSidebar";
import CreateModules from "./CreateModules";

export default function DesignModules() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Canvas Area */}
          <div className="flex-1 flex justify-center items-center rounded-lg p-4">
            <div className="relative h-auto shadow-lg">
             <CreateModules/>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <RightSidebar />
      </div>
    </div>
  );
}
