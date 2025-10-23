import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-white p-2">
      <Sidebar />


      <div className="flex-1 flex flex-col">
      <Topbar />
        <main className="flex-1 w-auto overflow-auto lg:overflow-hidden mx-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
