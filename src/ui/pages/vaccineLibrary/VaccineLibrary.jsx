import React, { useState, useEffect } from "react";
import VaccineTable from "./components/VaccineTable";
import PageContainer from "../../components/PageContainer";
import SearchBar from "../../components/Searchbar";
import CategoryDropdown from "./components/CategoryDropdown";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import VaccineModal from "./components/VaccineModal";
import { useGetVaccinesQuery } from "../../../core/services/api/vaccineApi";
import CircularProgress from "@mui/material/CircularProgress";

const VaccineLibrary = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const adminId = localStorage.getItem("adminId");

  const { data, error, isLoading, refetch } = useGetVaccinesQuery({
    admin_user_id: adminId,
    page: currentPage - 1,
    limit: pageSize,
    search: search || undefined, // Pass search to API
  });

  const allVaccines = data?.data?.vaccines || [];

  // Client-side filtering for search across multiple fields
  const filteredVaccinesBySearch = allVaccines.filter((vaccine) => {
    if (!search) return true;

    const searchValue = search.toLowerCase();
    // Search across name, site, and type
    return (
      String(vaccine.name).toLowerCase().includes(searchValue) ||
      String(vaccine.site).toLowerCase().includes(searchValue) ||
      String(vaccine.type).toLowerCase().includes(searchValue)
    );
  });

  // Client-side filtering for category
  const filteredVaccinesByCategory = filteredVaccinesBySearch.filter((vaccine) => {
    if (!category || category === "") return true;
    return String(vaccine.category).toLowerCase() === String(category).toLowerCase();
  });

  const vaccinesData = filteredVaccinesByCategory;
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    // Reset page when pageSize or search changes
    setCurrentPage(1);
  }, [pageSize, search]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );
  if (error) return <div>Error loading vaccines: {error.message}</div>;

  return (
    <>
      <PageContainer
        topSection={
          <div className="flex w-full items-center justify-between mt-4">
            <div className="w-1/2 flex items-center gap-3">
              <SearchBar 
                value={search} 
                onChange={(newSearch) => {
                  setSearch(newSearch);
                }} 
                onSearch={refetch} 
              />
            </div>

            <div className="w-1/2 flex items-center justify-end gap-3">
              <CategoryDropdown 
                selectedCategory={category} 
                onCategoryChange={(newCategory) => {
                  setCategory(newCategory);
                }} 
              />
              <button
                className="bg-[#245FFF] rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition"
                onClick={() => {
                  setSelectedVaccine(null);
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
            {vaccinesData.length > 0 ? (
              <VaccineTable
                vaccines={vaccinesData}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                refetch={refetch}
                onEdit={(vaccine) => {
                  setSelectedVaccine(vaccine);
                  setOpenModal(true);
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">No Data Found</div>
            )}
          </div>
        }
        paginationSection={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        }
      />
      <VaccineModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetch={refetch}
        vaccine={selectedVaccine}
      />
    </>
  );
};

export default VaccineLibrary;