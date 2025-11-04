import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate hook
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
import TextField from "@mui/material/TextField";

const User = () => {
  const navigate = useNavigate(); // Add navigate hook
  const [userDetails, setUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  // const [searchType, setSearchType] = useState("username"); // Default search type for users - REMOVED
  const [selectedDate, setSelectedDate] = useState(""); // Single state for selected date
  const [appliedDateFilter, setAppliedDateFilter] = useState(""); // State for applied date filter
  const [openEditModal, setOpenEditModal] = useState(false); // State for proper edit modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // State to hold user/dependent for proper edit
  const [isEditingDependent, setIsEditingDependent] = useState(false); // State to differentiate user/dependent edit
  const [parentUserIdForDependent, setParentUserIdForDependent] = useState(null); // State to hold parent user ID for dependent edit
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for data refresh

  const { data, error, isLoading, refetch } = useGetUsersQuery({
    page: currentPage - 1, // API expects 0-indexed page
    limit: pageSize,
    search: search || undefined, // Add search filter to API call
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
    console.log("User.jsx - handleSuccessfulEditAndClose called. Refreshing data.");
    setOpenEditModal(false); // Close the modal
    setSelectedUserForEdit(null);
    setIsEditingDependent(false);
    setParentUserIdForDependent(null);
    
    // Trigger a refresh of all data
    setRefreshTrigger(prev => prev + 1);
  };

  const allUsers = data?.data?.users || [];

  // Client-side filtering for search across multiple fields
  const filteredUsersBySearch = allUsers.filter((user) => {
    if (!search) return true; // If no search term, return all users

    const searchValue = search.toLowerCase();
    // Search across username, phoneNo, and email
    return (
      String(user.username).toLowerCase().includes(searchValue) ||
      String(user.phoneNo).toLowerCase().includes(searchValue) ||
      String(user.email).toLowerCase().includes(searchValue)
    );
  });

  // Client-side filtering for selectedDate
  const filteredUsersByDate = filteredUsersBySearch.filter((user) => {
    if (!selectedDate || !user.DOB) return true; // If no date selected or user has no DOB, return all users
    
    try {
      const userDOB = new Date(user.DOB);
      const filterDate = new Date(selectedDate);
      
      // Compare only year, month, and day
      return userDOB.getFullYear() === filterDate.getFullYear() &&
             userDOB.getMonth() === filterDate.getMonth() &&
             userDOB.getDate() === filterDate.getDate();
    } catch (e) {
      console.error("Error comparing dates:", e);
      return true; // If there's an error, return the user
    }
  });

  const usersData = filteredUsersByDate || [];
  const totalItems = data?.data?.pagination?.total || 0; // Total from API, not filtered count
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    // Only reset page when pageSize or search changes
    setCurrentPage(1);
  }, [pageSize, search]);

  // Effect to refetch data when refresh trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Refresh main user list
      try {
        refetch();
      } catch (e) {
        console.warn("Could not refetch main user list:", e);
      }
      
      // Refresh user details if available
      if (userDetailsRefetch) {
        try {
          userDetailsRefetch();
        } catch (e) {
          console.warn("Could not refetch user details:", e);
        }
      }
    }
  }, [refreshTrigger, refetch, userDetailsRefetch]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  // const searchOptions = [ // REMOVED
  //   { value: "username", label: "Username" },
  //   { value: "phoneNo", label: "Phone Number" },
  //   { value: "email", label: "Email" },
  // ];

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
                 
                  <SearchBar 
                    value={search} 
                    onChange={(newSearch) => {
                      setSearch(newSearch);
                      // Don't reset page when search changes
                    }} 
                    onSearch={() => { /* client-side filtering handled by state update */ }} 
                  />
                </div>
               
                <div className="w-1/2 flex items-center justify-end gap-3">
                  {/* Search type dropdown removed as per request */}
                  <TextField
                    type="date"
                    variant="outlined"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  />
                  {/* <button
                    className="bg-[#245FFF] rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition text-sm"
                    onClick={() => {
                      // Apply the date filter and reset to first page
                      setCurrentPage(1);
                    }}
                  >
                    Apply
                  </button> */}
                  <button
                    className="bg-gray-500 rounded-lg text-white py-2 px-4 hover:bg-gray-600 transition text-sm"
                    onClick={() => {
                      // Clear the date filter and reset to first page
                      setSelectedDate("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </button>
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
        refetchDependentDetails={userDetailsRefetch} // Pass the same refetch function for dependents
        onSuccessfulEditAndClose={handleSuccessfulEditAndClose} // Pass the new callback
      />
    </>
  );
};

export default User;