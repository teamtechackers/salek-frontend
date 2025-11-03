import React from "react";

export default function RowModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const formatMonths = (m) => (m || m === 0 ? `${m} months` : "N/A");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="mt-12 w-[450px] rounded-2xl overflow-visible">
        {/* Header */}
        <div className="relative">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
            <h2 className="text-lg font-semibold">Vaccine</h2>
          </div>

          {/* white circular close overlapping header (like image) */}
          <button
            onClick={onClose}
            aria-label="close"
            className="absolute right-4 top-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md text-blue-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 8.586L15.293 3.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707A1 1 0 014.707 3.293L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Card body */}
        <div className="bg-white rounded-b-2xl shadow-xl pt-6 pb-6 px-6">
          {/* Title pill (elevated white card) */}
          <div className="mx-auto w-full">
            <div className="bg-white rounded-lg px-4 py-3 shadow-md ring-1 ring-gray-100 text-center">
              <div className="text-lg font-semibold text-gray-800">{data.name || "N/A"}</div>
            </div>
          </div>

          {/* Details card with subtle inner panel and spacing */}
          <div className="mt-5 bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
              <div className="text-gray-500">Type</div>
              <div className="font-medium text-gray-800 text-right">{data.type || "N/A"}</div>

              <div className="text-gray-500">Category</div>
              <div className="font-medium text-gray-800 text-right">{data.category || "N/A"}</div>

              <div className="text-gray-500">Sub-category</div>
              <div className="font-medium text-gray-800 text-right">{data.sub_category || "N/A"}</div>

              <div className="text-gray-500">Minimum Age:</div>
              <div className="font-medium text-gray-800 text-right">{formatMonths(data.age_range?.min_age_months)}</div>

              <div className="text-gray-500">Maximum Age:</div>
              <div className="font-medium text-gray-800 text-right">{formatMonths(data.age_range?.max_age_months)}</div>

              <div className="text-gray-500">Total Doses:</div>
              <div className="font-medium text-gray-800 text-right">{data.doses?.total_doses ?? "N/A"}</div>

              <div className="text-gray-500">Frequency:</div>
              <div className="font-medium text-gray-800 text-right">{data.doses?.frequency || "N/A"}</div>

              <div className="text-gray-500">When to Give:</div>
              <div className="font-medium text-gray-800 text-right">{data.details?.when_to_give || "N/A"}</div>

              <div className="text-gray-500">Dose:</div>
              <div className="font-medium text-gray-800 text-right">{data.details?.dose || "N/A"}</div>

              <div className="text-gray-500">Route:</div>
              <div className="font-medium text-gray-800 text-right">{data.details?.route || "N/A"}</div>

              <div className="text-gray-500">Site:</div>
              <div className="font-medium text-gray-800 text-right">{data.details?.site || "N/A"}</div>
            </div>
          </div>

          {/* Notes small card */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Notes</label>
            <div className="bg-white rounded-lg p-3 ring-1 ring-gray-100 shadow-sm text-sm text-gray-700">
              {data.details?.notes || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
