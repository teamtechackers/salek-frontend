import ListItem from "./ListItem";
import { NotificationsListData } from "../../../constants/data/dashboardData";

const ListBox = () => {
  return (
    <div className="flex-1 bg-gray-100 rounded-2xl shadow-md p-4 flex flex-col">
      
      <h2 className="text-lg font-semibold">Recent Activity Feed</h2>
      <p className="text-sm text-gray-500 mb-4">Latest user actions</p>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">Notification</h3>
        <span className="text-sm text-gray-600">{NotificationsListData.length}</span>
      </div>
      <hr className="border-gray-300 mb-3" />

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {NotificationsListData.map((item, idx) => (
          <ListItem
            key={idx}
            image={item.image}
            name={item.name}
            role={item.role}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
};

export default ListBox;
