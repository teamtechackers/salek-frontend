import React, { useEffect, useRef, useState } from "react";
import { ICONS } from "../../../constants/assets";
import { vaccineFields } from "./AddFormlabels";
import { COLORS } from "../../../theme/colors/colors";

export default function VaccineForm({ open, onClose }) {
  const [formData, setFormData] = useState({});
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const renderField = (field) => {
    if (field.type === "text" || field.type === "number") {
      return (
        <input
          type={field.type}
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    } else if (field.type === "select") {
      return (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      {/* Centered form container */}
      <div className="max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-lg border-none overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-3 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Vaccine</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="text-white text-2xl leading-none focus:outline-none cursor-pointer"
          >
            <img src={ICONS.cross} alt="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
