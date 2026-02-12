import HospitalsListItem from "./HospitalsListItem";

const HospitalsList = ({
    items = [],
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    return (
        <div className="w-full h-full">
            <div className="flex h-[50px] bg-[#245FFF] text-white font-semibold rounded-lg">
                <div className="flex items-center justify-center w-[10%]">Image</div>
                <div className="flex items-center justify-center w-[20%]">Hospital</div>
                <div className="flex items-center justify-center w-[12%]">Country</div>
                <div className="flex items-center justify-center w-[12%]">State</div>
                <div className="flex items-center justify-center w-[12%]">City</div>
                <div className="flex items-center justify-center w-[17%]">Phone Number</div>
                <div className="flex items-center justify-center w-[8%]">Status</div>
                <div className="flex items-center justify-center w-[9%]">Action</div>
            </div>

            <div className="flex flex-col gap-[0.5]">
                {items.length > 0 ? (
                    items.map((item) => (
                        <HospitalsListItem
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">No Data Found</div>
                )}
            </div>
        </div>
    );
};

export default HospitalsList;
