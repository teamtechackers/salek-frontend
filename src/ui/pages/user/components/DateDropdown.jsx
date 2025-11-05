import { useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";

export default function DateDropdown() {
  const [selectedDate, setSelectedDate] = useState("");

  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-4">
      <FormControl size="small" fullWidth>
        <Select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          displayEmpty
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
          <MenuItem value="">
            <div>Select a date</div>
          </MenuItem>
          {dates.map((date, index) => {
            const formatted = formatDate(date);
            return (
              <MenuItem key={index} value={formatted}>
                {formatted}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}