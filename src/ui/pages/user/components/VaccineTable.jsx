import React from "react";
import { ICONS } from "../../../constants/assets";

const VaccineTableDisplay = ({ tab, vaccines }) => (
  <>
    <h3 className="text-lg font-semibold text-gray-600 mb-2">{tab}:</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white text-md">
            <th className="text-left py-2 px-3 rounded-l-lg">Vaccine</th>
            <th className="text-left py-2 px-3">Hospital</th>
            <th className="text-left py-2 px-3">Dose</th>
            <th className="text-left py-2 px-3">Date</th>
            <th className="text-left py-2 px-3">Time</th>
            {tab === "Completed" && <th className="text-left py-2 px-3">Certificate</th>}
            <th className="text-left py-2 px-3">Status</th>
            <th className="text-left py-2 px-3 rounded-r-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((v, i) => (
            <tr key={i} className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition">
              <td className="py-3 px-3 font-medium text-gray-800">{v.vaccine}</td>
              <td className="py-3 px-3 text-gray-600">{v.hospital}</td>
              <td className="py-3 px-3 text-gray-600">{v.dose}</td>
              <td className="py-3 px-3 text-gray-600">{v.date}</td>
              <td className="py-3 px-3 text-gray-600">{v.time}</td>
              {tab === "Completed" && <td className="py-3 px-3 text-gray-600">{v.certificate}</td>}
              <td className="py-3 px-3">
                <img src={v.status ? ICONS.status : ICONS.inactiveStatus} alt="status" />
              </td>
              <td className="py-3 px-3">
                <button className="text-blue-600 hover:text-blue-800 text-lg">
                  <img src={ICONS.delete} alt="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default VaccineTableDisplay