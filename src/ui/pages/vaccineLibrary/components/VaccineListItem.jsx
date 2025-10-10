import { ICONS } from "../../../constants/assets";

export default function VaccineListItem({ item, onEdit, onDelete }) {
  return (
   

     <div
      className="flex items-center min-h-[70px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition "
     
    >
      <div className="flex justify-center items-center w-[18%]">
       {item.vaccine}
      </div>
      <div className="flex justify-center items-center w-[14%] text-gray-700 font-medium">{item.category} </div>
      <div className="flex justify-center items-center w-[26%] text-gray-500">{item.age}</div>
      <div className="flex justify-center items-center w-[14%] text-gray-500">{item.type}</div>
      <div className="flex justify-center items-center w-[14%]">
       {item.site}
      </div>
      <div className="flex justify-center items-center gap-5 w-[14%]">
        <button  className="p-2 rounded-md hover:bg-blue-100"            onClick={onEdit}
>
          <img src={ICONS.edit} alt="Edit" />
        </button>
        <button  className="p-2 rounded-md hover:bg-red-100"          onClick={() => onDelete(item.id)}
>
          <img src={ICONS.delete} alt="Delete" />
        </button>
      </div>
    </div>
  );
}
