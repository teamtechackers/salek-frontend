import React, { useState, useEffect } from "react"; // Corrected import
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import UserList from "./UserList";
import EditUserShortModal from "./EditUserShortModal";
import { useUpdateUserMutation, useDeleteUserMutation } from "../../../../core/services/api/userApi";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CircularProgress from "@mui/material/CircularProgress";

export default function UserTable({ users, currentPage, itemsPerPage, userDetails, setUserDetails, refetch, refetchUserDetails, onRefetchUserDetails, onOpenFullEdit }) {
  console.log("UserTable.jsx - onOpenFullEdit received:", onOpenFullEdit);
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditShort, setOpenEditShort] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the user being edited
  const [deleteId, setDeleteId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false); // State to track if modal is in view-only mode
  const [isSaving, setIsSaving] = useState(false); // State for saving indicator

  useEffect(() => {
    if (openEditShort && selectedUser) {
      // Find the updated user in the 'users' prop based on the ID
      const updatedUserInList = users.find(user => user.id === selectedUser.id);
      // Always update selectedUser if a matching user is found in the updated 'users' list
      // This ensures the modal always gets the latest data, even if object reference didn't change
      if (updatedUserInList) {
        setSelectedUser(updatedUserInList);
      }
    }
  }, [users, openEditShort, selectedUser]); // Keep selectedUser in dependency array to re-run if selectedUser itself changes

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleDelete = async () => {
    try {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        console.error('Admin ID not found in localStorage');
        return;
      }
      await deleteUser({ 'user_id': deleteId, 'admin_user_id': adminId }).unwrap();
      setOpenConfirm(true);
      setOpenDelete(false);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleEdit = (user) => {
    console.log("UserTable - handleEdit called with user:", user);
    setSelectedUser(user);
    setOpenEditShort(true);
  };

  const handleSaveShortEdit = async (updatedUser) => {
    setIsSaving(true); // Set saving state
    try {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        console.error('Admin ID not found in localStorage');
        setIsSaving(false);
        return;
      }
      await updateUser({ user_id: updatedUser.user_id, ...updatedUser, admin_user_id: adminId }).unwrap();
      
      // Call refetch to update the UI
      // Only call refetch functions if they exist to avoid the error
      setTimeout(() => {
        try {
          if (window.userListRefetchUserDetails) {
            window.userListRefetchUserDetails();
          }
        } catch (e) {
          console.warn("Could not refetch user details:", e);
        }
        
        try {
          refetch();
        } catch (e) {
          console.warn("Could not refetch main list:", e);
        }
        
        // Close modal only after data is updated
        setOpenEditShort(false);
        setIsSaving(false); // Reset saving state
      }, 150); // Slightly longer delay to ensure data is updated
    } catch (error) {
      console.error('Failed to update user:', error);
      setIsSaving(false); // Reset saving state on error
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          items={users}
          onEdit={handleEdit} // Pass handleEdit function for short modal
          onDelete={(id) => {
            setDeleteId(id);
            setOpenDelete(true);
          }}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          onOpenFullEdit={onOpenFullEdit} // Pass onOpenFullEdit for proper modal
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        open={openDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Edit Short Modal */}
      <EditUserShortModal
        key={selectedUser ? selectedUser.id : 'new-user'} // Add key prop to force re-mount
        open={openEditShort}
        onClose={() => {
          setOpenEditShort(false);
          setSelectedUser(null); // Clear selected user on close
        }}
        user={selectedUser || {}}
        onSave={handleSaveShortEdit}
        isSaving={isSaving} // Pass saving state
      />

      {/* Success Modal */}
      <ConfirmationModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="User Deleted"
        description="The user has been successfully deleted."
        onConfirm={() => setOpenConfirm(false)}
      />
    </div>
  );
}