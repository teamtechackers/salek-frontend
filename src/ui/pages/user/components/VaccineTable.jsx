import React from "react";
import { ICONS } from "../../../constants/assets";

const VaccineTableDisplay = ({ tab, vaccines, onRowClick }) => {
  const displayVaccines = vaccines || [];
  const title = `${tab} Vaccines`;

  const isClickable = tab !== "Completed";

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}:</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="flex h-[50px] bg-[#245FFF] text-white font-semibold w-full">
              <th className="flex items-center justify-center rounded-l-lg w-[25%]">Vaccine Name</th>
              <th className="flex items-center justify-center w-[10%]">Dose</th>
              <th className="flex items-center justify-center w-[15%]">Scheduled Date</th>
              <th className="flex items-center justify-center w-[10%]">Status</th>
              <th className="flex items-center justify-center w-[25%]">Days Remaining</th>
              <th className="flex items-center justify-center w-[10%] rounded-r-lg">Actions</th>
            </tr>
            
          </thead>
          <tbody>
            {displayVaccines.length > 0 ? (
              displayVaccines.map((v, i) => (
                <tr
                  key={i}
                  className={`flex h-[50px] text-black font-semibold w-full transition ${isClickable ? "cursor-pointer" : ""}`}
                  onClick={isClickable && onRowClick ? () => onRowClick(v) : undefined}
                >
                  <td className="flex items-center justify-center rounded-l-lg w-[25%]">{v.vaccine_name}</td>
                  <td className="flex items-center justify-center w-[10%]">{v.dose_number}</td>
                  <td className="flex items-center justify-center w-[15%]">{new Date(v.scheduled_date).toLocaleDateString()}</td>
                  <td className="flex items-center justify-center w-[10%]">{v.status}</td>
                  <td className="flex items-center justify-center w-[25%]">{v.days_remaining}</td>
                  <td className="flex items-center justify-center w-[10%] rounded-r-lg">
                    <button className="text-blue-600 hover:text-blue-800 text-lg">
                      <img src={ICONS.delete} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">No vaccine data available for this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VaccineTableDisplay
