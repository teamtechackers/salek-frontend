import NotificationsList from "./components/Notificationlist"
import SearchBar from "../../components/Searchbar";
import { ICONS } from "../../constants/assets"
import { useState } from "react"
import { STYLES } from "../../theme/typography/styles"
import { dashboardlabels } from "../../constants/pages/Labels"
import PageContainer from "../../components/PageContainer"; // Import PageContainer
import Pagination from "../../components/Pagination"; // Import Pagination

export default function Notification() {
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0); // State for total count
  const itemsPerPage = 5; // Assuming 5 items per page for notifications
  const totalPages = Math.ceil(totalNotifications / itemsPerPage);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    console.log("Searching notifications:", searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleTotalItemsChange = (total) => {
    setTotalNotifications(total); 
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchBar onSearchChange={handleSearch} />
        </div>

        <select
          className="rounded-lg py-2 p-3 bg-white shadow-sm border border-gray-100 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={dashboardlabels.selectDate}
        >
          <option>15 Oct 2025</option> {/* Placeholder date from image */}
        </select>
      </div>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Notifications:
        </h2>
        <span className="text-xl font-bold text-gray-800">
          {totalNotifications}
        </span>
      </div>

      <NotificationsList
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onTotalItemsChange={handleTotalItemsChange} // Pass handler
      />

      {/* Pagination */}
      <div className="mt-6 flex justify-end"> {/* Aligned to right */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </PageContainer>
  )
}
