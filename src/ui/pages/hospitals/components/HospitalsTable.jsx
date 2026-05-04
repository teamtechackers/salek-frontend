import React, { useState } from "react";
import HospitalsList from "./HospitalsList";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteDialogBox";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { MESSAGES } from "../../../constants/pages/Labels";

export default function HospitalsTable({ items, onEdit, onDelete, onToggleStatus }) {
    const [openDelete, setOpenDelete] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleConfirmDelete = () => {
        onDelete(deleteId);
        setOpenDelete(false);
        setOpenConfirm(true);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
                <HospitalsList
                    items={items}
                    onEdit={onEdit}
                    onDelete={handleDeleteClick}
                    onToggleStatus={onToggleStatus}
                />
            </div>

            {/* Delete Confirmation */}
            <ConfirmDeleteModal
                open={openDelete}
                title="Delete Hospital"
                description={MESSAGES.DELETE_CONFIRM_HOSPITAL}
                onClose={() => setOpenDelete(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* Success Modal */}
            <ConfirmationModal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Hospital Deleted"
                description="The hospital has been successfully deleted."
                onConfirm={() => setOpenConfirm(false)}
            />
        </div>
    );
}
