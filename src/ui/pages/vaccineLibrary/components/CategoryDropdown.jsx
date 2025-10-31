import { useState } from "react";

export default function CategoryDropdown({ selectedCategory, onCategoryChange }) {
  const categories = [
    "Pregnancy",
    "Infant",
    "Child",
    "Adult",
    "Elderly",
    "Travel",
  ];

  return (
      <select
      className="rounded-lg py-2 px-2 bg-white shadow-sm border border-gray-100"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

     
  );
}
