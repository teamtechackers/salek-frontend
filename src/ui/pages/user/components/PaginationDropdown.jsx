import { useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";

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
      <FormControl size="small" fullWidth>
        <Select
          value={pageSize}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px !important',
              backgroundColor: 'white',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '10px !important',
              borderColor: 'rgba(0, 0, 0, 0.1) !important',
            },
          }}
        >
          {options.map((opt, index) => (
            <MenuItem key={index} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}