import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIDEBAR_LINKS } from "../../constants/layout/SidebarConstants";
import NavItem from "./components/NavItem";
// import { ICONS } from "../../constants/assets";
import { LOGOS } from "../../constants/assets";
import useAuth from "../../../core/hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-[15%] min-h-[768px] bg-[#245FFF] rounded-3xl text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-4 flex justify-center">
        <img src={LOGOS.appLogoWhite} alt="Logo" className="w-32 h-24" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1">
        <ul>
          {SIDEBAR_LINKS.map((link) => (
            <NavItem
              key={link.path}
              text={link.name}
              to={link.path}
              iconDefault={link.iconDefault}
              iconActive={link.iconActive}
            />
          ))}
        </ul>
      </nav>

      {/* Logout Button - Sticky at the bottom */}
      <div 
        className="mt-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isHovered ? 'bg-blue-700 transform translate-x-1' : 'bg-blue-600'
          }`}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;