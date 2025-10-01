import Pagination from "../../../components/Pagination"
import NotificationItem from "./NotificationItme"
import { data } from "../../../constants/data/notificationJson"
import { useState } from "react"

export default function NotificationsList() {
  const [items, setItems] = useState(data)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = (id) => {
    setItems((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      return updated
    })
  }

  return (
    <section aria-label="Notifications">
      <ul className="m-0 list-none p-0">
        {currentItems.map((n) => (
          <NotificationItem
            key={n.id}
            name={n.name}
            message={n.message}
            time={n.time}
            selected={n.selected}
            avatarUrl={n.avatarUrl}
            onDelete={() => handleDelete(n.id)}
          />
        ))}
      </ul>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </section>
  )
}
