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
  const [selectedDate, setSelectedDate] = useState(""); // Single state for selected date
  const [apiSearch, setApiSearch] = useState(""); // Search parameter for API
  const [apiDate, setApiDate] = useState(""); // Date parameter for API
  const [openEditModal, setOpenEditModal] = useState(false); // State for proper edit modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null); // State to hold user/dependent for proper edit
  const [isEditingDependent, setIsEditingDependent] = useState(false); // State to differentiate user/dependent edit
  const [parentUserIdForDependent, setParentUserIdForDependent] = useState(null); // State to hold parent user ID for dependent edit
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for data refresh
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger for search refresh

  // Debug search trigger changes
  useEffect(() => {
    console.log('searchTrigger changed to:', searchTrigger);
  }, [searchTrigger]);

  const { data, error, isLoading, refetch } = useGetUsersQuery({
    page: currentPage - 1, // API expects 0-indexed page
    limit: pageSize,
    search: apiSearch || undefined, // Send name in search parameter
    date: apiDate || undefined, // Send DOB from calendar
    searchTrigger, // Add search trigger to force re-fetch
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

  // Function to trigger refetch when navigating back to user list
  const handleRefetchOnReturn = () => {
    // Trigger a refresh of all data
    setRefreshTrigger(prev => prev + 1);
  };

  const allUsers = data?.data?.users || [];

  // Since we're now using backend filtering, we don't need client-side filtering
  const usersData = allUsers || [];
  const totalItems = data?.data?.pagination?.total || 0; // Total from API, not filtered count
  const totalPages = data?.data?.pagination?.pages || 1;

  useEffect(() => {
    // Only reset page when pageSize changes
    // Don't reset page when search or date changes to prevent unwanted API calls
    console.log('useEffect triggered - dependencies changed');
  }, [pageSize]);

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
                      console.log('Search onChange triggered with:', newSearch);
                      setSearch(newSearch);
                      // Don't reset page when search changes
                    }} 
                    onSearch={(searchValue) => {
                      console.log('SearchBar onSearch triggered with search:', searchValue);
                      // Update API parameters and trigger search
                      setApiSearch(searchValue);
                      setApiDate(selectedDate);
                      setSearchTrigger(prev => prev + 1);
                    }} 
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
                      console.log('Date onChange triggered with:', e.target.value);
                      setSelectedDate(e.target.value);
                      // Don't trigger search automatically, let user click search
                      // setCurrentPage(1);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  />
                  <button
                    className="bg-[#245FFF] rounded-lg text-white py-2 px-4 hover:bg-blue-600 transition text-sm"
                    onClick={() => {
                      console.log('Search button clicked');
                      // Update API parameters and trigger search
                      setApiSearch(search);
                      setApiDate(selectedDate);
                      setSearchTrigger(prev => prev + 1);
                    }}
                  >
                    Search
                  </button>
                  <button
                    className="bg-gray-500 rounded-lg text-white py-2 px-4 hover:bg-gray-600 transition text-sm"
                    onClick={() => {
                      // Clear the date filter and reset to first page
                      setSelectedDate("");
                      setApiDate("");
                      setCurrentPage(1);
                      setSearchTrigger(prev => prev + 1);
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
                     onReturnToTable={handleRefetchOnReturn} // Pass refetch function
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