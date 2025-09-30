import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen bg-white p-4">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 w-full overflow-auto lg:overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
