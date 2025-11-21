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
  const [apiSearch, setApiSearch] = useState(""); // Search parameter for API
  const [apiCategory, setApiCategory] = useState(""); // Category parameter for API

  // Debug state changes
  useEffect(() => {
    console.log('VaccineLibrary state changed - search:', search, 'category:', category, 'apiSearch:', apiSearch, 'apiCategory:', apiCategory);
  }, [search, category, apiSearch, apiCategory]);
  
  // Debug apiSearch changes specifically
  useEffect(() => {
    console.log('apiSearch changed to:', apiSearch);
  }, [apiSearch]);
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger for search refresh

  // Debug search trigger changes
  useEffect(() => {
    console.log('VaccineLibrary searchTrigger changed to:', searchTrigger);
  }, [searchTrigger]);

  const adminId = localStorage.getItem("adminId");

  // Log the parameters being passed to the API
  console.log('VaccineLibrary - API parameters:', { admin_user_id: adminId, page: currentPage - 1, limit: pageSize, search: apiSearch, category: apiCategory, searchTrigger });
  
  const { data, error, isLoading, refetch } = useGetVaccinesQuery({
    admin_user_id: adminId,
    page: currentPage - 1,
    limit: pageSize,
    search: apiSearch || undefined, // Send vaccine search parameter
    category: apiCategory || undefined, // Send selected category
    searchTrigger, // Add search trigger to force re-fetch
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
                  console.log('Search onChange triggered with:', newSearch);
                  setSearch(newSearch);
                }} 
                onSearch={(searchValue) => {
                  console.log('SearchBar onSearch triggered with search:', searchValue, 'category:', category);
                  // Update API parameters and trigger search
                  console.log('Updating API parameters - search:', searchValue, 'category:', category);
                  setApiSearch(searchValue);
                  setApiCategory(category);
                  console.log('Setting apiSearch to:', searchValue);
                  setSearchTrigger(prev => prev + 1);
                }} 
              />
            </div>

            <div className="w-1/2 flex items-center justify-end gap-3">
              <CategoryDropdown 
                selectedCategory={category} 
                onCategoryChange={(newCategory) => {
                  console.log('Category onChange triggered with:', newCategory);
                  setCategory(newCategory);
                  // Don't trigger search automatically, let user click search
                }} 
              />
              <button
                className="bg-[#245FFF] rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition"
                onClick={() => {
                  console.log('Search button clicked with search:', search, 'category:', category);
                  // Update API parameters and trigger search
                  console.log('Updating API parameters - search:', search, 'category:', category);
                  setApiSearch(search);
                  setApiCategory(category);
                  console.log('Setting apiSearch to:', search);
                  setSearchTrigger(prev => prev + 1);
                }}
              >
                Search
              </button>
              <button
                className="bg-gray-500 rounded-lg text-white py-2 px-4 hover:bg-gray-600 transition text-sm"
                onClick={() => {
                  // Clear the search and category filters
                  setSearch("");
                  setCategory("");
                  setApiSearch("");
                  setApiCategory("");
                  setSearchTrigger(prev => prev + 1);
                }}
              >
                Clear
              </button>
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