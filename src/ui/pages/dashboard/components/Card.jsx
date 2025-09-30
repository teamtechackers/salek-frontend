const Card = ({ title, value, name, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-3 flex flex-row justify-between items-center h-auto w-full transition-shadow duration-300">
      
      <div className="flex flex-col">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-base font-bold">
          {value}{" "}
          <span className="text-sm font-medium">{name}</span>
        </p>
      </div>

      <div className="w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
        <img src={icon} alt="icon" className="w-10 h-10 object-contain" />
      </div>
    </div>
  );
};

export default Card;
