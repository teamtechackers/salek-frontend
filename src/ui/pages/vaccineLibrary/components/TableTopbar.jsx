import { useState } from "react";
import { Catagory } from "../../../components/Styles/buttonstyling";
import { dashboardlabels } from "../../../constants/pages/Labels";
import SearchBar from "../../../components/Searchbar";
import { STYLES } from "../../../theme/typography/styles";
import VaccineForm from "./AddNew";
import { Select, MenuItem, FormControl } from "@mui/material";

export default function TableTopBar() {
  const [openAdd, setOpenAdd] = useState(false);
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <FormControl size="small">
            <Select
              defaultValue={dashboardlabels.category}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px !important',
                  width: '80px !important', // Further reduce width
                  height: '49px',
                  minWidth: '80px !important', // Ensure minimum width
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '10px !important',
                },
                '& .MuiSelect-select': {
                  padding: '8px 12px',
                },
              }}
              displayEmpty
            >
              <MenuItem value={dashboardlabels.category}>{dashboardlabels.category}</MenuItem>
            </Select>
          </FormControl>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow"
            onClick={() => setOpenAdd(true)}
          >
            {dashboardlabels.add}
          </button>
        </div>
      </div>
    );
  }
  