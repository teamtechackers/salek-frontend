import { useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";

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
    <FormControl size="small" sx={{ width: '175px' }}> {/* Set fixed width */}
      <Select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        displayEmpty
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px !important',
            backgroundColor: 'white',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            width: '120px !important', // Fixed width
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '10px !important',
            borderColor: 'rgba(0, 0, 0, 0.1) !important',
          },
        }}
      >
        <MenuItem value="">
          <em>Select a category</em>
        </MenuItem>
        {categories.map((category, index) => (
          <MenuItem key={index} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}