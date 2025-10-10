import React, { useState } from "react";
import VaccineTable from "./components/VaccineTable"; // ✅ correct import (capitalized)
import PageContainer from "../../components/PageContainer";
import SearchBar from "../../components/Searchbar";
import CategoryDropdown from "./components/CategoryDropdown";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import { vaccines } from "../../../ui/constants/data/vaccinejson";
import VaccineForm from "./components/AddNew";

const VaccineLibrary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openAdd, setOpenAdd] = useState(false);

  const totalItems = vaccines.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
    <PageContainer
      topSection={
        <div className="flex w-full items-center justify-between">
          {/* Left - Search */}
          <div className="w-1/2 flex items-center">
            <SearchBar />
          </div>

          {/* Right - Category + Add Button */}
          <div className="w-1/2 flex items-center justify-end gap-3">
            <CategoryDropdown />
            <button className="bg-blue-500 rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition"
                        onClick={() => setOpenAdd(true)}

            >
              + Add New
            </button>
          </div>
        </div>
      }

      totalSection={<TotalSection label="Total Vaccines" count={totalItems} />}

      tableSection={
        <div className="w-full h-full">
          <VaccineTable currentPage={currentPage} itemsPerPage={pageSize} />
        </div>
      }

      paginationSection={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      }
    />
            <VaccineForm open={openAdd} onClose={() => setOpenAdd(false)} />
</>
  );
};

export default VaccineLibrary;
