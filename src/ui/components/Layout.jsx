import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 bg-gray-100 p-6 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
