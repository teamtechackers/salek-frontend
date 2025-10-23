import { ICONS } from "../../../constants/assets";

const UserListItem = ({ item, handleFunction, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const status = item.is_active === true ? "Active" : "Inactive";
  const statusColorClass = item.profile_completed
    ? "bg-green-100 text-green-700 border-green-700"
    : "bg-red-100 text-red-700 border-red-700";

  return (
    <div
      className="flex items-center min-h-[70px] bg-white border border-blue-300 rounded-2xl shadow-sm hover:bg-gray-50 transition cursor-pointer mt-2"
      onClick={handleFunction}
    >
      <div className="flex justify-center items-center w-[14%]">
        <img src={item.image || "https://i.pravatar.cc/100?img=4"} alt={item.username || "User"} className="w-10 h-10 rounded-full object-cover" />
      </div>
      <div className="flex justify-center items-center w-[18%] text-[#2F3339] font-medium">{item.username || "N/A"}</div>
      <div className="flex justify-center items-center w-[26%] text-[#2F3339]">{item.email !== null ? item.email : item.phoneNo || "N/A"}</div>
      <div className="flex justify-center items-center w-[14%] text-[#2F3339]">{formatDate(item.DOB)}</div>
      <div className="flex justify-center items-center w-[14%]">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColorClass}`}>
          {status}
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
