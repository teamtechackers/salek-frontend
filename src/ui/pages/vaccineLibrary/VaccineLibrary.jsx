import React, { useState, useEffect, useRef } from "react";
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
  const [apiSearch, setApiSearch] = useState("");
  const [apiCategory, setApiCategory] = useState("");

  // Debounce timer ref
  const searchDebounceTimer = useRef(null);

  const [searchTrigger, setSearchTrigger] = useState(0);

  const adminId = localStorage.getItem("adminId");

  const { data, error, isLoading, refetch } = useGetVaccinesQuery({
    admin_user_id: adminId,
    page: currentPage - 1,
    limit: pageSize,
    search: apiSearch || undefined,
    category: apiCategory || undefined,
    searchTrigger,
  });

  const allVaccines = data?.data?.vaccines || [];

  // Since we're now using backend filtering, we don't need client-side filtering
  const vaccinesData = allVaccines;
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    // Only reset page when pageSize changes
    // Don't reset page when search or category changes to prevent unwanted API calls
  }, [pageSize]);

  // Handle search with debounce
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    
    // Clear existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    
    // Set new timer
    searchDebounceTimer.current = setTimeout(() => {
      // Update API parameters and trigger search
      setApiSearch(newSearch);
      setApiCategory(category);
      setSearchTrigger(prev => prev + 1);
    }, 3000); // 3 seconds delay
  };

  // Handle category change with immediate API call
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Update API parameters and trigger search immediately
    setApiSearch(search);
    setApiCategory(newCategory);
    setSearchTrigger(prev => prev + 1);
  };

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
                onChange={handleSearchChange}
                onSearch={(searchValue) => {
                  // Clear the debounce timer if search is triggered manually
                  if (searchDebounceTimer.current) {
                    clearTimeout(searchDebounceTimer.current);
                  }
                  // Update API parameters and trigger search
                  setApiSearch(searchValue);
                  setApiCategory(category);
                  setSearchTrigger(prev => prev + 1);
                }} 
              />
            </div>

            <div className="w-1/2 flex items-center justify-end gap-3">
              <CategoryDropdown 
                selectedCategory={category} 
                onCategoryChange={handleCategoryChange}
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