import { NavLink } from "react-router-dom";

const NavItem = ({ text, iconDefault, iconActive, to }) => {
  return (
    <li className="my-2">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-md transition-colors ${
            isActive
              ? "bg-white text-blue-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? iconActive : iconDefault}
              className="w-4 h-4"
            />
            <span>{text}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

export default NavItem;
