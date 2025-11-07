import React, { useState } from "react";
import { ICONS } from "../../../constants/assets";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import {
  useDeleteDependentUserVaccineMutation,
  useDeleteUserVaccineMutation,
} from "../../../../core/services/api/vaccineApi";
import { toast } from "react-toastify"; // Assuming toast for notifications

const VaccineTableDisplay = ({ tab, vaccines, onRowClick, userId, isDependent, refetchUserVaccines, refetchDependentVaccines }) => {
  const displayVaccines = vaccines || [];
  const title = `${tab} Vaccines`;

  const isClickable = tab !== "Completed";

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedVaccineToDelete, setSelectedVaccineToDelete] = useState(null);

  const [deleteDependentUserVaccine] = useDeleteDependentUserVaccineMutation();
  const [deleteUserVaccine] = useDeleteUserVaccineMutation();

  const adminId = localStorage.getItem('adminId');

  const handleDeleteClick = (vaccine) => {
    setSelectedVaccineToDelete(vaccine);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVaccineToDelete || !adminId) {
      toast.error("Missing information for deletion.");
      return;
    }

    try {
      const payload = {
        admin_user_id: adminId,
        user_vaccine_id: selectedVaccineToDelete.user_vaccine_id,
      };

      if (isDependent) {
        await deleteDependentUserVaccine(payload).unwrap();
        toast.success("Dependent vaccine deleted successfully!");
        if (refetchDependentVaccines) refetchDependentVaccines();
      } else {
        await deleteUserVaccine(payload).unwrap();
        toast.success("User vaccine deleted successfully!");
        if (refetchUserVaccines) refetchUserVaccines();
      }
      setOpenDeleteModal(false);
      setSelectedVaccineToDelete(null);
    } catch (error) {
      console.error("Failed to delete vaccine:", error);
      toast.error("Failed to delete vaccine.");
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedVaccineToDelete(null);
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}:</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="flex h-[50px] bg-[#245FFF] text-white font-semibold w-full rounded-lg">
              <th className="flex items-center justify-center rounded-l-lg w-[25%]">Vaccine Name</th>
              <th className="flex items-center justify-center w-[10%]">Dose</th>
              <th className="flex items-center justify-center w-[15%]">Scheduled Date</th>
              <th className="flex items-center justify-center w-[10%]">Status</th>
              <th className="flex items-center justify-center w-[25%]">Days Remaining</th>
              <th className="flex items-center justify-center w-[10%] rounded-r-lg">Actions</th>
            </tr>
            
          </thead>
          <tbody>
            {displayVaccines.length > 0 ? (
              displayVaccines.map((v, i) => (
                <tr
                  key={i}
                  className={`flex h-[50px] text-black font-semibold w-full border border-blue-300 rounded-2xl shadow-sm hover:bg-blue-100 transition mt-2`}
                >
                  <td className="flex items-center justify-center rounded-l-lg w-[25%]">{v.vaccine_name}</td>
                  <td className="flex items-center justify-center w-[10%]">{v.dose_number}</td>
                  <td className="flex items-center justify-center w-[15%]">{new Date(v.scheduled_date).toLocaleDateString()}</td>
                  <td className="flex items-center justify-center w-[10%]">{v.status}</td>
                  <td className="flex items-center justify-center w-[25%]">{v.days_remaining}</td>
                  <td className="flex items-center justify-center w-[10%] rounded-r-lg">
                    {isClickable && (
                      <button className="text-blue-600 hover:text-blue-800 text-lg mr-4 cursor-pointer">
                        <img src={ICONS.reminder} alt="Reminder" onClick={isClickable && onRowClick ? () => onRowClick(v) : undefined} />
                      </button>
                    )}
                    <button
                      className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
                      onClick={() => handleDeleteClick(v)}
                    >
                      <img src={ICONS.delete} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">No vaccine data available for this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={openDeleteModal}
        title="Confirm Vaccine Deletion"
        description="Are you sure you want to delete this vaccine? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
};

export default VaccineTableDisplay;
