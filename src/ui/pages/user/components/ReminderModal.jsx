import React from "react";
import { ICONS } from "../../../constants/assets";
import { useGetRemindersQuery } from "../../../../core/services/api/vaccineApi";
import CircularProgress from "@mui/material/CircularProgress";

const ReminderModal = ({ open, onClose, userId, userVaccineId, vaccineName }) => {
  if (!open) return null;

  const { data, error, isLoading } = useGetRemindersQuery(
    { user_id: userId, user_vaccine_id: userVaccineId },
    { skip: !open || !userId || !userVaccineId }
  );

  const reminders = data?.data?.reminders || [];

  return (
    <div className="fixed inset-0  flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Reminders for {vaccineName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <img src={ICONS.cross} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <CircularProgress />
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading reminders: {error.message}</p>
        ) : reminders.length > 0 ? (
          <div className="space-y-3 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <p className="font-medium text-gray-700">{reminder.title}</p>
                <p className="text-sm text-gray-500">
                  Message: {reminder.message}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(reminder.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Time: {reminder.time}
                </p>
                <p className="text-sm text-gray-500">
                  Frequency: {reminder.frequency}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reminders found for this vaccine.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
