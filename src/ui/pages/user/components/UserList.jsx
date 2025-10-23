import { useState, useEffect } from "react";
import { ICONS } from "../../../constants/assets";
import VaccineTableDisplay from "./VaccineTable";
import UserListItem from "./UserListItem";
import { useGetUserDetailsQuery, useGetDependentDetailsQuery } from "/src/core/services/api/userApi";

const UserList = ({ items, userDetails, setUserDetails, onEdit, onDelete }) => {
  const [dependentDetails, setDependentDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDependentId, setSelectedDependentId] = useState(null);
  const [currentDependentData, setCurrentDependentData] = useState(null); // New state for clicked dependent's data

  const adminId = localStorage.getItem('adminId');

  const { data: userDetailsResponse, isLoading: loadingUserDetails, refetch: refetchUserDetails } = useGetUserDetailsQuery(
    { user_id: selectedUserId, admin_user_id: adminId },
    { skip: !selectedUserId || !adminId }
  );
  const fullUserDetails = userDetailsResponse?.data;
  // console.log("UserList - fullUserDetails:", fullUserDetails); // Removed for cleaner console

  // The dependentDetailsResponse will always be undefined because selectedDependentId is undefined
  // We keep the hook here in case the backend is updated to provide dependent IDs in the future.
  const { data: dependentDetailsResponse, isLoading: loadingDependentDetails, refetch: refetchDependentDetails } = useGetDependentDetailsQuery(
    { dependent_id: selectedDependentId, user_id: selectedUserId, admin_user_id: adminId },
    { skip: !selectedDependentId || !selectedUserId || !adminId }
  );
  const fullDependentDetails = dependentDetailsResponse?.data;
  // console.log("UserList - selectedUserId:", selectedUserId); // Removed for cleaner console
  // console.log("UserList - selectedDependentId:", selectedDependentId); // Removed for cleaner console
  // console.log("UserList - adminId:", adminId); // Removed for cleaner console
  // console.log("UserList - dependentDetailsResponse:", dependentDetailsResponse); // Removed for cleaner console
  // console.log("UserList - fullDependentDetails:", fullDependentDetails); // Removed for cleaner console

  useEffect(() => {
    if (selectedUserId) {
      refetchUserDetails();
    }
  }, [selectedUserId, refetchUserDetails]);

  // This useEffect will not trigger refetchDependentDetails because selectedDependentId will be null
  useEffect(() => {
    if (selectedDependentId && selectedUserId) {
      refetchDependentDetails();
    }
  }, [selectedDependentId, selectedUserId, refetchDependentDetails]);

  const handleUserDetails = (user) => {
    setSelectedUserId(user.id);
    setUserDetails(true);
    setDependentDetails(false); // Ensure dependent details view is off
    setSelectedDependentId(null); // Clear selected dependent
    setCurrentDependentData(null); // Clear current dependent data
  };

  const handleDependentDetails = (dependent) => {
    // console.log("handleDependentDetails - clicked dependent object:", dependent); // Removed for cleaner console
    // console.log("handleDependentDetails - dependent.id:", dependent?.id); // Removed for cleaner console
    // Since 'id' is missing from the dependent object in fullUserDetails.dependents,
    // we cannot set selectedDependentId for the API call.
    // We will use the 'dependent' object directly to display its profile details.
    setSelectedDependentId(null); // Ensure it's null as no ID is available
    setCurrentDependentData(dependent); // Store the clicked dependent's data
    setDependentDetails(true);
  };

  const handleBackToUserList = () => {
    setUserDetails(false);
    setSelectedUserId(null);
    setDependentDetails(false);
    setSelectedDependentId(null);
  };

  const [activeTab, setActiveTab] = useState("Completed");
  const tabs = ["Completed", "Upcoming", "Due Soon", "Overdue"];

  const handleBackToUserDetails = () => {
    setDependentDetails(false);
    setSelectedDependentId(null);
  };

  if (loadingUserDetails || loadingDependentDetails) {
    return <div className="text-center py-8 text-gray-500">Loading details...</div>;
  }

  return (
    <div className="w-full h-full">
      {/* User List View */}
      {!userDetails && (
        <>
          <div className="flex h-[50px] bg-[#245FFF] text-white font-semibold rounded-lg">
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
                  handleFunction={() => handleUserDetails(item)}
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
      {userDetails && fullUserDetails && (
        <div className="flex flex-col gap-6 mt-4">
          <button onClick={handleBackToUserList} className="self-start px-4 py-2 bg-[#EDF5FF] rounded-md cursor-pointer">
            Back to User List
          </button>
          {/* Profile & Dependents */}
          <div className="w-full flex flex-col md:flex-row justify-center gap-6">
            {/* Profile Card */}
            {!dependentDetails && (
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-[275px] overflow-y-auto ${
                !dependentDetails ? "w-auto md:w-[75%]" : "w-full"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={fullUserDetails.user.profileImage || "https://i.pravatar.cc/100?img=4"} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{fullUserDetails.user.full_name || fullUserDetails.user.phone_number}</h2>
                    <p className="text-sm text-gray-500">{fullUserDetails.user.phone_number || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={onEdit}>
                    <img src={ICONS.edituser} alt="Edit" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => onDelete(fullUserDetails.user.id)}>
                    <img src={ICONS.delete} alt="Delete" />
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                {[
                  ["Date of Birth", fullUserDetails.user.dob ? new Date(fullUserDetails.user.dob).toLocaleDateString() : "N/A"],
                  ["Gender", fullUserDetails.user.gender || "N/A"],
                  ["Country", fullUserDetails.user.country || "N/A"],
                  ["Address", fullUserDetails.user.address || "N/A"],
                  ["Phone Number", fullUserDetails.user.phone_number || "N/A"],
                  ["Marital Status", fullUserDetails.user.material_status || "N/A"],
                  ["Children", fullUserDetails.user.do_you_have_children ? `Yes (${fullUserDetails.user.how_many_children})` : "No"],
                  ["Pregnancy", fullUserDetails.user.are_you_pregnant ? `Yes (${fullUserDetails.user.pregnancy_detail || 'N/A'})` : "No"],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-600">{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Dependents Card */}
            {!dependentDetails && (
              <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 w-auto md:w-[50%] p-5 h-[275px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Dependents</h3>
                  <span className="text-sm text-gray-500">({fullUserDetails.dependents?.length || 0})</span>
                </div>

                <hr className="border-gray-200 mb-3" />

                <div className="flex flex-col gap-3 overflow-y-auto">
                  {fullUserDetails.dependents?.map((dep, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleDependentDetails(dep)}
                    >
                      <img src={dep.img || "https://i.pravatar.cc/100?img=1"} alt={dep.full_name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{dep.full_name || dep.relation_type}</p>
                        <p className="text-sm text-gray-500">{dep.relation_type || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dependent Detail View */}
          {dependentDetails && currentDependentData && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full mx-auto">
              <button onClick={handleBackToUserDetails} className="self-start px-4 py-2 bg-[#EDF5FF] rounded-md mb-4 cursor-pointer">
                Back to User Details
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Dependent: {currentDependentData.full_name || currentDependentData.relation_type}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                {[
                  ["Relation", currentDependentData.relation_type || "N/A"],
                  ["Date of Birth", currentDependentData.dob ? new Date(currentDependentData.dob).toLocaleDateString() : "N/A"],
                  ["Gender", currentDependentData.gender || "N/A"],
                  ["Phone Number", currentDependentData.phone_number || "N/A"],
                  ["Country", currentDependentData.country || "N/A"],
                  ["Address", currentDependentData.address || "N/A"],
                  ["Marital Status", currentDependentData.material_status || "N/A"],
                  ["Children", currentDependentData.do_you_have_children ? `Yes (${currentDependentData.how_many_children})` : "No"],
                  ["Pregnancy", currentDependentData.are_you_pregnant ? `Yes (${currentDependentData.pregnancy_detail || 'N/A'})` : "No"],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-600">{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>

              {/* Display a message about missing vaccine data if fullDependentDetails is not available */}
              {!fullDependentDetails && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
                  <p className="font-semibold">Note:</p>
                  <p>Dependent-specific vaccine details cannot be fetched because the dependent ID is not provided by the user details API. This section would display vaccine information if the dependent ID were available.</p>
                </div>
              )}
            </div>
          )}

          {/* Vaccine Section (for user, not dependent) */}
          {!dependentDetails && fullUserDetails.vaccines && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full mx-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Logged Vaccines:</h2>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tabs?.map((tab) => (
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

              {activeTab === "Completed" && <VaccineTableDisplay tab="Completed" vaccines={fullUserDetails.vaccines.completed} />}
              {activeTab === "Upcoming" && <VaccineTableDisplay tab="Upcoming" vaccines={fullUserDetails.vaccines.upcoming} />}
              {activeTab === "Due Soon" && <VaccineTableDisplay tab="Due Soon" vaccines={fullUserDetails.vaccines.dueSoon} />}
              {activeTab === "Overdue" && <VaccineTableDisplay tab="Overdue" vaccines={fullUserDetails.vaccines.overdue} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
