import { useEffect } from "react";
import { ICONS } from "../../../constants/assets";

export default function VaccineListItem({ item, onEdit, onDelete, onRowClick }) { // Added onRowClick prop

useEffect(()=>{

},[])


  const ageRange =
    item.age_range?.min_age_months !== null && item.age_range?.max_age_months !== null
      ? `${item.age_range.min_age_months} - ${item.age_range.max_age_months} months` // Changed to months as per data
      : "N/A";

  return (
    <div
      className="flex items-center min-h-[60px] bg-white border border-blue-300 rounded-2xl shadow-sm hover:bg-blue-100 transition mt-2 cursor-pointer"
      onClick={() => onRowClick(item)} 
    >
      <div className="flex justify-start items-center w-[18%] ml-6">{item.name || "N/A"}</div>
      <div className="flex justify-center items-center w-[14%] text-[#2F3339] font-medium">{item.category || "N/A"}</div>
      <div className="flex justify-center items-center w-[26%] text-[#2F3339]">{ageRange}</div>
      <div className="flex justify-center items-center w-[14%] text-[#2F3339]">{item.type || "N/A"}</div>
      <div className="flex justify-center items-center w-[14%] text-[#2F3339]">{item.details?.site || "N/A"}</div>
      <div className="flex justify-center items-center gap-5 w-[14%]">
        <button
          className="p-2 rounded-md hover:bg-blue-100"
          onClick={(e) => {
            e.stopPropagation(); // Stop propagation to prevent row click
            onEdit(item);
          }}
        >
          <img src={ICONS.edit} alt="Edit" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation(); // Stop propagation to prevent row click
            onDelete(item);
          }}
        >
          <img src={ICONS.delete} alt="Delete" />
        </button>
      </div>
    </div>
  );
}
