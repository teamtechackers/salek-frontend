import { ICONS } from "../../../constants/assets";

const UserListItem = ({ item, handleFunction, onEdit, onDelete  }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="flex items-center min-h-[70px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition cursor-pointer"
      onClick={handleFunction}
    >
      <div className="flex justify-center items-center w-[14%]">
        <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
      </div>
      <div className="flex justify-center items-center w-[18%] text-gray-700 font-medium">{item.name}</div>
      <div className="flex justify-center items-center w-[26%] text-gray-500">{item.email}</div>
      <div className="flex justify-center items-center w-[14%] text-gray-500">{formatDate(item.date)}</div>
      <div className="flex justify-center items-center w-[14%]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            item.status === "Active"
              ? "bg-green-100 text-green-700 border-green-700"
              : "bg-red-100 text-red-700 border-red-700"
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="flex justify-center items-center gap-3 w-[14%]">
        <button
          className="p-2 rounded-md hover:bg-blue-100"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <img src={ICONS.edit} alt="Edit" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-red-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <img src={ICONS.delete} alt="Delete" />
        </button>
      </div>
    </div>
  );
};

export default UserListItem;
