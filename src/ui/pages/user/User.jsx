import { useState } from "react";
import SearchBar from "../../components/Searchbar";
import DateDropdown from "./components/DateDropdown";
import PaginationDropdown from "./components/PaginationDropdown";
import UserList from "./components/UserList";
import PageContainer from "../../components/PageContainer";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import UserTable from "./components/UserTable";

const User = () => {
  const [userDetails, setUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const totalItems = UserList.length;
  const totalPages = Math.ceil(totalItems / pageSize);


  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

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
      totalSection={<TotalSection label="Total Users" count={100} />}
      tableSection={
             <div className="w-full h-full">
               <UserTable currentPage={currentPage} itemsPerPage={pageSize}  userDetails={userDetails} setUserDetails={setUserDetails}/>
             </div>
           }
      paginationSection={
        <div className="flex justify-end">
       
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(10 / pageSize)}
              onPageChange={setCurrentPage}
            />
         

        </div>
      }
      userDetails={userDetails}

    />
  );
};

export default User;
