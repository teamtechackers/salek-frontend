import { ICONS } from "../../../constants/assets";

const UserListItem = ({ user, formatDate }) => {
  return (
    <div className="flex items-center min-h-[70px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition">

      <div className="flex justify-center items-center w-[14%]">
        <img
          src={user.photo}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      <div className="flex justify-center items-center w-[18%] text-gray-700 font-medium">
        {user.name}
      </div>

      <div className="flex justify-center items-center w-[26%] text-gray-500">
        {user.email}
      </div>

      <div className="flex justify-center items-center w-[14%] text-gray-500">
        {formatDate(user.date)}
      </div>

      <div className="flex justify-center items-center w-[14%]">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            user.status === "Active"
              ? "bg-green-100 text-green-700 border-green-700"
              : "bg-red-100 text-red-700 border-red-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      <div className="flex justify-center items-center gap-5 w-[14%]">
        <button>
          <img src={ICONS.edit} alt="Edit" className="w-5 h-5" />
        </button>
        <button>
          <img src={ICONS.delete} alt="Delete" className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default UserListItem;
