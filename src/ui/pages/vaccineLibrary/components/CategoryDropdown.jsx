import { useState } from "react";

export default function CategoryDropdown() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Pregnancy",
    "Infant",
    "Child",
    "Adult",
    "Elderly",
    "Travel",
  ];

  return (
    <div className="p-4">
      <select
        className="rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-100"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.toLowerCase()}>
            {category}
          </option>
        ))}
      </select>

     
    </div>
  );
}
