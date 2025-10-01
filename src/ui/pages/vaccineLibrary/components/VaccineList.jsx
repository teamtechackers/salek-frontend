import { useState } from "react";
// import Searc
import TableTopBar from "./TableTopbar";
import TableHeader from "./TableHeaders";
import TableRow from "./TableRow";
// import Pagination f;
import Pagination from "../../../components/Pagination";
import { vaccines } from "../../../../ui/constants/data/vaccinejson";
export default function VaccineTable() {
  const [currentPage, setCurrentPage] = useState(1);

 

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vaccines.length / itemsPerPage);

  return (
    <div className="p-4">
        <TableTopBar />
      <p className="font-semibold mb-2">Total Vaccine: <span>{vaccines.length}</span></p>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border">
          <TableHeader />
          <tbody className="divide-y">
            {vaccines
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <TableRow key={index} item={item} />
              ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
