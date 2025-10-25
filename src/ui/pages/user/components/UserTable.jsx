import { useState } from "react";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import UserList from "./UserList";
import EditUserModal from "./EditUserModal";
import { useDeleteUserMutation } from "/src/core/services/api/userApi";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function UserTable({ users, currentPage, itemsPerPage, userDetails, setUserDetails, refetch, refetchUserDetails }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the user being edited
  const [deleteId, setDeleteId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false); // State to track if modal is in view-only mode

  const [deleteUser] = useDeleteUserMutation();

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

  const handleEdit = (user, refetchFn) => {
    console.log("UserTable - handleEdit called with user:", user);
    setSelectedUser(user);
    // If refetchFn is passed, it means it's coming from detail view (view-only mode)
    setIsViewOnly(!!refetchFn);
    setOpenEdit(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users?.slice(startIndex, endIndex) || [];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          items={paginatedUsers}
          onEdit={handleEdit} // Pass handleEdit function
          onDelete={(id) => {
            setDeleteId(id);
            setOpenDelete(true);
          }}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
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

      {/* Edit Modal */}
      <EditUserModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedUser(null); // Clear selected user on close
          setIsViewOnly(false); // Reset view-only mode
        }}
        userId={selectedUser?.id} // Pass the selected user's ID
        refetch={refetch} // Pass refetch to update user list
        viewOnly={isViewOnly} // Pass view-only mode
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
