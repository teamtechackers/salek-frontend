import { useState } from "react";
import { Catagory } from "../../../components/Styles/buttonstyling";
import { dashboardlabels } from "../../../constants/pages/Labels";
import SearchBar from "../../../layouts/topbar/components/SearchBar";
import { STYLES } from "../../../theme/typography/styles";
import VaccineForm from "./AddNew";
export default function TableTopBar() {
  const [openAdd, setOpenAdd] = useState(false);
    return (
      <div className="flex justify-between items-center mb-4">
       <SearchBar />
        <div className=" mt-10 flex flex-col items-center gap-3">
          <select className={Catagory}>
            <option className={STYLES.Catogory_button} >{dashboardlabels.category}</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md shadow"  onClick={() => setOpenAdd(true)}>
           {dashboardlabels.add}
          </button>
        </div>
        <VaccineForm   open={openAdd} onClose={() => setOpenAdd(false)}/>
      </div>
    );
  }
  