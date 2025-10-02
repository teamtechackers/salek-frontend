import { useState } from "react";
import UsersList from "../../../constants/data/usersData";
import UserListItem from "./UserListItem";
import Pagination from "../../../components/Pagination";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(UsersList.length / pageSize);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = UsersList.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full h-full p-4 flex flex-col">

      <div className="flex w-full items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-gray-700">Total Users:</h2>
        <span className="text-sm text-gray-500">{UsersList.length}</span>
      </div>

      <div className="flex h-[50px] bg-blue-500 text-white font-semibold rounded-lg">
        <div className="flex items-center justify-center w-[14%]">Photo</div>
        <div className="flex items-center justify-center w-[18%]">User</div>
        <div className="flex items-center justify-center w-[26%]">Login</div>
        <div className="flex items-center justify-center w-[14%]">Date</div>
        <div className="flex items-center justify-center w-[14%]">Status</div>
        <div className="flex items-center justify-center w-[14%]">Actions</div>
      </div>

      <div className="flex flex-col gap-2 mt-2 flex-1 overflow-y-auto pr-2">
        {paginatedUsers.map((user, idx) => (
          <UserListItem key={idx} user={user} formatDate={formatDate} />
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UserList;
