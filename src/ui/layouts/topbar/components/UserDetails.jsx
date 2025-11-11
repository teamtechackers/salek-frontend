import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../../constants/assets";
import { IMAGES } from "../../../constants/assets";
import useAuth from "../../../../core/hooks/useAuth";

const UserDetails = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Use the logout function from the auth hook
    logout();
  };

  return (
    <div className="relative flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer">
        <img
          src={ICONS.topbarNotificationIcon}
          alt="Notification"
          className="w-6 h-6"
        />
      </div>

      <div 
        className="w-14 h-14 rounded-full overflow-hidden cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img
          src={IMAGES.topbarTempUserImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">Admin User</span>
        <span className="text-sm text-gray-500">Admin</span>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute right-0 top-16 bg-white rounded-lg shadow-lg py-2 w-48 z-10">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserDetails;