// import { Pencil, Trash } from "lucide-react";

import { ICONS } from "../../../constants/assets";

export default function TableRow({ item }) {
    return (
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
          <button className="p-2 rounded-md hover:bg-red-100">
         <img src={ICONS.deletevacine} alt="" />
          </button>
        </td>
      </tr>
    );
  }
  