const ListItem = ({ image, name, role, time }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-3">

      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 self-end">{time}</p>
    </div>
  );
};

export default ListItem;
