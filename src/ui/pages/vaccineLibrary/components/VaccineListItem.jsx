import { useEffect } from "react";
import { ICONS } from "../../../constants/assets";

export default function VaccineListItem({ item, onEdit, onDelete }) {

useEffect(()=>{

},[])


  const ageRange =
    item.age_range?.min_age_months !== null && item.age_range?.max_age_months !== null
      ? `${item.age_range.min_age_months} - ${item.age_range.max_age_months} months` // Changed to months as per data
      : "N/A";

  return (
    <div className="flex items-center min-h-[70px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition ">
      <div className="flex justify-start items-center w-[18%] ml-6">{item.name || "N/A"}</div>
      <div className="flex justify-center items-center w-[14%] text-gray-700 font-medium">{item.category || "N/A"}</div>
      <div className="flex justify-center items-center w-[26%] text-gray-500">{ageRange}</div>
      <div className="flex justify-center items-center w-[14%] text-gray-500">{item.type || "N/A"}</div>
      <div className="flex justify-center items-center w-[14%]">{item.details?.site || "N/A"}</div>
      <div className="flex justify-center items-center gap-5 w-[14%]">
        <button className="p-2 rounded-md hover:bg-blue-100" onClick={() => onEdit(item)}>
          <img src={ICONS.edit} alt="Edit" />
        </button>
        <button className="p-2 rounded-md hover:bg-red-100" onClick={() => onDelete(item)}>
          <img src={ICONS.delete} alt="Delete" />
        </button>
      </div>
    </div>
  );
}
