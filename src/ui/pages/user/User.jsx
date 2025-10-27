import { useState } from "react"; // Removed useEffect
import SearchBar from "../../components/Searchbar";
import DateDropdown from "./components/DateDropdown";
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

  const { data, error, isLoading, refetch } = useGetUsersQuery();
  
  // State to hold the refetch function for user details
  const [userDetailsRefetch, setUserDetailsRefetch] = useState(null);
  
  // Callback to receive refetch function from UserTable
  const handleRefetchUserDetails = (refetchFn) => {
    setUserDetailsRefetch(() => refetchFn);
  };

  const users = data?.data?.users || []; // Explicitly access data.users
  const totalItems = data?.data?.pagination?.total || 0; // Explicitly access data.pagination.total
  const totalPages = data?.data?.pagination?.pages || 1; // Explicitly access data.pagination.pages

  // Debug logging
  console.log("User component - data:", data);
  console.log("User component - users:", users);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

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
              <div className="w-1/2 flex items-center justify-start">
                <SearchBar />
              </div>
              <div className="w-1/2 flex items-center justify-end">
                <DateDropdown />
                <PaginationDropdown onChange={handlePageSizeChange} />
              </div>
            </>
          )}
        </div>
      }
      totalSection={<TotalSection label="Total Users" count={totalItems} />}
      tableSection={
             <div className="w-full h-full">
               {users.length > 0 ? (
                 <UserTable
                   users={users}
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
