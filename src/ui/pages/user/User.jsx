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
import EditUserModal from "./components/EditUserModal"; // Import the proper edit modal

const User = () => {
  const [userDetails, setUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("username"); // Default search type for users
  const [selectedDate, setSelectedDate] = useState(""); // Single state for selected date
  const [openEditModal, setOpenEditModal] = useState(false); // State for proper edit modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // State to hold user/dependent for proper edit
  const [isEditingDependent, setIsEditingDependent] = useState(false); // State to differentiate user/dependent edit
  const [parentUserIdForDependent, setParentUserIdForDependent] = useState(null); // State to hold parent user ID for dependent edit

  const { data, error, isLoading, refetch } = useGetUsersQuery({
    page: currentPage - 1, // API expects 0-indexed page
    limit: pageSize,
  });
  
  // State to hold the refetch function for user details
  const [userDetailsRefetch, setUserDetailsRefetch] = useState(null);
  
  // Callback to receive refetch function from UserTable
  const handleRefetchUserDetails = (refetchFn) => {
    setUserDetailsRefetch(() => refetchFn);
  };

  const handleOpenFullEdit = (userOrDependent, isDependent = false, parentUserId = null) => {
    console.log("User.jsx - handleOpenFullEdit called with:", userOrDependent, "isDependent:", isDependent, "parentUserId:", parentUserId);
    setSelectedUserForEdit(userOrDependent);
    setIsEditingDependent(isDependent);
    setParentUserIdForDependent(parentUserId); // Set parent user ID
    setOpenEditModal(true);
  };

  const handleCloseFullEdit = () => {
    setOpenEditModal(false);
    setSelectedUserForEdit(null);
    setIsEditingDependent(false);
    setParentUserIdForDependent(null); // Clear parent user ID
  };

  const handleSuccessfulEditAndClose = () => {
    console.log("User.jsx - handleSuccessfulEditAndClose called. Navigating to main table and refetching.");
    setOpenEditModal(false); // Close the modal
    setSelectedUserForEdit(null);
    setIsEditingDependent(false);
    setParentUserIdForDependent(null);
    setUserDetails(false); // Go back to the main user list view
    refetch(); // Refetch the main user list
  };

  const allUsers = data?.data?.users || [];

  // Client-side filtering for selectedDate
  // Client-side filtering for search and searchType
  const filteredUsersBySearch = allUsers.filter((user) => {
    if (!search) return true; // If no search term, return all users

    const searchValue = search.toLowerCase();
    const userValue = String(user[searchType]).toLowerCase(); // Get user property based on searchType

    return userValue.includes(searchValue);
  });

  // Client-side filtering for selectedDate
  const filteredUsersByDate = filteredUsersBySearch.filter((user) => {
    let matchesDOB = true;
    if (selectedDate && user.DOB) {
      const userDOB = new Date(user.DOB);
      const filterDate = new Date(selectedDate);
      // Compare only year, month, and day
      matchesDOB = userDOB.getFullYear() === filterDate.getFullYear() &&
                   userDOB.getMonth() === filterDate.getMonth() &&
                   userDOB.getDate() === filterDate.getDate();
    }
    return matchesDOB;
  });

  const usersData = filteredUsersByDate || [];
  const totalItems = data?.data?.pagination?.total || 0; // Total from API, not filtered count
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [pageSize, selectedDate]);

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
    <>
      <PageContainer
        topSection={
          <div className="flex w-full">
            {!userDetails && (
              <div className="mt-4 flex w-full items-center justify-between">
                <div className="w-1/2 flex items-center justify-start gap-3">
                 
                  <SearchBar value={search} onChange={setSearch} onSearch={() => { /* client-side filtering handled by state update */ }} />
                </div>
               
                <div className="w-1/2 flex items-center justify-end gap-3">
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
                  <input
                    type="date"
                    className="rounded-lg py-2 px-3 bg-white shadow-sm border border-gray-100"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Select Date of Birth"
                  />
                </div>
              </div>
            )}
          </div>
        }
        totalSection={<TotalSection label="Total Users" count={totalItems} />}
        tableSection={
               <div className="w-full h-full">
                 {usersData.length > 0 ? (
                   <UserTable
                     users={usersData}
                     currentPage={currentPage}
                     itemsPerPage={pageSize}
                     userDetails={userDetails}
                     setUserDetails={setUserDetails}
                     refetch={refetch}
                     refetchUserDetails={userDetailsRefetch}
                     onRefetchUserDetails={handleRefetchUserDetails}
                     onOpenFullEdit={handleOpenFullEdit} // Pass the new handler
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
                onPageChange={(page) => setCurrentPage(page)}
              />
          </div>
        }
        userDetails={userDetails}
      />
      {/* Proper Edit Modal */}
      <EditUserModal
        open={openEditModal}
        onClose={handleCloseFullEdit}
        user={selectedUserForEdit}
        isDependent={isEditingDependent}
        parentUserId={parentUserIdForDependent} // Pass parent user ID
        refetchUserDetails={userDetailsRefetch} // Pass refetch for user details
        refetchDependentDetails={null} // This will be handled in UserList for dependent specific refetch
        onSuccessfulEditAndClose={handleSuccessfulEditAndClose} // Pass the new callback
      />
    </>
  );
};

export default User;
