import React from "react";
import { useGetRemindersByUserIdQuery } from "../../../../core/services/api/vaccineApi";
import CircularProgress from "@mui/material/CircularProgress";

const RemindersTab = ({ userId }) => {
  const { data, error, isLoading } = useGetRemindersByUserIdQuery(userId, {
    skip: !userId,
  });

  const reminders = data?.data?.reminders || []; // Assuming API returns { data: { reminders: [...] } }

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );
  if (error) return <p className="text-red-500">Error loading reminders: {error.message}</p>;

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-2">
      {reminders.length > 0 ? (
        reminders.map((reminder, index) => (
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
        ))
      ) : (
        <p className="text-gray-500">No reminders found for this user.</p>
      )}
    </div>
  );
};

export default RemindersTab;
