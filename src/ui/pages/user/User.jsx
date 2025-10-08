import { useState } from "react";
import SearchBar from "../../components/Searchbar";
import DateDropdown from "./components/DateDropdown";
import PaginationDropdown from "./components/PaginationDropdown";
import UserList from "./components/UserList";

const User = () => {
  const [userDetails, setUserDetails]=useState(false)

  const handlePageSizeChange = (value) => {};

  return (
    <div className="flex flex-col w-full h-full px-4">

      <div className="flex w-full h-[100px] px-4">
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
      
    </div>
  );
};

export default User;
