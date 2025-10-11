import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItme";
import { data as initialData } from "../../../constants/data/notificationJson";
import Pagination from "../../../components/Pagination"; // if you need in-list pagination (optional)
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";


export default function NotificationsList({
  currentPage = 1,
  itemsPerPage = 10,
  onTotalItemsChange,
  onPageChange,
}) {
  const [items, setItems] = useState(Array.isArray(initialData) ? initialData : []);

  useEffect(() => {
    if (typeof onTotalItemsChange === "function") {
      onTotalItemsChange(items.length);
    }
  }, [items.length, onTotalItemsChange]);

  const page = Number(currentPage) || 1;
  const perPage = Math.max(1, Number(itemsPerPage) || 10);

  const startIndex = (page - 1) * perPage;
  const currentItems = items.slice(startIndex, startIndex + perPage);



  return (
    <div aria-label="Notifications">
      {currentItems.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications to show.</div>
      ) : (
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
      )}

     
    </div>
  );
}
