// import Pagination from "../../../components/Pagination" // Pagination is now in Notifications.jsx
import NotificationItem from "./NotificationItme"
import { data } from "../../../constants/data/notificationJson"
import { useState, useEffect } from "react" // Import useEffect
import Pagination from "../../../components/Pagination";

export default function NotificationsList({ currentPage, itemsPerPage, onTotalItemsChange }) { // Accept onTotalItemsChange prop
  const [items, setItems] = useState(data)
  
  useEffect(() => {
    if (onTotalItemsChange) {
      onTotalItemsChange(items.length); 
    }
  }, [items.length, onTotalItemsChange]);

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = (id) => {
    setItems((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
      }
      return updated
    })
  }

  return (
    <div aria-label="Notifications">
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

    
    </div>
  )
}
