import React, { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation, useUpdateDependentMutation } from "../../../../core/services/api/userApi"; // Import both mutations
import CircularProgress from "@mui/material/CircularProgress";

const EditUserModal = ({ open, onClose, user, isDependent, parentUserId, refetchUserDetails, refetchDependentDetails, onSuccessfulEditAndClose }) => {
  console.log("EditUserModal - user:", user);
  console.log("EditUserModal - isDependent:", isDependent);
  console.log("EditUserModal - parentUserId:", parentUserId);
  console.log("EditUserModal - refetchUserDetails:", refetchUserDetails);
  console.log("EditUserModal - refetchDependentDetails:", refetchDependentDetails);

  const initialFormData = {
    name: "",
    dob: "", // Added DOB field
    gender: "",
    country: "",
    address: "",
    phoneNumber: "",
    maritalStatus: "",
    children: "",
    pregnancy: "",
    trimester: "",
    relation: "", // Added for dependents
  };

  const [formData, setFormData] = useState(initialFormData);
  const [updateUser, { isLoading: isUpdatingUser, error: userUpdateError }] = useUpdateUserMutation();
  const [updateDependent, { isLoading: isUpdatingDependent, error: dependentUpdateError }] = useUpdateDependentMutation();

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (user && open) {
      console.log("EditUserModal - Setting form data for user/dependent:", user);
      setFormData({
        name: user.full_name || user.username || user.relation_type || "", // Use full_name or relation_type for dependents
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "", // Format DOB for input type="date"
        gender: user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : user.gender || "",
        country: user.country || "",
        address: user.address || "",
        phoneNumber: user.phone_number || user.contact_no || "",
        maritalStatus: user.material_status ? user.material_status.charAt(0).toUpperCase() + user.material_status.slice(1) : "",
        children: user.do_you_have_children ? String(user.how_many_children) : "",
        pregnancy: user.are_you_pregnant ? "Yes" : "No",
        trimester: user.are_you_pregnant && user.pregnancy_detail ? String(user.pregnancy_detail).match(/\d+/)?.[0] || "" : "",
        relation: user.relation_type || "", // For dependents
      });
    } else {
      console.log("EditUserModal - No user/dependent data or modal closed, setting initial form data");
      setFormData(initialFormData);
    }
  }, [user, open]); // Depend on 'user' (passed data) and 'open'

  const isLoading = isUpdatingUser || isUpdatingDependent;
  const error = userUpdateError || dependentUpdateError;

  const confirmRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      const t = setTimeout(() => confirmRef.current?.focus(), 0);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminId = localStorage.getItem("adminId");
      const genderValue = formData.gender === 'Male' ? 'male' : formData.gender === 'Female' ? 'female' : formData.gender;
      console.log("Form gender:", formData.gender);
      console.log("Converted gender:", genderValue);

      let basePayload = {
        full_name: formData.name || null,
        dob: formData.dob || null,
        phone_number: formData.phoneNumber || null,
        gender: genderValue || null,
        country: formData.country || null,
        address: formData.address || null,
        material_status: formData.maritalStatus || null,
        do_you_have_children: formData.children > 0 ? 1 : 0,
        how_many_children: Number(formData.children) || 0,
        are_you_pregnant: formData.pregnancy === 'Yes' ? 1 : 0,
        pregnancy_detail: formData.pregnancy === 'Yes' ? (formData.trimester || null) : null,
      };

      let result;
      if (isDependent) {
        const dependentUpdatePayload = {
          admin_user_id: adminId,
          user_id: parentUserId, // Use parentUserId from props
          dependent_id: user.id, // Dependent's ID
          ...basePayload,
          relation_type: formData.relation || null, // For dependents
        };
        console.log("Sending dependent update payload:", dependentUpdatePayload);
        result = await updateDependent(dependentUpdatePayload).unwrap();
        if (refetchDependentDetails) {
          refetchDependentDetails();
        }
      } else {
        const userUpdatePayload = {
          admin_user_id: adminId,
          user_id: user.id, // User's ID
          ...basePayload,
        };
        console.log("Sending user update payload:", userUpdatePayload);
        result = await updateUser(userUpdatePayload).unwrap();
        if (refetchUserDetails) {
          refetchUserDetails();
        }
      }

      console.log("Update successful:", result);
      if (onSuccessfulEditAndClose) {
        onSuccessfulEditAndClose(); // Call the new callback to close modal, navigate to main table, and refetch
      } else {
        onClose(); // Fallback to just closing the modal
      }
    } catch (err) {
      console.error("Failed to update:", err);
      alert(`Failed to update ${isDependent ? 'dependent' : 'user'}. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{isDependent ? "Edit Dependent" : "Edit User"}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full w-7 h-7 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        {error ? (
          <p className="text-red-500 p-5">Error: {error.message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
             required
             />
            </div>

            {/* Relation (for dependents) */}
            {isDependent && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Relation</label>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                required
                />
              </div>
            )}

            {/* DOB & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              required
              />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              required
              >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>

            {/* Country & Address */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
               required
               >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent"
                 required
                 />
                  <span className="text-gray-500 cursor-pointer">✏️</span>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                required={!isDependent}           
                 />
            </div>

            {/* Marital & Children */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
               required
               >
                  <option value="">Select Status</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Children</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="flex-1 outline-none bg-transparent"
                 />
                  <span className="text-gray-500 cursor-pointer">✏️</span>
                </div>
              </div>
            </div>

            {/* Pregnancy & Trimester */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Pregnancy</label>
                <select
                  name="pregnancy"
                  value={formData.pregnancy}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
               >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Trimester</label>
                <select
                  name="trimester"
                  value={formData.trimester}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
               >
                  <option value="">Select Trimester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress size={24} color="inherit" />
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-[#444951] text-white py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
