import { ICONS } from "../../../constants/assets";
import { useState } from "react";
import { Switch } from "@mui/material";

const HospitalsListItem = ({ item, onEdit, onDelete, onToggleStatus }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const status = item.is_active === true ? "Active" : "Inactive";
    // Matching UserListItem status logic/colors if applicable, but design shows a toggle for hospitals in the first image
    // "Status" column in the first image shows a toggle switch. UserListItem has a badge. 
    // The user prompt says "jis trha table... ki positioning h".
    // The image shows a Toggle switch for Status, and Edit/Delete icons for Action.
    // I will implement the Toggle switch as seen in the first image (Hospitals page design).

    return (
        <div
            className="flex items-center min-h-[60px] bg-white border border-blue-300 rounded-2xl shadow-sm hover:bg-blue-100 transition cursor-pointer mt-2"
        >
            <div className="flex justify-center items-center w-[10%]">
                {item.image && !imageError ? (
                    <img
                        src={item.image}
                        alt="Hospital"
                        className="w-18 h-1 rounded-lg object-cover"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg object-cover bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-l">
                            {item.name ? item.name.charAt(0).toUpperCase() : 'H'}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center w-[20%] text-[#2F3339] font-medium text-center px-2">{item.name || "N/A"}</div>
            <div className="flex justify-center items-center w-[12%] text-[#2F3339] text-center px-2">{item.country || "N/A"}</div>
            <div className="flex justify-center items-center w-[12%] text-[#2F3339] text-center px-2">{item.state || "N/A"}</div>
            <div className="flex justify-center items-center w-[12%] text-[#2F3339] text-center px-2">{item.city || "N/A"}</div>
            <div className="flex justify-center items-center w-[17%] text-[#2F3339] text-center">{item.phone_number || "N/A"}</div>
            <div className="flex justify-center items-center w-[8%]">
                <Switch
                    checked={item.is_active}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleStatus(item.id)}
                    color="primary"
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#245FFF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#245FFF',
                        },
                    }}
                />
            </div>
            <div className="flex justify-center items-center gap-3 w-[9%]">
                <button
                    className="p-2 rounded-md hover:bg-blue-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                    }}
                >
                    <img src={ICONS.edit} alt="Edit" />
                </button>
                <button
                    className="p-2 rounded-md hover:bg-red-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                >
                    <img src={ICONS.delete} alt="Delete" />
                </button>
            </div>
        </div>
    );
};

export default HospitalsListItem;
