import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ICONS } from "../../../constants/assets";
import { MESSAGES } from "../../../constants/pages/Labels";
import VaccineTableDisplay from "./VaccineTable";
import UserListItem from "./UserListItem";
import ReminderModal from "./ReminderModal"; // Import the new modal
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox"; // Import ConfirmDeleteModal
import ConfirmationModal from "../../../components/ConfirmationModal"; // Import ConfirmationModal
import { useGetUserDetailsQuery, useGetDependentDetailsQuery, useDeleteDependentMutation, useDeleteUserMutation } from "/src/core/services/api/userApi";
import { useGetNotificationsQuery } from "../../../../core/services/api/notificationApi";
import { useGetRemindersByUserIdQuery } from "../../../../core/services/api/vaccineApi";
import NotificationsTab from "./NotificationsTab"; // Import the new NotificationsTab component
import RemindersTab from "./RemindersTab"; // Import the new RemindersTab component
import CircularProgress from "@mui/material/CircularProgress";

const UserList = ({
  items = [],
  onEdit,
  onDelete,
  userDetails,
  setUserDetails,
  dependentDetails,
  setDependentDetails,
  onOpenFullEdit,
  currentPage,
  totalPages,
  onPageChange,
  parentRefetchUserDetails, // Rename this prop to avoid conflict
  onReturnToTable, // Add this prop to trigger table refresh
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const adminId = localStorage.getItem('adminId');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDependentId, setSelectedDependentId] = useState(null);
  const [currentDependentData, setCurrentDependentData] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState("Logged Vaccines");
  const [activeTab, setActiveTab] = useState("Completed");
  const [userImageError, setUserImageError] = useState(false);
  const [dependentImageError, setDependentImageError] = useState(false);
  const [currentDependentImageError, setCurrentDependentImageError] = useState(false);
  
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [isFetchingDependentData, setIsFetchingDependentData] = useState(false);

  // Track when we're switching between different users/dependents
  const [lastSelectedUserId, setLastSelectedUserId] = useState(null);
  const [lastSelectedDependentId, setLastSelectedDependentId] = useState(null);

  // State for Reminder Modal
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedVaccineForReminder, setSelectedVaccineForReminder] = useState(null);
  const [selectedVaccineNameForReminder, setSelectedVaccineNameForReminder] = useState("");

  // State for Dependent Deletion
  const [openDeleteDependent, setOpenDeleteDependent] = useState(false);
  const [openDependentDeleteConfirm, setOpenDependentDeleteConfirm] = useState(false);
  const [dependentToDelete, setDependentToDelete] = useState({ user_id: null, dependent_id: null });

  // State for User Deletion from Detail View
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [openUserDeleteConfirm, setOpenUserDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [deleteDependent] = useDeleteDependentMutation();
  const [deleteUser] = useDeleteUserMutation(); // Add deleteUser mutation

  const { data: userDetailsResponse, isLoading: loadingUserDetails, refetch: refetchUserDetailsQuery } = useGetUserDetailsQuery(
    { user_id: selectedUserId, admin_user_id: adminId },
    { skip: !selectedUserId || !adminId }
  );
  const fullUserDetails = userDetailsResponse?.data;

  const skipDependentQuery = !selectedDependentId || !selectedUserId || !adminId;

  const { data: dependentDetailsResponse, isLoading: loadingDependentDetails, refetch: refetchDependentDetails } = useGetDependentDetailsQuery(
    { dependent_id: selectedDependentId, user_id: selectedUserId, admin_user_id: adminId },
    { skip: skipDependentQuery }
  );
  const fullDependentDetails = dependentDetailsResponse?.data;

  // Update fetching states when selection changes
  useEffect(() => {
    if (selectedUserId && selectedUserId !== lastSelectedUserId) {
      setIsFetchingUserData(true);
      setLastSelectedUserId(selectedUserId);
      // Reset image error state when switching users
      setUserImageError(false);
    }
  }, [selectedUserId, lastSelectedUserId]);

  useEffect(() => {
    if (selectedDependentId && selectedDependentId !== lastSelectedDependentId) {
      setIsFetchingDependentData(true);
      setLastSelectedDependentId(selectedDependentId);
      // Reset image error state when switching dependents
      setDependentImageError(false);
      setCurrentDependentImageError(false);
    }
  }, [selectedDependentId, lastSelectedDependentId]);

  // Reset fetching states when data is loaded
  useEffect(() => {
    if (!loadingUserDetails && fullUserDetails) {
      setIsFetchingUserData(false);
    }
  }, [loadingUserDetails, fullUserDetails]);

  useEffect(() => {
    if (!loadingDependentDetails && fullDependentDetails) {
      setIsFetchingDependentData(false);
    }
  }, [loadingDependentDetails, fullDependentDetails]);

  // Effect to handle route-based refresh
  useEffect(() => {
    // Check if there's a refresh flag in location state
    if (location.state && location.state.refresh) {
      if (selectedUserId) {
        refetchUserDetailsQuery();
      }
      if (selectedDependentId && selectedUserId) {
        refetchDependentDetails();
      }
      // Clear the refresh flag by replacing state
      window.history.replaceState({}, document.title);
    }
  }, [location, selectedUserId, selectedDependentId, refetchUserDetailsQuery, refetchDependentDetails]);

  useEffect(() => {
    if (selectedUserId) {
      refetchUserDetailsQuery();
    }
  }, [selectedUserId, refetchUserDetailsQuery]);

  // This useEffect will not trigger refetchDependentDetails because selectedDependentId will be null
  useEffect(() => {
    if (selectedDependentId && selectedUserId) {
      refetchDependentDetails();
    }
  }, [selectedDependentId, selectedUserId, refetchDependentDetails]);

  // Expose refetch functions to parent component through a callback
  useEffect(() => {
    // This is a simple way to expose refetch functions to parent
    // In a real app, you might want to use a more sophisticated approach
    window.userListRefetchUserDetails = refetchUserDetailsQuery;
    window.userListRefetchDependentDetails = refetchDependentDetails;
    
    // Cleanup on unmount
    return () => {
      delete window.userListRefetchUserDetails;
      delete window.userListRefetchDependentDetails;
    };
  }, [refetchUserDetailsQuery, refetchDependentDetails]);

  // Show loader when actively fetching new data
  if (isFetchingUserData || isFetchingDependentData || loadingUserDetails || loadingDependentDetails) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  const handleUserDetails = (user) => {
    setSelectedUserId(user.id);
    setUserDetails(user); // Pass the user object
    setDependentDetails(false);
    setSelectedDependentId(null);
    setCurrentDependentData(null);
  };

  const handleDependentDetails = (dependent) => {
    setSelectedDependentId(dependent.dependent_id); // Reverted to original: Set the dependent's ID
    setCurrentDependentData(dependent);
    setDependentDetails(true);
  };

  const handleBackToUserList = () => {
    setUserDetails(false);
    setSelectedUserId(null);
    setDependentDetails(false);
    setSelectedDependentId(null);
    setIsReminderModalOpen(false); // Close modal on back
    setSelectedVaccineForReminder(null); // Clear selected vaccine
    setSelectedVaccineNameForReminder("");
    setActiveMainTab("Logged Vaccines"); // Reset to default tab
    // Refetch user data when going back to user list
    if (parentRefetchUserDetails) {
      parentRefetchUserDetails();
    }
  };

  const tabs = ["Completed", "Upcoming", "Due Soon", "Overdue"];

  const handleBackToUserDetails = () => {
    setDependentDetails(false);
    setSelectedDependentId(null);
    setIsReminderModalOpen(false); // Close modal on back
    setSelectedVaccineForReminder(null); // Clear selected vaccine
    setSelectedVaccineNameForReminder("");
    setActiveMainTab("Logged Vaccines"); // Reset to default tab
  };

  const handleVaccineRowClick = (vaccine) => {
    setSelectedVaccineForReminder(vaccine);
    setSelectedVaccineNameForReminder(vaccine.vaccine_name);
    setIsReminderModalOpen(true);
  };

  const handleCloseReminderModal = () => {
    setIsReminderModalOpen(false);
    setSelectedVaccineForReminder(null);
    setSelectedVaccineNameForReminder("");
  };

  const handleDeleteDependent = (dependentId) => {
    setDependentToDelete({ user_id: selectedUserId, dependent_id: dependentId });
    setOpenDeleteDependent(true);
  };

  // Handle user deletion from detail view
  const handleDeleteUserFromDetail = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteUser(true);
  };

  // Confirm user deletion from detail view
  const confirmDeleteUser = async () => {
    try {
      await deleteUser({
        user_id: userToDelete,
        admin_user_id: adminId
      }).unwrap();
      setOpenDeleteUser(false);
      setOpenUserDeleteConfirm(true);
      // Reset the userDetails state to go back to user list
      setTimeout(() => {
        setUserDetails(false);
        setSelectedUserId(null);
        setDependentDetails(false);
        setSelectedDependentId(null);
        // Refetch user data
        if (parentRefetchUserDetails) {
          parentRefetchUserDetails();
        }
        // Navigate to user list
        navigate('/user');
      }, 1500);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Confirm dependent deletion
  const confirmDeleteDependent = async () => {
    try {
      await deleteDependent({
        admin_user_id: adminId,
        user_id: dependentToDelete.user_id,
        dependent_id: dependentToDelete.dependent_id,
      }).unwrap();
      setOpenDeleteDependent(false);
      setOpenDependentDeleteConfirm(true);
      refetchUserDetailsQuery(); // Refresh user details to update dependent list
      setDependentDetails(false); // Go back to user details view
      setSelectedDependentId(null); // Clear selected dependent
      
    } catch (error) {
      console.error('Failed to delete dependent:', error);
    }
  };

  const loggedVaccinesCount = (fullUserDetails?.vaccines?.completed?.length || 0) +
                              (fullUserDetails?.vaccines?.upcoming?.length || 0) +
                              (fullUserDetails?.vaccines?.dueSoon?.length || 0) +
                              (fullUserDetails?.vaccines?.overdue?.length || 0);

  const loggedVaccinesCountDependent = (fullDependentDetails?.vaccines?.completed?.length || 0) +
                                       (fullDependentDetails?.vaccines?.upcoming?.length || 0) +
                                       (fullDependentDetails?.vaccines?.dueSoon?.length || 0) +
                                       (fullDependentDetails?.vaccines?.overdue?.length || 0);

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
      {userDetails && (
        <div className="flex flex-col gap-6 mt-4">
          {!dependentDetails && (
          <button onClick={handleBackToUserList} className="self-start px-4 py-2 bg-[#EDF5FF] rounded-md cursor-pointer">
            Back to User List
          </button>
          )}
          {/* Profile & Dependents Section (User) */}
          {!dependentDetails && fullUserDetails && (
            <div className="w-full flex flex-col md:flex-row justify-center gap-6">
              {/* User Profile Card */}
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-[275px] overflow-y-auto w-auto md:w-[75%]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {fullUserDetails.user.image && !userImageError ? (
                      <img 
                        src={fullUserDetails.user.image} 
                        alt="Profile" 
                        className="w-14 h-14 rounded-full object-cover" 
                        onError={() => setUserImageError(true)}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-xl">
                          {fullUserDetails.user.full_name ? fullUserDetails.user.full_name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{fullUserDetails.user.full_name || fullUserDetails.user.phone_number}</h2>
                      <p className="text-sm text-gray-500">{fullUserDetails.user.phone_number || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => {
                      onOpenFullEdit(fullUserDetails.user, false, selectedUserId); // Pass selectedUserId for user edit
                    }}>
                      <img src={ICONS.edituser} alt="Edit" />
                    </button>
                    <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => handleDeleteUserFromDetail(fullUserDetails.user.id)}>
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
                      <p className="font-semibold text-gray-800">{label}</p>
                      <p className="text-sm text-gray-500"> {value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependents Card */}
              <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 w-auto md:w-[50%] p-5 h-[275px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-black text-[20px] ">Dependents</h3>
                  <span className="text-sm text-black text-[20px]">({fullUserDetails.dependents?.length || 0})</span>
                </div>

                <hr className="border-gray-200 mb-3" />

                <div className="flex flex-col gap-3 overflow-y-auto">
                  {fullUserDetails.dependents?.map((dep, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleDependentDetails(dep)}
                    >
                      {dep.image && !currentDependentImageError ? (
                        <img 
                          src={dep.image} 
                          alt={dep.full_name} 
                          className="w-10 h-10 rounded-full object-cover" 
                          onError={() => setCurrentDependentImageError(true)}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-bold">
                            {dep.full_name ? dep.full_name.charAt(0).toUpperCase() : 'D'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{dep.full_name || dep.relation_type}</p>
                        <p className="text-sm text-gray-500">{dep.relation_type || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dependent Detail View */}
          {dependentDetails && fullDependentDetails && ( // Use fullDependentDetails here
            <div className="flex flex-col gap-6 ">
              <button onClick={handleBackToUserDetails} className="self-start px-4 py-2 bg-[#EDF5FF] rounded-md cursor-pointer">
                Back to User Details
              </button>
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-[275px] overflow-y-auto w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {fullDependentDetails.dependent.image && !dependentImageError ? (
                      <img 
                        src={fullDependentDetails.dependent.image} 
                        alt="Profile" 
                        className="w-14 h-14 rounded-full object-cover" 
                        onError={() => setDependentImageError(true)}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-xl">
                          {fullDependentDetails.dependent.full_name ? fullDependentDetails.dependent.full_name.charAt(0).toUpperCase() : 'D'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{fullDependentDetails.dependent.full_name || fullDependentDetails.dependent.relation_type}</h2>
                      <p className="text-sm text-gray-500">{fullDependentDetails.dependent.phone_number || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => {
                      onOpenFullEdit(fullDependentDetails.dependent, true, selectedUserId); // Pass selectedUserId for dependent edit
                    }}>
                      <img src={ICONS.edituser} alt="Edit" />
                    </button>
                    <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-200" onClick={() => handleDeleteDependent(fullDependentDetails.dependent.id)}>
                      <img src={ICONS.delete} alt="Delete" />
                    </button>
                  </div>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  {[
                    ["Relation", fullDependentDetails.dependent.relation_type || "N/A"],
                    ["Date of Birth", fullDependentDetails.dependent.dob ? new Date(fullDependentDetails.dependent.dob).toLocaleDateString() : "N/A"],
                    ["Gender", fullDependentDetails.dependent.gender || "N/A"],
                    ["Phone Number", fullDependentDetails.dependent.phone_number || "N/A"],
                    ["Country", fullDependentDetails.dependent.country || "N/A"],
                    ["Address", fullDependentDetails.dependent.address || "N/A"],
                    ["Marital Status", fullDependentDetails.dependent.material_status || "N/A"],
                    ["Children", fullDependentDetails.dependent.do_you_have_children ? `Yes (${fullDependentDetails.dependent.how_many_children})` : "No"],
                    ["Pregnancy", fullDependentDetails.dependent.are_you_pregnant ? `Yes (${fullDependentDetails.dependent.pregnancy_detail || 'N/A'})` : "No"],
                  ].map(([label, value], i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-600">{label}</p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Tabs Section */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full mx-auto">
            {/* <div className="flex border-b border-gray-200 mb-4">
              {["Logged Vaccines", "Notifications", "Reminders"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium ${
                    activeMainTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div> */}

            {activeMainTab === "Logged Vaccines" && (dependentDetails ? fullDependentDetails?.vaccines : fullUserDetails?.vaccines) && (
              <div>
                <div className="flex justify-between items-center ">
                   <h2 className="text-lg font-semibold text-black mb-3">Logged Vaccines:</h2>
                <h2 className="text-lg font-medium text-black mb-3">
                  {dependentDetails ? loggedVaccinesCountDependent : loggedVaccinesCount}
                </h2>
                  </div>

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
                {activeTab === "Completed" && <VaccineTableDisplay tab="Completed" vaccines={dependentDetails ? fullDependentDetails.vaccines.completed : fullUserDetails.vaccines.completed} onRowClick={handleVaccineRowClick} userId={selectedUserId} isDependent={dependentDetails} refetchUserVaccines={refetchUserDetailsQuery} refetchDependentVaccines={refetchDependentDetails} />}
                {activeTab === "Upcoming" && <VaccineTableDisplay tab="Upcoming" vaccines={dependentDetails ? fullDependentDetails.vaccines.upcoming : fullUserDetails.vaccines.upcoming} onRowClick={handleVaccineRowClick} userId={selectedUserId} isDependent={dependentDetails} refetchUserVaccines={refetchUserDetailsQuery} refetchDependentVaccines={refetchDependentDetails} />}
                {activeTab === "Due Soon" && <VaccineTableDisplay tab="Due Soon" vaccines={dependentDetails ? fullDependentDetails.vaccines.dueSoon : fullUserDetails.vaccines.dueSoon} onRowClick={handleVaccineRowClick} userId={selectedUserId} isDependent={dependentDetails} refetchUserVaccines={refetchUserDetailsQuery} refetchDependentVaccines={refetchDependentDetails} />}
                {activeTab === "Overdue" && <VaccineTableDisplay tab="Overdue" vaccines={dependentDetails ? fullDependentDetails.vaccines.overdue : fullUserDetails.vaccines.overdue} onRowClick={handleVaccineRowClick} userId={selectedUserId} isDependent={dependentDetails} refetchUserVaccines={refetchUserDetailsQuery} refetchDependentVaccines={refetchDependentDetails} />}
              </div>
            )}

            {activeMainTab === "Notifications" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Notifications:</h2>
                {/* Fetch and display notifications */}
                <NotificationsTab userId={dependentDetails ? selectedDependentId : selectedUserId} />
              </div>
            )}

            {activeMainTab === "Reminders" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">All Reminders:</h2>
                {/* Fetch and display all reminders for the user */}
                <RemindersTab userId={dependentDetails ? selectedDependentId : selectedUserId} />
              </div>
            )}
          </div>
        </div>
      )}
      {isReminderModalOpen && (
        <ReminderModal
          open={isReminderModalOpen}
          onClose={handleCloseReminderModal}
          userId={dependentDetails ? selectedDependentId : selectedUserId}
          userVaccineId={selectedVaccineForReminder?.user_vaccine_id}
          vaccineName={selectedVaccineNameForReminder}
        />
      )}

      {/* Dependent Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={openDeleteDependent}
        title="Delete Dependent"
        description={MESSAGES.DELETE_CONFIRM_DEPENDENT}
        onClose={() => setOpenDeleteDependent(false)}
        onConfirm={confirmDeleteDependent}
      />

      {/* Dependent Delete Success Modal */}
      <ConfirmationModal
        open={openDependentDeleteConfirm}
        onClose={() => setOpenDependentDeleteConfirm(false)}
        title="Dependent Deleted"
        description="The dependent has been successfully deleted."
        onConfirm={() => setOpenDependentDeleteConfirm(false)}
      />

      {/* User Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={openDeleteUser}
        title="Delete User"
        description={MESSAGES.DELETE_CONFIRM_USER}
        onClose={() => setOpenDeleteUser(false)}
        onConfirm={confirmDeleteUser}
      />

      {/* User Delete Success Modal */}
      <ConfirmationModal
        open={openUserDeleteConfirm}
        onClose={() => {
          setOpenUserDeleteConfirm(false);
          setUserDetails(false);
          setSelectedUserId(null);
          setDependentDetails(false);
          setSelectedDependentId(null);
          // Trigger a full refresh using the refresh trigger mechanism
          if (parentRefetchUserDetails) {
            parentRefetchUserDetails();
          }
          // Also trigger the return to table refetch if provided
          if (onReturnToTable) {
            onReturnToTable();
          }
          // Navigate to user list
          navigate('/user');
        }}
        title="User Deleted"
        description="The user has been successfully deleted."
        onConfirm={() => {
          setOpenUserDeleteConfirm(false);
          // Reset the userDetails state to go back to user list
          setUserDetails(false);
          setSelectedUserId(null);
          setDependentDetails(false);
          setSelectedDependentId(null);
          // Trigger a full refresh using the refresh trigger mechanism
          if (parentRefetchUserDetails) {
            parentRefetchUserDetails();
          }
          // Also trigger the return to table refetch if provided
          if (onReturnToTable) {
            onReturnToTable();
          }
          navigate('/user');
        }}
      />
    </div>
  );
};

export default UserList;