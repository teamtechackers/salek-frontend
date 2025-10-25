import React, { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation, useGetUserDetailsQuery } from "../../../../core/services/api/userApi";

const EditUserModal = ({ open, onClose, userId, refetch, refetchUserDetails, onRefreshTrigger, viewOnly = false }) => { // Changed 'user' to 'userId'
  console.log("EditUserModal - refetchUserDetails:", refetchUserDetails);
  const initialFormData = {
    name: "",
    gender: "",
    country: "",
    address: "",
    phoneNumber: "",
    maritalStatus: "",
    children: "",
    pregnancy: "",
    trimester: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  const adminId = localStorage.getItem('adminId');
  const { data: userDetailsResponse, isLoading: loadingUserDetails } = useGetUserDetailsQuery(
    { user_id: userId, admin_user_id: adminId },
    { skip: !userId || !adminId || !open } 
  );
  const user = userDetailsResponse?.data?.user; // Get the actual user object from the response

  useEffect(() => {
    console.log("EditUserModal - useEffect triggered with user:", user);
    if (user) {
      console.log("EditUserModal - Setting form data for user:", user);
      setFormData({
        name: user.full_name || user.username || "", // Use full_name from fetched details
        gender: user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : user.gender || "",
        country: user.country || "",
        address: user.address || "",
        phoneNumber: user.phone_number || user.contact_no || "",
        maritalStatus: user.material_status ? user.material_status.charAt(0).toUpperCase() + user.material_status.slice(1) : "",
        children: user.do_you_have_children ? String(user.how_many_children) : "",
        pregnancy: user.are_you_pregnant ? "Yes" : "No",
        trimester: user.are_you_pregnant && user.pregnancy_detail ? String(user.pregnancy_detail).match(/\d+/)?.[0] || "" : "", // Extract number for trimester
      });
    } else {
      console.log("EditUserModal - No user data, setting initial form data");
      setFormData(initialFormData);
    }
  }, [user, open]); // Depend on 'user' (fetched data) and 'open'

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
      
      const payload = {
        admin_user_id: adminId,
        user_id: userId, // Use userId from props
        full_name: formData.name || null, // Convert empty string to null
        phone_number: formData.phoneNumber || null, // Convert empty string to null
        gender: genderValue || null, // Convert empty string to null
        country: formData.country || null, // Convert empty string to null
        address: formData.address || null, // Convert empty string to null
        material_status: formData.maritalStatus || null, // Convert empty string to null
        do_you_have_children: formData.children > 0 ? 1 : 0, // Changed format
        how_many_children: Number(formData.children) || 0, // Convert to number or 0
        are_you_pregnant: formData.pregnancy === 'Yes' ? 1 : 0, // Changed format
        pregnancy_detail: formData.pregnancy === 'Yes' ? (formData.trimester || null) : null,
      };
      console.log("Sending payload:", payload);
      console.log("Admin ID:", adminId);
      console.log("User ID:", userId);
      console.log("Gender value length:", genderValue ? genderValue.length : 0);
      console.log("Gender value type:", typeof genderValue);
      const result = await updateUser(payload).unwrap();
      console.log("Update successful:", result);
      
      // Close modal and let RTK Query handle the cache invalidation
      console.log("Update successful, closing modal...");
      
      // Refresh detail page data if global refresh function is available
      if (window.refreshUserDetails) {
        console.log("Refreshing detail page data...");
        setTimeout(() => {
          window.refreshUserDetails();
        }, 100);
      }
      
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full w-7 h-7 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={viewOnly}
              className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={viewOnly}
              className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Country & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={viewOnly}
                className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                  readOnly={viewOnly}
                  className={`flex-1 outline-none bg-transparent ${viewOnly ? 'cursor-not-allowed' : ''}`}
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
              readOnly={viewOnly}
              className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                disabled={viewOnly}
                className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                  readOnly={viewOnly}
                  className={`flex-1 outline-none bg-transparent ${viewOnly ? 'cursor-not-allowed' : ''}`}
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
                disabled={viewOnly}
                className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                disabled={viewOnly}
                className={`border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${viewOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Trimester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 gap-3">
            {!viewOnly && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`${viewOnly ? "w-full" : "w-1/2"} bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition`}
            >
              {viewOnly ? "Close" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
