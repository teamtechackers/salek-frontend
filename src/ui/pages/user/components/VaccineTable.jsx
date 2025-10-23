import React from "react";
import { ICONS } from "../../../constants/assets";

const VaccineTableDisplay = ({ tab, vaccines }) => {
  const displayVaccines = vaccines || []; // 'vaccines' prop is already the array for the specific tab
  const title = `${tab} Vaccines`;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}:</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-md">
              <th className="text-left py-2 px-3 rounded-l-lg">Vaccine Name</th>
              <th className="text-left py-2 px-3">Dose</th>
              <th className="text-left py-2 px-3">Scheduled Date</th>
              <th className="text-left py-2 px-3">Status</th>
              <th className="text-left py-2 px-3">Days Remaining</th>
              <th className="text-left py-2 px-3 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayVaccines.length > 0 ? (
              displayVaccines.map((v, i) => (
                <tr key={i} className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition">
                  <td className="py-3 px-3 font-medium text-gray-800">{v.vaccine_name}</td>
                  <td className="py-3 px-3 text-gray-600">{v.dose_number}</td>
                  <td className="py-3 px-3 text-gray-600">{new Date(v.scheduled_date).toLocaleDateString()}</td>
                  <td className="py-3 px-3 text-gray-600">{v.status}</td>
                  <td className="py-3 px-3 text-gray-600">{v.days_remaining}</td>
                  <td className="py-3 px-3">
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
