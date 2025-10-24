import React, { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation, useGetUserDetailsQuery } from "../../../../core/services/api/userApi";

const EditUserModal = ({ open, onClose, userId, refetch }) => { // Changed 'user' to 'userId'
  const initialFormData = {
    name: "",
    dob: "",
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
    if (user) {
      setFormData({
        name: user.full_name || user.username || "", // Use full_name from fetched details
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "", // Use dob from fetched details
        gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "",
        country: user.country || "",
        address: user.address || "",
        phoneNumber: user.phone_number || "",
        maritalStatus: user.material_status ? user.material_status.charAt(0).toUpperCase() + user.material_status.slice(1) : "",
        children: user.do_you_have_children ? String(user.how_many_children) : "",
        pregnancy: user.are_you_pregnant ? "Yes" : "No",
        trimester: user.are_you_pregnant && user.pregnancy_detail ? String(user.pregnancy_detail).match(/\d+/)?.[0] || "" : "", // Extract number for trimester
      });
    } else {
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
      const payload = {
        admin_user_id: adminId,
        user_id: userId, // Use userId from props
        name: formData.name,
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country,
        address: formData.address,
        phone_number: formData.phoneNumber,
        marital_status: formData.maritalStatus,
        children: Number(formData.children),
        pregnancy: formData.pregnancy,
        trimester: Number(formData.trimester),
      };
      await updateUser(payload).unwrap();
      onClose();
      refetch(); // Refetch user list after successful update
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
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
                <span className="text-gray-500 cursor-pointer">📅</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
