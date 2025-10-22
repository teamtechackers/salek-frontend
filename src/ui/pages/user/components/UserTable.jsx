import { useState } from "react";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import UserList from "./UserList";
import EditUserModal from "./EditUserModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useDeleteUserMutation } from "/src/core/services/api/userApi";

export default function UserTable({ users, currentPage, itemsPerPage, userDetails, setUserDetails, refetch }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  console.log("Users in UserTable:", users);
  console.log("currentPage in UserTable:", currentPage);
  console.log("itemsPerPage in UserTable:", itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users?.slice(startIndex, endIndex) || [];

  console.log("Paginated Users (after slice) in UserTable:", paginatedUsers);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          items={paginatedUsers}
          onEdit={() => setOpenEdit(true)}
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
      <EditUserModal open={openEdit} onClose={() => setOpenEdit(false)} />

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
