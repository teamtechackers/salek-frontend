import React, { useState, useEffect } from "react";
import SearchBar from "../../components/Searchbar";
// import DateDropdown from "./components/DateDropdown"; // Removed DateDropdown
import PaginationDropdown from "./components/PaginationDropdown";
import PageContainer from "../../components/PageContainer";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import UserTable from "./components/UserTable";
import { useGetUsersQuery } from "../../../core/services/api/userApi";
import CircularProgress from "@mui/material/CircularProgress";

const User = () => {
  const [userDetails, setUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("username"); // Default search type for users
  const [selectedDate, setSelectedDate] = useState(""); // Single state for selected date

  const { data, error, isLoading, refetch } = useGetUsersQuery();
  
  // State to hold the refetch function for user details
  const [userDetailsRefetch, setUserDetailsRefetch] = useState(null);
  
  // Callback to receive refetch function from UserTable
  const handleRefetchUserDetails = (refetchFn) => {
    setUserDetailsRefetch(() => refetchFn);
  };

  const allUsers = data?.data?.users || [];

  // Client-side filtering logic
  const filteredUsers = allUsers.filter((user) => {
    // Search filtering
    let matchesSearch = true;
    if (search) {
      const searchTermLower = search.toLowerCase();
      switch (searchType) {
        case "username":
          matchesSearch = user.username?.toLowerCase().includes(searchTermLower);
          break;
        case "phoneNo":
          matchesSearch = user.phoneNo?.toLowerCase().includes(searchTermLower);
          break;
        case "email":
          matchesSearch = user.email?.toLowerCase().includes(searchTermLower);
          break;
        default:
          matchesSearch = false;
      }
    }

    // Date of Birth filtering
    let matchesDOB = true;
    if (selectedDate && user.DOB) {
      const userDOB = new Date(user.DOB);
      const filterDate = new Date(selectedDate);
      // Compare only year, month, and day
      matchesDOB = userDOB.getFullYear() === filterDate.getFullYear() &&
                   userDOB.getMonth() === filterDate.getMonth() &&
                   userDOB.getDate() === filterDate.getDate();
    }

    return matchesSearch && matchesDOB;
  });

  // Client-side pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [search, searchType, pageSize, selectedDate]); // Added selectedDate to dependencies

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const searchOptions = [
    { value: "username", label: "Username" },
    { value: "phoneNo", label: "Phone Number" },
    { value: "email", label: "Email" },
  ];

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <PageContainer
      topSection={
        <div className="flex w-full">
          {!userDetails && (
            <>
              <div className="w-1/2 flex items-center justify-start gap-3">
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
              <div className="w-1/2 flex items-center justify-end gap-3">
                <input
                  type="date"
                  className="rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-100"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder="Select Date of Birth"
                />
              </div>
            </>
          )}
        </div>
      }
      totalSection={<TotalSection label="Total Users" count={totalItems} />}
      tableSection={
             <div className="w-full h-full">
               {paginatedUsers.length > 0 ? (
                 <UserTable
                   users={paginatedUsers}
                   currentPage={currentPage}
                   itemsPerPage={pageSize}
                   userDetails={userDetails}
                   setUserDetails={setUserDetails}
                   refetch={refetch}
                   refetchUserDetails={userDetailsRefetch}
                   onRefetchUserDetails={handleRefetchUserDetails}
                 />
               ) : (
                 <div className="text-center py-8 text-gray-500">No Data Found</div>
               )}
             </div>
           }
      paginationSection={
        <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
        </div>
      }
      userDetails={userDetails}
    />
  );
};

export default User;
