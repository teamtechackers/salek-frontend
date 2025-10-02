import { useState } from "react";

export default function PaginationDropdown({ onChange }) {
  const [pageSize, setPageSize] = useState("All");

  const options = ["All", "10", "50", "100"];

  const handleChange = (e) => {
    const value = e.target.value;
    setPageSize(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <select
        className="rounded-lg py-2 p-3 bg-white shadow-sm border border-gray-100"
        value={pageSize}
        onChange={handleChange}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
