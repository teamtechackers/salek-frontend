import { useState } from "react";
import ConfirmDeleteModal from "../../../../ui/components/ConfirmDeleteDialogBox";
import UserList from "./UserList";
import EditUserModal from "./EditUserModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import UsersList from "../../../constants/data/usersData";

export default function UserTable({userDetails,setUserDetails}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(UsersList);
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleDelete = async (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    setOpenConfirm(true);
    setOpenDelete(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          items={items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
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
        onConfirm={() => handleDelete(deleteId)}
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
