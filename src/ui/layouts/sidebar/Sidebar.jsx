import { SIDEBAR_LINKS } from "../../constants/layout/SidebarConstants";
import NavItem from "./components/NavItem";
// import { ICONS } from "../../constants/assets";
import { LOGOS } from "../../constants/assets";

const Sidebar = () => {
  return (
    <aside className="w-[15%] min-h-[768px] bg-blue-600 rounded-3xl text-white p-4">
      {/* Logo */}
      <div className="mb-4 flex justify-center">
        <img src={LOGOS.appLogoWhite} alt="Logo" className="w-32 h-24" />
      </div>

      {/* Nav Items */}
      <nav>
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
    </aside>
  );
};

export default Sidebar;
