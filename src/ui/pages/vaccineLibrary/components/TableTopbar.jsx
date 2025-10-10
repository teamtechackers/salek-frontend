import { useState } from "react";
import { Catagory } from "../../../components/Styles/buttonstyling";
import { dashboardlabels } from "../../../constants/pages/Labels";
import SearchBar from "../../../components/Searchbar";
import { STYLES } from "../../../theme/typography/styles";
import VaccineForm from "./AddNew";
export default function TableTopBar() {
  const [openAdd, setOpenAdd] = useState(false);
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <select className={Catagory}>
            <option className={STYLES.Catogory_button}>{dashboardlabels.category}</option>
          </select>
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
  