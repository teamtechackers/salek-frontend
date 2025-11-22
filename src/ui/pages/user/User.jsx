import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Searchbar";
import PaginationDropdown from "./components/PaginationDropdown";
import PageContainer from "../../components/PageContainer";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import UserTable from "./components/UserTable";
import { useGetUsersQuery } from "../../../core/services/api/userApi";
import CircularProgress from "@mui/material/CircularProgress";
import EditUserModal from "./components/EditUserModal";
import TextField from "@mui/material/TextField";

const User = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [apiSearch, setApiSearch] = useState("");
  const [apiDate, setApiDate] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isEditingDependent, setIsEditingDependent] = useState(false);
  const [parentUserIdForDependent, setParentUserIdForDependent] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Debounce timer ref
  const searchDebounceTimer = useRef(null);

  // Debug search trigger changes
  useEffect(() => {
    console.log('searchTrigger changed to:', searchTrigger);
  }, [searchTrigger]);

  const { data, error, isLoading, refetch } = useGetUsersQuery({
    page: currentPage - 1,
    limit: pageSize,
    search: apiSearch || undefined,
    date: apiDate || undefined,
    searchTrigger,
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
    setParentUserIdForDependent(parentUserId);
    setOpenEditModal(true);
  };

  const handleCloseFullEdit = () => {
    setOpenEditModal(false);
    setSelectedUserForEdit(null);
    setIsEditingDependent(false);
    setParentUserIdForDependent(null);
  };

  const handleSuccessfulEditAndClose = () => {
    console.log("User.jsx - handleSuccessfulEditAndClose called. Refreshing data.");
    setOpenEditModal(false);
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
  const totalItems = data?.data?.pagination?.total || 0;
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

  // Handle search with debounce
  const handleSearchChange = (newSearch) => {
    console.log('Search onChange triggered with:', newSearch);
    setSearch(newSearch);
    
    // Clear existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    
    // Set new timer
    searchDebounceTimer.current = setTimeout(() => {
      console.log('Debounced search triggered with:', newSearch, 'and date:', selectedDate);
      // Update API parameters and trigger search
      setApiSearch(newSearch);
      setApiDate(selectedDate);
      setSearchTrigger(prev => prev + 1);
    }, 3000); // 3 seconds delay
  };

  // Handle date change with immediate API call
  const handleDateChange = (newDate) => {
    console.log('Date onChange triggered with:', newDate);
    setSelectedDate(newDate);
    // Update API parameters and trigger search immediately
    setApiSearch(search);
    setApiDate(newDate);
    setSearchTrigger(prev => prev + 1);
  };

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
                    onChange={handleSearchChange}
                    onSearch={(searchValue) => {
                      console.log('SearchBar onSearch triggered with search:', searchValue);
                      // Clear the debounce timer if search is triggered manually
                      if (searchDebounceTimer.current) {
                        clearTimeout(searchDebounceTimer.current);
                      }
                      // Update API parameters and trigger search
                      setApiSearch(searchValue);
                      setApiDate(selectedDate);
                      setSearchTrigger(prev => prev + 1);
                    }} 
                  />
                </div>
               
                <div className="w-1/2 flex items-center justify-end gap-3">
                  <TextField
                    type="date"
                    variant="outlined"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      },
                    }}
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
                     onOpenFullEdit={handleOpenFullEdit}
                     onReturnToTable={handleRefetchOnReturn}
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
        parentUserId={parentUserIdForDependent}
        refetchUserDetails={userDetailsRefetch}
        refetchDependentDetails={userDetailsRefetch}
        onSuccessfulEditAndClose={handleSuccessfulEditAndClose}
      />
    </>
  );
};

export default User;