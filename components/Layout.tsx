import React from "react";

import FollowBar from "@/components/layout/FollowBar";
import Sidebar from "@/components/layout/Sidebar";
import TrendsBar from "./layout/TrendsBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-max min-h-screen bg-black">
      <div className="container h-full mx-auto xl:px-30 max-w-6xl bg-black">
        <div className="grid grid-cols-4 h-full bg-black">
          <Sidebar />
          <div
            className="
              col-span-3 
              lg:col-span-2 
              border-x-[1px] 
              border-neutral-800
          "
          >
            {children}
          </div>

          <div className="flex flex-col">
            <FollowBar />
            <TrendsBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
