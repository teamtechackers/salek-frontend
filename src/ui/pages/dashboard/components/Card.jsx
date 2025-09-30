const Card = ({ title, value, name, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl p-4 flex items-center justify-between transition-shadow duration-300">

      <div className="flex flex-col">

        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>

        <p className="text-lg font-bold text-gray-900">

          {value} <span className="text-sm font-medium text-gray-500">{name}</span>
          
        </p>

      </div>

      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md">
        {/* {icon} */}
        <img src={icon} alt="icon" className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Card;
