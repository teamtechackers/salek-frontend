import { useState } from "react";
import TableTopBar from "./TableTopbar";
import { dashboardlabels } from "../../../constants/pages/Labels";
import { vaccines } from "../../../../ui/constants/data/vaccinejson";
import Pagination from "../../../components/Pagination";
import { FONTS } from "../../../theme/typography/fonts";
import { ICONS } from "../../../constants/assets";
import Editmodel from "./Editmodel";
import ConfirmDeleteModal from "../../../../ui/components/ConfirmDeleteDialogBox";
import { STYLES } from "../../../theme/typography/styles";

export default function VaccineTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(vaccines);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 10;
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
    <div className="min-h-screen w-full p-6 flex flex-col">
      {/* Header Section */}
      <div className="mb-4">
        <TableTopBar />
        <p className="font-semibold mt-4 flex justify-between text-lg">
          {dashboardlabels.Totalvacine}
          <span>{items.length}</span>
        </p>
      </div>

      {/* Desktop Grid (scrollable) */}
      <div className="hidden md:block w-full overflow-x-auto flex-1">
        {/* Header Row */}
        <div
          className="min-w-[1200px] grid grid-cols-8 bg-blue-600 text-white text-sm rounded-lg px-4 py-2 font-medium"
          style={{ fontFamily: FONTS.inter_600_20_20 }}
        >
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.vaccine}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.category}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.Age}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.type}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.route}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.dose}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.site}</span>
          <span style={FONTS.inter_400_16_24}>{dashboardlabels.action}</span>
        </div>

        {/* Data Rows */}
        <div className="flex flex-col gap-2 mt-2 min-w-[1200px]">
          {items.length > 0 ? (
            items
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-8 items-center bg-white rounded-md shadow-sm hover:bg-gray-50 px-4 py-2"
                  style={{ fontFamily: FONTS.inter_600_20_20 }}
                >
                  <span style={FONTS.inter_400_16_24}>{item.vaccine}</span>
                  <span style={FONTS.inter_400_16_24}>{item.category}</span>
                  <span style={FONTS.inter_400_16_24}>{item.age}</span>
                  <span style={FONTS.inter_400_16_24}>{item.type}</span>
                  <span style={FONTS.inter_400_16_24}>{item.route}</span>
                  <span style={FONTS.inter_400_16_24}>{item.dose}</span>
                  <span style={FONTS.inter_400_16_24}>{item.site}</span>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-md hover:bg-blue-100"
                      onClick={() => setOpenEdit(true)}
                    >
                      <img src={ICONS.editvacine} alt="Edit" />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-red-100"
                      onClick={() => {
                        setDeleteId(item.id);
                        setOpenDelete(true);
                      }}
                    >
                      <img src={ICONS.deletevacine} alt="Delete" />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-6 text-gray-500">No Data Found</div>
          )}
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="flex flex-col gap-4 md:hidden mt-4 flex-1">
        {items.length > 0 ? (
          items
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                <p>
                  <span className="font-semibold">Vaccine:</span> {item.vaccine}
                </p>
                <p>
                  <span className="font-semibold">Category:</span> {item.category}
                </p>
                <p>
                  <span className="font-semibold">Age:</span> {item.age}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {item.type}
                </p>
                <p>
                  <span className="font-semibold">Route:</span> {item.route}
                </p>
                <p>
                  <span className="font-semibold">Dose:</span> {item.dose}
                </p>
                <p>
                  <span className="font-semibold">Site:</span> {item.site}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="p-2 rounded-md hover:bg-blue-100"
                    onClick={() => setOpenEdit(true)}
                  >
                    <img src={ICONS.editvacine} alt="Edit" />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-red-100"
                    onClick={() => {
                      setDeleteId(item.id);
                      setOpenDelete(true);
                    }}
                  >
                    <img src={ICONS.deletevacine} alt="Delete" />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-6 text-gray-500">No Data Found</div>
        )}
      </div>

      {/* Pagination (always visible at bottom) */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
