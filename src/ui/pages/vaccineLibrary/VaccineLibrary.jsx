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
  const [searchType, setSearchType] = useState("name"); // Default search type

  const adminId = localStorage.getItem("adminId");

  const queryParams = {
    admin_user_id: adminId,
    // Fetch all data initially, or a large enough set to filter client-side
    // For simplicity, I'll remove page/limit for initial fetch if backend supports it,
    // otherwise, we'd need to fetch all pages or a very large limit.
    // Assuming backend can return all data if page/limit are omitted or set to a high value.
    // If not, this approach would require fetching all pages iteratively.
  };

  const { data, error, isLoading, refetch } = useGetVaccinesQuery(queryParams);

  const allVaccines = data?.data?.vaccines || [];

  // Client-side filtering logic
  const filteredVaccines = allVaccines.filter((vaccine) => {
    let matchesSearch = true;
    if (search) {
      const searchTermLower = search.toLowerCase();
      if (searchType === "name") {
        matchesSearch = vaccine.name.toLowerCase().includes(searchTermLower);
      } else if (searchType === "site") {
        matchesSearch = vaccine.details.site.toLowerCase().includes(searchTermLower);
      } else if (searchType === "type") {
        matchesSearch = vaccine.type.toLowerCase().includes(searchTermLower);
      }
    }

    let matchesCategory = true;
    if (category) {
      matchesCategory = vaccine.category.toLowerCase() === category.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  });

  // Client-side pagination
  const totalItems = filteredVaccines.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVaccines = filteredVaccines.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [search, category, searchType, pageSize]);

  const searchOptions = [
    { value: "name", label: "Vaccine Name" },
    { value: "site", label: "Site" },
    { value: "type", label: "Type" },
  ];

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
              <select
                className="rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-100"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                {searchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SearchBar value={search} onChange={setSearch} onSearch={refetch} />
            </div>

            {/* Right - Category + Add Button */}
            <div className="w-1/2 flex items-center justify-end gap-3">
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
            <VaccineTable
              vaccines={paginatedVaccines}
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
