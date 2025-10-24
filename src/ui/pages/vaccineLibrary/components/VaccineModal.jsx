import React, { useEffect, useRef, useState } from "react";
import { ICONS } from "../../../constants/assets";
import { vaccineFields } from "./AddFormlabels";
import { COLORS } from "../../../theme/colors/colors";
import { useAddVaccineMutation, useUpdateVaccineMutation } from "../../../../core/services/api/vaccineApi";

export default function VaccineModal({ open, onClose, refetch, vaccine }) {
  const initialFormData = {
    name: "",
    type: "",
    category: "",
    subCategory: "",
    minAge: 0,
    maxAge: 0,
    totalDoses: 0,
    frequency: "",
    whenToGive: "",
    dose: "",
    route: "",
    site: "",
    notes: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (vaccine) {
      const getOptionValue = (fieldKey, value) => {
        const field = vaccineFields.find(f => f.key === fieldKey);
        if (field && field.options && field.options.includes(value)) {
          return value;
        }
        return ""; // Default to empty string if value is not in options
      };

      setFormData({
        name: vaccine.name || "",
        type: getOptionValue("type", vaccine.type),
        category: getOptionValue("category", vaccine.category),
        subCategory: getOptionValue("subCategory", vaccine.sub_category),
        minAge: vaccine.age_range?.min_age_months || 0,
        maxAge: vaccine.age_range?.max_age_months || 0,
        totalDoses: vaccine.doses?.total_doses || 0,
        frequency: vaccine.doses?.frequency || "",
        whenToGive: vaccine.details?.when_to_give || "",
        dose: vaccine.details?.dose || "",
        route: getOptionValue("route", vaccine.details?.route),
        site: getOptionValue("site", vaccine.details?.site),
        notes: vaccine.details?.notes || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [vaccine, open]);

  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [addVaccine, { isLoading: isAdding, error: addError }] = useAddVaccineMutation();
  const [updateVaccine, { isLoading: isUpdating, error: updateError }] = useUpdateVaccineMutation();

  const handleChange = (key, value) => {
    setFormData((prevData) => {
      const fieldDefinition = vaccineFields.find((field) => field.key === key);
      const processedValue =
        fieldDefinition && fieldDefinition.type === "number"
          ? Number(value) || 0 // Convert to number, default to 0 if empty or invalid
          : value;
      return { ...prevData, [key]: processedValue };
    });
  };

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      const t = setTimeout(() => closeRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";

      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
        if (previouslyFocused.current instanceof HTMLElement) {
          previouslyFocused.current.focus();
        }
        clearTimeout(t);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subCategory) {
      alert("Sub-category is a required field.");
      return;
    }

    try {
      const adminId = localStorage.getItem("adminId");
      const payload = {
        admin_user_id: adminId,
        name: formData.name,
        type: formData.type,
        category: formData.category,
        sub_category: formData.subCategory,
        min_age_months: formData.minAge,
        max_age_months: formData.maxAge,
        total_doses: formData.totalDoses,
        frequency: formData.frequency,
        when_to_give: formData.whenToGive,
        dose: formData.dose,
        route: formData.route,
        site: formData.site,
        notes: formData.notes,
      };

      if (vaccine) {
        // Editing existing vaccine
        await updateVaccine({ vaccine_id: vaccine.vaccine_id, ...payload }).unwrap();
      } else {
        // Adding new vaccine
        await addVaccine(payload).unwrap();
      }

      onClose();
      refetch();
    } catch (err) {
      console.error("Failed to save vaccine:", err);
      // Optionally, display a user-friendly error message
      alert("Failed to save vaccine. Please try again.");
    }
  };

  const renderField = (field) => {
    if (field.type === "text") {
      return (
        <input
          type={field.type}
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full  border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    } else if (field.type === "number") {
      return (
        <input
          type={field.type}
          value={formData[field.key]}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full  border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    } else if (field.type === "select") {
      return (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    } else if (field.type === "textarea") {
      return (
        <textarea
          rows="3"
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      {/* Centered form container */}
      <div className="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-lg border-none overflow-y-auto max-h-[80vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-3 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-semibold">{vaccine ? "Edit Vaccine" : "Add Vaccine"}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="text-white text-2xl leading-none focus:outline-none cursor-pointer"
          >
            <img src={ICONS.cross} alt="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          {/* Row 1 - Name full width */}
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">{vaccineFields[0].label}</label>
            {renderField(vaccineFields[0])}
          </div>

          {/* Row 2 - Type, Category, Sub-category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vaccineFields.slice(1, 4).map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Row 3 - Min Age, Max Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vaccineFields.slice(4, 6).map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Row 4 - Total Doses, Frequency, When to give */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vaccineFields.slice(6, 9).map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Row 5 - Dose, Route, Site */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vaccineFields.slice(9, 12).map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Row 6 - Notes full width */}
          <div>
            <label className="mb-1 text-sm font-medium text-gray-700">{vaccineFields[12].label}</label>
            {renderField(vaccineFields[12])}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg hover:bg-gray-300"
              style={{ backgroundColor: COLORS.grayDark, color: COLORS.white }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
