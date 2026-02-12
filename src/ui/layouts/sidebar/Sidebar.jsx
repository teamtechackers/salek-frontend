import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIDEBAR_LINKS } from "../../constants/layout/SidebarConstants";
import NavItem from "./components/NavItem";
import { LOGOS } from "../../constants/assets";
import useAuth from "../../../core/hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState({});

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = (name) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActiveLink = (path) => location.pathname === path;
  const isParentActive = (children) => children.some((child) => isActiveLink(child.path));

  return (
    <aside className="w-[20%] h-full bg-[#245FFF] rounded-3xl text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <img src={LOGOS.appLogoWhite} alt="Logo" className="w-32 h-24 object-contain" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {SIDEBAR_LINKS.map((link) => (
            <div key={link.name}>
              {link.children ? (
                // Parent Item with Children (Settings)
                <div>
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isParentActive(link.children) || expandedMenu[link.name]
                        ? "bg-white text-blue-600"
                        : "text-white hover:bg-blue-500"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Placeholder Icon for Settings if not provided */}
                      {link.iconDefault ? (
                        <img
                          src={isParentActive(link.children) || expandedMenu[link.name] ? link.iconActive : link.iconDefault}
                          className="w-5 h-5"
                          alt={link.name}
                        />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <span className="font-medium">{link.name}</span>
                    </div>
                    {/* Dropdown Arrow */}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedMenu[link.name] ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Nested Items */}
                  {expandedMenu[link.name] && (
                    <ul className="bg-blue-700/30 rounded-b-xl mt-1 overflow-hidden">
                      {link.children.map((child) => (
                        <li key={child.path}>
                          <div
                            onClick={() => navigate(child.path)}
                            className={`flex items-center gap-3 p-3 pl-11 rounded-xl cursor-pointer transition-colors ${isActiveLink(child.path)
                              ? "bg-[#618CFF] text-white font-medium"
                              : "text-blue-100 hover:bg-blue-600/50 hover:text-white"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              {child.iconDefault ? (
                                <img
                                  src={isActiveLink(child.path) ? child.iconActive : child.iconDefault}
                                  className="w-5 h-5 object-contain"
                                  alt={child.name}
                                />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                              <span>{child.name}</span>
                            </div>
                          </div>
                          {/* Divider after this item if hasDivider is true */}
                          {child.hasDivider && (
                            <div className="w-full h-[1px] bg-white/50 my-2"></div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular Item
                <NavItem
                  key={link.path}
                  text={link.name}
                  to={link.path}
                  iconDefault={link.iconDefault}
                  iconActive={link.iconActive}
                />
              )}
            </div>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div
        className="mt-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isHovered ? 'bg-blue-700 transform translate-x-1' : 'bg-blue-600'
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
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;