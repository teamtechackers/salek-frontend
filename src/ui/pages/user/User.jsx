import { useState } from "react";
import SearchBar from "../../components/Searchbar";
import DateDropdown from "./components/DateDropdown";
import PaginationDropdown from "./components/PaginationDropdown";
import UserList from "./components/UserList";
import PageContainer from "../../components/PageContainer";

const User = () => {
  const [userDetails, setUserDetails]=useState(false)

  const handlePageSizeChange = (value) => {};

  return (
    <PageContainer>
      <div className="flex w-full h-[100px]">
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

      <div className="w-full h-full flex flex-col">
        <UserList userDetails={userDetails} setUserDetails={setUserDetails} />
      </div>
    </PageContainer>
  );
};

export default User;
