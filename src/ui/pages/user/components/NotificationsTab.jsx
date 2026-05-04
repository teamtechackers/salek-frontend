import React from "react";
import { useGetNotificationsQuery } from "../../../../core/services/api/notificationApi";
import NotificationItem from "../../notifications/components/NotificationItem";
import CircularProgress from "@mui/material/CircularProgress";

const NotificationsTab = ({ userId }) => {
  const { data, error, isLoading } = useGetNotificationsQuery();

  const notifications = data?.data?.notifications || [];

  const userNotifications = notifications.filter(
    (notification) => notification.userId === userId
  );

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  );
  if (error) return <p className="text-red-500">Error loading notifications: {error.message}</p>;

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-2">
      {userNotifications.length > 0 ? (
        userNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            name={notification.name} // Adjust according to actual notification data structure
            message={notification.message}
            time={notification.time}
            selected={notification.selected}
            avatarUrl={notification.avatarUrl}
            onDelete={() => {}} // Placeholder for delete action
          />
        ))
      ) : (
        <p className="text-gray-500">No notifications found for this user.</p>
      )}
    </div>
  );
};

export default NotificationsTab;
