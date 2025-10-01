import { useState } from "react";
import TableTopBar from "./TableTopbar";
import TableHeader from "./TableHeaders";
import TableRow from "./TableRow";
import Pagination from "../../../components/Pagination";
import { vaccines } from "../../../../ui/constants/data/vaccinejson";
import { dashboardlabels } from "../../../constants/pages/Labels";

export default function VaccineTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(vaccines);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleDelete = (id) => {
    setItems((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 flex flex-col">
      {/* Header Section (Always Visible) */}
      <div className="mb-4">
        <TableTopBar />

        <p className="font-semibold mt-4 flex justify-between text-lg">
          {dashboardlabels.Totalvacine}
          <span>{items.length}</span>
        </p>
      </div>

      {/* Table Section (Takes remaining space) */}
      <div className="flex-1 overflow-y-auto overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full text-sm text-left border">
          <TableHeader />
          <tbody className="divide-y">
            {items.length > 0 ? (
              items
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Stays below table) */}
      
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
     
    </div>
  );
}
