import React, { useState, useEffect } from "react";
import VaccineTable from "./components/VaccineTable";
import PageContainer from "../../components/PageContainer";
import SearchBar from "../../components/Searchbar";
import CategoryDropdown from "./components/CategoryDropdown";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import VaccineModal from "./components/VaccineModal";
import { useGetVaccinesQuery } from "../../../core/services/api/vaccineApi";

const VaccineLibrary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openModal, setOpenModal] = useState(false); // Renamed from openAdd
  const [selectedVaccine, setSelectedVaccine] = useState(null); // To pass to VaccineModal for editing
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const adminId = localStorage.getItem("adminId");

  const queryParams = {
    admin_user_id: adminId,
    page: currentPage,
    limit: pageSize,
  };
  if (search) queryParams.search = search;
  if (category) queryParams.category = category;

  const { data, error, isLoading, refetch } = useGetVaccinesQuery(queryParams);

  const vaccines = data?.data?.vaccines || [];
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.pages || 1;

  if (isLoading) return <div>Loading vaccines...</div>;
  if (error) return <div>Error loading vaccines: {error.message}</div>;

  return (
    <>
      <PageContainer
        topSection={
          <div className="flex w-full items-center justify-between">
            {/* Left - Search */}
            <div className="w-1/2 flex items-center">
              <SearchBar onSearch={setSearch} />
            </div>

            {/* Right - Category + Add Button */}
            <div className="w-1/2 flex items-center justify-end gap-3">
              <CategoryDropdown onCategoryChange={setCategory} />
              <button
                className="bg-blue-500 rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition"
                onClick={() => {
                  setSelectedVaccine(null); // Clear selected vaccine for "Add New"
                  setOpenModal(true);
                }}
              >
                + Add New
              </button>
            </div>
          </div>
        }
        totalSection={
          <TotalSection label="Total Vaccines" count={totalItems} />
        }
        tableSection={
          <div className="w-full h-full">
            <VaccineTable
              vaccines={vaccines}
              currentPage={currentPage}
              itemsPerPage={pageSize}
              refetch={refetch}
              onEdit={(vaccine) => { // Pass onEdit handler to VaccineTable
                setSelectedVaccine(vaccine);
                setOpenModal(true);
              }}
            />
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
      <VaccineModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetch={refetch}
        vaccine={selectedVaccine} // Pass selected vaccine for editing
      />
    </>
  );
};

export default VaccineLibrary;
