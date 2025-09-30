import { NavLink } from "react-router-dom";
import { SIDEBAR_LINKS } from "../constants/layout/SidebarConstants";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-300 h-full p-4">
      <h2 className="text-xl font-bold">Sidebar</h2>
      <nav>
        <ul>
          {SIDEBAR_LINKS.map((link) => (
            <li key={link.path} className="my-2">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "font-bold text-blue-600" : "text-gray-700"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
