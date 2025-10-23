import React, { useState } from "react";
import SearchBar from "../../components/Searchbar";
import DateDropdown from "../user/components/DateDropdown";
import PaginationDropdown from "../user/components/PaginationDropdown";
import PageContainer from "../../components/PageContainer";
import TotalSection from "../../components/TotalSection";
import Pagination from "../../components/Pagination";
import NotificationsList from "./components/Notificationlist";

const Notifications = () => {
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return (
   <>
    <PageContainer
      topSection={
        <div className="flex w-full">
          <>
            <div className="w-1/2 flex items-center justify-start">
              <SearchBar />
            </div>
            <div className="w-1/2 flex items-center justify-end">
              <DateDropdown />
            </div>
          </>
        </div>
      }
      totalSection={<TotalSection label="Total Notifications" count={totalItems} />}
      tableSection={
        <div className="w-full h-full">
          <NotificationsList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onTotalItemsChange={(n) => {
              setTotalItems(n);
              const pages = Math.max(1, Math.ceil(n / itemsPerPage));
              if (currentPage > pages) setCurrentPage(pages);
            }}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      }
      paginationSection={

           <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
      }
    />
    
      </>
  );
};

export default Notifications;
