// import { Pencil, Trash } from "lucide-react";

import { useState } from "react";
import { ICONS } from "../../../constants/assets";
import { ConfirmDeleteModal } from "../../../components/ConfirmDeleteDialogBox";
import { dashboardlabels } from "../../../constants/pages/Labels";

export default function TableRow({ item  ,onDelete }) {
  const [open, setOpen] = useState(false)
    return (
      <>
      
      <tr className="hover:bg-gray-100">
        <td className="px-4 py-2">{item.vaccine}</td>
        <td className="px-4 py-2">{item.category}</td>
        <td className="px-4 py-2">{item.age}</td>
        <td className="px-4 py-2">{item.type}</td>
        <td className="px-4 py-2">{item.dose}</td>
        <td className="px-4 py-2">{item.route}</td>
        <td className="px-4 py-2">{item.site}</td>
        <td className="px-4 py-2 flex gap-2">
          <button className="p-2 rounded-md hover:bg-blue-100">
            <img src={ICONS.editvacine} alt="" />
          </button>
          <button className="p-2 rounded-md hover:bg-red-100"
          onClick={() => setOpen(true)}
          >
         <img src={ICONS.deletevacine} alt="" />
          </button>
        </td>
      </tr>
      <ConfirmDeleteModal
          open={open}
          title={dashboardlabels.title}
          description={dashboardlabels.description}
          onClose={() => setOpen(false)}
          onConfirm={async () => {
            await onDelete()
            setOpen(false)
          }}
        />
            </>
    );
  }
  