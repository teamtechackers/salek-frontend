import VaccineListItem from "./VaccineListItem";

export default function VaccineList({ items, onEdit, onDelete, onRowClick }) {
  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex h-[50px] bg-[#245FFF] text-white font-semibold rounded-lg">
        <div className="flex items-center justify-start w-[18%] ml-6">Vaccine</div>
        <div className="flex items-center justify-center w-[14%]">Category</div>
        <div className="flex items-center justify-center w-[26%]">Age</div>
        <div className="flex items-center justify-center w-[14%]">Type</div>
        <div className="flex items-center justify-center w-[14%]">Site</div>
        <div className="flex items-center justify-center w-[14%]">Actions</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-gray-100">
        {items.length > 0 ? (
          items.map((item) => (
            <VaccineListItem
              key={item.vaccine_id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onRowClick={onRowClick} // Pass onRowClick to VaccineListItem
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No Data Found</div>
        )}
      </div>
    </div>

    
  );
}
