import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../../constants/assets";
import { IMAGES } from "../../../constants/assets";
import useAuth from "../../../../core/hooks/useAuth";

const UserDetails = () => {
 

  // Removed handleLogout function since we're removing logout from header

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
        className="w-14 h-14 rounded-full overflow-hidden"
        // onClick={() => setShowDropdown(!showDropdown)}
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

      {/* Dropdown menu - removed logout option */}
     

      {/* Click outside to close dropdown */}
     
    </div>
  );
};

export default UserDetails;