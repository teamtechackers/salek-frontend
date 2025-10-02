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

      <div className="flex items-center justify-center rounded-full">
        <img src={icon} alt="icon"/>
      </div>
    </div>
  );
};

export default Card;
