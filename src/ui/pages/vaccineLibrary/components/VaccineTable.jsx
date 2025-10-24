import { useState } from "react";
import Pagination from "../../../components/Pagination";
import { dashboardlabels } from "../../../constants/pages/Labels";
import { ICONS } from "../../../constants/assets";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import VaccineList from "./VaccineList";
import RowModal from "./RowModal.jsx"; // Import RowModal
import { useDeleteVaccineMutation } from "/src/core/services/api/vaccineApi";

export default function VaccineTable({
  vaccines,
  currentPage,
  itemsPerPage,
  refetch,
  onEdit, // Added onEdit prop
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [openRowModal, setOpenRowModal] = useState(false); // State for RowModal
  const [rowModalData, setRowModalData] = useState(null); // State for RowModal data

  const [deleteVaccine] = useDeleteVaccineMutation();

  const handleDelete = async (id) => {
    console.log(id, "id")
    try {
      const adminId = localStorage.getItem("adminId");
      await deleteVaccine({ vaccine_id: id, admin_user_id: adminId }).unwrap();
      setOpenDelete(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete vaccine:", error);
    }
  };

  const handleRowClick = (vaccine) => {
    setRowModalData(vaccine);
    setOpenRowModal(true);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto">
        <VaccineList
          items={vaccines}
          onEdit={onEdit} // Pass onEdit directly
          onDelete={(vaccine) => {
            setSelectedVaccine(vaccine);
            setOpenDelete(true);
          }}
          onRowClick={handleRowClick} // Pass new onRowClick handler
        />
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={openDelete}
        title={"Delete Vaccine"}
        description={"Are you sure you want to delete the vaccine. This action cannot be undone."}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
            handleDelete(selectedVaccine.vaccine_id);
          }}
      />

      {/* Row Details Modal */}
      <RowModal
        open={openRowModal}
        onClose={() => {
          setOpenRowModal(false);
          setRowModalData(null);
        }}
        data={rowModalData}
      />
    </div>
  );
}
