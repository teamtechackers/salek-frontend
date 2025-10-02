import { useState } from "react";

export default function DateDropdown() {
  const [selectedDate, setSelectedDate] = useState("");

  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4">
      <select
        className="rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-100"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        <option value="">Select a date</option>
        {dates.map((date, index) => (
          <option key={index} value={date.toISOString()}>
            {formatDate(date)}
          </option>
        ))}
      </select>

      {selectedDate && (
        <p className="mt-3">
          You selected:{" "}
          {formatDate(new Date(selectedDate))}
        </p>
      )}
    </div>
  );
}
