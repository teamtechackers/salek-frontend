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
  const [openModal, setOpenModal] = useState(false); // Renamed from openAdd
  const [selectedVaccine, setSelectedVaccine] = useState(null); // To pass to VaccineModal for editing
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  // const [searchType, setSearchType] = useState("name"); // Default search type - REMOVED

  const adminId = localStorage.getItem("adminId");

  const { data, error, isLoading, refetch } = useGetVaccinesQuery({
    admin_user_id: adminId,
    page: currentPage - 1, // API expects 0-indexed page
    limit: pageSize,
    // Pass search and category to the API for initial filtering
    search: search, // Keep search for API if backend supports it
    category: category,
  });

  const allVaccines = data?.data?.vaccines || [];

  // Client-side filtering for search across multiple fields
  const filteredVaccinesBySearch = allVaccines.filter((vaccine) => {
    if (!search) return true; // If no search term, return all vaccines

    const searchValue = search.toLowerCase();
    // Search across name, site, and type
    return (
      String(vaccine.name).toLowerCase().includes(searchValue) ||
      String(vaccine.site).toLowerCase().includes(searchValue) ||
      String(vaccine.type).toLowerCase().includes(searchValue)
    );
  });

  const vaccinesData = filteredVaccinesBySearch; // Use client-side filtered data
  const totalItems = data?.data?.pagination?.total || 0; // Total from API, not filtered count
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [search, category, pageSize]);

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
          <div className="flex w-full items-center justify-between">
            {/* Left - Search and Search Type */}
            <div className="w-1/2 flex items-center gap-3">
            
              <SearchBar value={search} onChange={setSearch} onSearch={refetch} />
            </div>

            {/* Right - Category + Add Button */}
            <div className="w-1/2 flex items-center justify-end gap-3">
              {/* Search type dropdown removed as per request */}
              <CategoryDropdown selectedCategory={category} onCategoryChange={setCategory} />
              <button
                className="bg-[#245FFF] rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition"
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
            {vaccinesData.length > 0 ? (
              <VaccineTable
                vaccines={vaccinesData}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                refetch={refetch}
                onEdit={(vaccine) => { // Pass onEdit handler to VaccineTable
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
        vaccine={selectedVaccine} // Pass selected vaccine for editing
      />
    </>
  );
};

export default VaccineLibrary;
