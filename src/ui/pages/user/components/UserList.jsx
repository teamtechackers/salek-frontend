import { useState } from "react";
import { ICONS } from "../../../constants/assets";
import VaccineTableDisplay from "./VaccineTable";
import UserListItem from "./UserListItem";

const UserList = ({ items, userDetails, setUserDetails, onEdit, onDelete}) => {
  const [dependentDetails, setDependentDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("Completed");
  const tabs = ["Completed", "Upcoming", "Due Soon", "Overdue"];

  const handleUserDetails = () => setUserDetails(true);
  const handleDependentDetails = () => setDependentDetails(true);

  const vaccines = [
    { vaccine: "Influenza", hospital: "Fortis Hospital", dose: "3 / 3", date: "12 Jan 2025", time: "09:30 AM", certificate: "Uploaded", status: true },
    { vaccine: "Hepatitis B", hospital: "Lotus Institute", dose: "2 / 3", date: "20 Mar 2025", time: "10:00 AM", certificate: "Not Uploaded", status: false },
  ];

  const dependents = [
    { name: "Muhammad Musa", relation: "Son", img: "https://i.pravatar.cc/100?img=1" },
    { name: "Sarah Imran", relation: "Daughter", img: "https://i.pravatar.cc/100?img=2" },
    { name: "Ahmad Malik", relation: "Husband", img: "https://i.pravatar.cc/100?img=3" },
  ];

  return (
    <div className="w-full h-full">
      {/* User List View */}
      {!userDetails && (
        <>
          <div className="flex h-[50px] bg-blue-500 text-white font-semibold rounded-lg">
            <div className="flex items-center justify-center w-[14%]">Photo</div>
            <div className="flex items-center justify-center w-[18%]">User</div>
            <div className="flex items-center justify-center w-[26%]">Login</div>
            <div className="flex items-center justify-center w-[14%]">Date</div>
            <div className="flex items-center justify-center w-[14%]">Status</div>
            <div className="flex items-center justify-center w-[14%]">Actions</div>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map((item) => (
                <UserListItem
                  key={item.id}
                  item={item}
                  handleFunction={handleUserDetails}
                  onEdit={onEdit}
                  onDelete={() => onDelete(item.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No Data Found</div>
            )}
          </div>
        </>
      )}

      {/* User Detail View */}
      {userDetails && (
        <div className="flex flex-col gap-6 mt-4">
          {/* Profile & Dependents */}
          <div className="w-full flex flex-col md:flex-row justify-center gap-6">
            {/* Profile Card */}
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-5 ${
                !dependentDetails ? "w-auto md:w-[50%]" : "w-full"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/100?img=4" alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Sara Malik</h2>
                    <p className="text-sm text-gray-500">saramalik@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={onEdit}>
                    <img src={ICONS.edituser} alt="Edit" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => onDelete(1)}>
                    <img src={ICONS.delete} alt="Delete" />
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                {[
                  ["Date of Birth", "25 August 1985"],
                  ["Gender", "Female"],
                  ["Country", "Pakistan"],
                  ["Address", "abc street xyz City"],
                  ["Phone Number", "+92 300 1234567"],
                  ["Marital Status", "Married"],
                  ["Children", "2"],
                  ["Pregnancy", "Yes"],
                  ["Trimester", "1"],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-600">{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependents Card */}
            {!dependentDetails && (
              <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 w-auto md:w-[50%] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Dependents</h3>
                  <span className="text-sm text-gray-500">({dependents.length})</span>
                </div>

                <hr className="border-gray-200 mb-3" />

                <div className="flex flex-col gap-3 overflow-y-auto">
                  {dependents.map((dep, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleDependentDetails(i)}
                    >
                      <img src={dep.img} alt={dep.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{dep.name}</p>
                        <p className="text-sm text-gray-500">{dep.relation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vaccine Tabs Section */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Logged Vaccines:</h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {  tabs?.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <VaccineTableDisplay tab={activeTab} vaccines={vaccines} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
