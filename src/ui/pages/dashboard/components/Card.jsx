const Card = ({ title, value, name, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg p-2 flex flex-row justify-between items-center h-auto w-full transition-shadow duration-300">
      
      <div className="flex flex-col ml-2">
        <h4 className="text-sm ">{title}</h4>
        <p className="text-base font-bold">
          {value}{" "}
          <span className="text-base font-bold">{name}</span>
        </p>
      </div>

      <div className="flex items-center justify-center rounded-full">
        <img src={icon} alt="icon"/>
      </div>
    </div>
  );
};

export default Card;
