import { useState } from "react";
import { vaccines } from "../../../../ui/constants/data/vaccinejson";
import Pagination from "../../../components/Pagination";
import { dashboardlabels } from "../../../constants/pages/Labels";
import { ICONS } from "../../../constants/assets";
import Editmodel from "./Editmodel";
import ConfirmDeleteModal from "../../../../ui/components/ConfirmDeleteDialogBox";
import VaccineList from "./vaccinelist";

export default function VaccineTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(vaccines);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleDelete = (id) => {
    setItems((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      return updated;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto">
        <VaccineList
          items={items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
          onEdit={() => setOpenEdit(true)}
          onDelete={(id) => {
            setDeleteId(id);
            setOpenDelete(true);
          }}
        />
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={openDelete}
        title={dashboardlabels.title}
        description={dashboardlabels.description}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId);
            setDeleteId(null);
          }
          setOpenDelete(false);
        }}
      />

      {/* Edit Modal */}
      <Editmodel open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}
